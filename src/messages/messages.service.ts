import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../common/types/auth-user';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesGateway } from './messages.gateway';
import { RespondMessageDto } from './dto/respond-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly messagesGateway: MessagesGateway,
  ) {}

  async create(user: AuthUser, dto: CreateMessageDto) {
    const companyId =
      user.role === 'super_admin' ? dto.companyId : user.companyId;

    if (!companyId) {
      throw new ForbiddenException('CompanyId requerido.');
    }

    const message = await this.prisma.message.create({
      data: {
        companyId,
        candidateId: dto.candidateId,
        applicationId: dto.applicationId,
        type: dto.type as any,
        title: dto.title,
        body: dto.body,
        status: 'sent' as any,
        sentAt: new Date(),
      },
    });

    this.messagesGateway.emitMessageCreated(message);
    return message;
  }

  listForCandidate(user: AuthUser, filter?: string) {
    if (!user.candidateId) {
      throw new ForbiddenException('Usuario no es candidato.');
    }

    const where: Record<string, unknown> = {
      candidateId: user.candidateId,
    };

    if (filter == 'important') {
      where.type = {
        in: ['interview_invitation', 'document_request'],
      };
    }

    if (filter == 'unread') {
      where.status = {
        in: ['sent', 'unread'],
      };
    }

    return this.prisma.message.findMany({
      where,
      include: { company: true, application: true, responses: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnreadCount(user: AuthUser) {
    if (!user.candidateId) {
      throw new ForbiddenException('Usuario no es candidato.');
    }

    const count = await this.prisma.message.count({
      where: {
        candidateId: user.candidateId,
        status: { in: ['sent', 'unread'] },
      },
    });

    return { unreadCount: count };
  }

  async markAsRead(id: string, user: AuthUser) {
    const message = await this.prisma.message.findUnique({ where: { id } });

    if (!message) {
      throw new NotFoundException('Mensaje no encontrado.');
    }

    if (user.role === 'candidate' && user.candidateId !== message.candidateId) {
      throw new ForbiddenException('No tienes acceso a este mensaje.');
    }

    const updated = await this.prisma.message.update({
      where: { id },
      data: { status: 'read', readAt: new Date() },
    });

    this.messagesGateway.emitMessageUpdated(updated);
    return updated;
  }

  listForCompany(user: AuthUser) {
    if (user.role === 'super_admin') {
      return this.prisma.message.findMany({
        include: { candidate: true, application: true, responses: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (!user.companyId) {
      return [];
    }

    return this.prisma.message.findMany({
      where: { companyId: user.companyId },
      include: { candidate: true, application: true, responses: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string, user: AuthUser) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: {
        company: true,
        candidate: true,
        application: true,
        responses: true,
      },
    });

    if (!message) {
      throw new NotFoundException('Mensaje no encontrado.');
    }

    if (user.role === 'candidate' && user.candidateId !== message.candidateId) {
      throw new ForbiddenException('No tienes acceso a este mensaje.');
    }

    if (user.role === 'company_admin' && user.companyId !== message.companyId) {
      throw new ForbiddenException('No tienes acceso a este mensaje.');
    }

    return message;
  }

  async respond(id: string, dto: RespondMessageDto, user: AuthUser) {
    if (!user.candidateId) {
      throw new ForbiddenException('Usuario no es candidato.');
    }

    const message = await this.prisma.message.findUnique({ where: { id } });

    if (!message) {
      throw new NotFoundException('Mensaje no encontrado.');
    }

    if (message.candidateId !== user.candidateId) {
      throw new ForbiddenException('No tienes acceso a este mensaje.');
    }

    const response = await this.prisma.messageResponse.create({
      data: {
        messageId: message.id,
        candidateId: user.candidateId,
        responseType: dto.responseType,
        body: dto.body,
      },
    });

    const updated = await this.prisma.message.update({
      where: { id: message.id },
      data: { status: 'responded', respondedAt: new Date() },
    });

    this.messagesGateway.emitMessageResponded({
      ...updated,
      response,
    });

    return { messageId: message.id, response };
  }

  async updateStatus(id: string, dto: UpdateMessageStatusDto, user: AuthUser) {
    const message = await this.prisma.message.findUnique({ where: { id } });

    if (!message) {
      throw new NotFoundException('Mensaje no encontrado.');
    }

    if (user.role === 'company_admin' && user.companyId !== message.companyId) {
      throw new ForbiddenException('No tienes acceso a este mensaje.');
    }

    const updated = await this.prisma.message.update({
      where: { id },
      data: { status: dto.status as any },
    });

    this.messagesGateway.emitMessageUpdated(updated);
    return updated;
  }

  listForCompanyPaginated(
    user: AuthUser,
    params: {
      status?: string;
      candidateId?: string;
      search?: string;
      page?: number;
      limit?: number;
    },
  ) {
    const { status, candidateId, search, page = 1, limit = 20 } = params;
    const where: Record<string, unknown> = {};

    if (user.role === 'company_admin' && user.companyId) {
      where.companyId = user.companyId;
    }
    if (status && status !== 'all') where.status = status;
    if (candidateId) where.candidateId = candidateId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { candidate: { fullName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    return this.prisma.message.findMany({
      where,
      include: {
        candidate: true,
        application: { include: { job: true } },
        responses: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async resend(id: string, user: AuthUser) {
    const message = await this.prisma.message.findUnique({ where: { id } });

    if (!message) {
      throw new NotFoundException('Mensaje no encontrado.');
    }

    if (user.role === 'company_admin' && user.companyId !== message.companyId) {
      throw new ForbiddenException('No tienes acceso a este mensaje.');
    }

    const updated = await this.prisma.message.update({
      where: { id },
      data: { status: 'sent', sentAt: new Date() },
    });

    this.messagesGateway.emitMessageUpdated(updated);
    return updated;
  }

  getTemplates(user: AuthUser) {
    const where: Record<string, unknown> = {};
    if (user.role === 'company_admin' && user.companyId) {
      where.OR = [{ companyId: user.companyId }, { companyId: null }];
    }
    return this.prisma.messageTemplate.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  createTemplate(
    user: AuthUser,
    data: { name: string; subject: string; body: string; type?: string },
  ) {
    return this.prisma.messageTemplate.create({
      data: {
        name: data.name,
        subject: data.subject,
        body: data.body,
        type: (data.type ?? 'general_message') as any,
        companyId: user.companyId,
      },
    });
  }

  async updateTemplate(
    id: string,
    user: AuthUser,
    data: { name?: string; subject?: string; body?: string },
  ) {
    const template = await this.prisma.messageTemplate.findUnique({
      where: { id },
    });
    if (!template) throw new NotFoundException('Plantilla no encontrada.');
    if (
      user.role === 'company_admin' &&
      template.companyId !== user.companyId
    ) {
      throw new ForbiddenException('No tienes acceso a esta plantilla.');
    }
    return this.prisma.messageTemplate.update({ where: { id }, data });
  }

  async deleteTemplate(id: string, user: AuthUser) {
    const template = await this.prisma.messageTemplate.findUnique({
      where: { id },
    });
    if (!template) throw new NotFoundException('Plantilla no encontrada.');
    if (
      user.role === 'company_admin' &&
      template.companyId !== user.companyId
    ) {
      throw new ForbiddenException('No tienes acceso a esta plantilla.');
    }
    return this.prisma.messageTemplate.delete({ where: { id } });
  }
}
