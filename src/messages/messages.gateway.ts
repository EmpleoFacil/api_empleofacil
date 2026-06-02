import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import type { Server, Socket } from 'socket.io';
import type { AuthUser } from '../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';

type JwtPayload = {
  sub: string;
  role: string;
  companyId?: string | null;
  candidateId?: string | null;
};

@WebSocketGateway({
  namespace: 'messages',
  cors: { origin: true, credentials: true },
})
export class MessagesGateway {
  @WebSocketServer()
  private server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  handleConnection(client: Socket) {
    const token = this.extractToken(client);

    if (!token) {
      client.disconnect(true);
      return;
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      const user: AuthUser = {
        id: payload.sub,
        role: payload.role,
        companyId: payload.companyId,
        candidateId: payload.candidateId,
      };

      client.data.user = user;
      client.join(`user:${user.id}`);
      if (user.candidateId) client.join(`candidate:${user.candidateId}`);
      if (user.companyId) client.join(`company:${user.companyId}`);
    } catch {
      client.disconnect(true);
    }
  }

  @SubscribeMessage('messages:subscribe')
  async subscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() body?: { messageId?: string },
  ) {
    const messageId = body?.messageId;
    if (!messageId) return { ok: false };
    const user = client.data.user as AuthUser | undefined;
    if (!user) return { ok: false };

    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      select: { id: true, candidateId: true, companyId: true },
    });

    if (!message || !this.canAccessMessage(user, message)) {
      return { ok: false };
    }

    client.join(`message:${messageId}`);
    return { ok: true };
  }

  @SubscribeMessage('messages:unsubscribe')
  unsubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() body?: { messageId?: string },
  ) {
    const messageId = body?.messageId;
    if (!messageId) return { ok: false };

    client.leave(`message:${messageId}`);
    return { ok: true };
  }

  emitMessageCreated(message: {
    id: string;
    candidateId: string;
    companyId: string;
  }) {
    this.server
      .to(`candidate:${message.candidateId}`)
      .emit('messages:created', message);
    this.server
      .to(`company:${message.companyId}`)
      .emit('messages:created', message);
  }

  emitMessageUpdated(message: {
    id: string;
    candidateId: string;
    companyId: string;
    status?: unknown;
  }) {
    this.server
      .to(`candidate:${message.candidateId}`)
      .emit('messages:updated', message);
    this.server
      .to(`company:${message.companyId}`)
      .emit('messages:updated', message);
    this.server.to(`message:${message.id}`).emit('messages:updated', message);
  }

  emitMessageResponded(message: {
    id: string;
    candidateId: string;
    companyId: string;
    response: unknown;
  }) {
    this.server
      .to(`candidate:${message.candidateId}`)
      .emit('messages:responded', message);
    this.server
      .to(`company:${message.companyId}`)
      .emit('messages:responded', message);
    this.server.to(`message:${message.id}`).emit('messages:responded', message);
  }

  private extractToken(client: Socket) {
    const authToken = client.handshake.auth?.token;
    if (typeof authToken === 'string') return authToken;

    const headerToken = client.handshake.headers.authorization;
    if (typeof headerToken === 'string' && headerToken.startsWith('Bearer ')) {
      return headerToken.slice('Bearer '.length);
    }

    return null;
  }

  private canAccessMessage(
    user: AuthUser,
    message: { candidateId: string; companyId: string },
  ) {
    if (user.role === 'super_admin') return true;
    if (user.role === 'candidate')
      return user.candidateId === message.candidateId;
    if (user.role === 'company_admin')
      return user.companyId === message.companyId;
    return false;
  }
}
