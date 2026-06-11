import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { AuthUser } from '../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RecoverAccessDto } from './dto/recover-access.dto';
import { RegisterCandidateDto } from './dto/register-candidate.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async registerCandidate(dto: RegisterCandidateDto) {
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Debes proporcionar email o teléfono.');
    }

    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email ?? '' },
          { phone: dto.phone ?? '' },
          { secondaryPhone: dto.secondaryPhone ?? '' },
        ].filter((c) => Object.values(c).some(Boolean)) as any,
      },
    });

    if (existing) {
      throw new BadRequestException('El usuario ya existe.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        secondaryPhone: dto.secondaryPhone,
        passwordHash,
        role: 'candidate' as any,
        candidateProfile: {
          create: {
            fullName: dto.fullName,
            city: dto.city,
            country: dto.country,
            phone: dto.phone,
            desiredJobType: dto.desiredJobType,
            profileCompletion: 0,
          },
        },
      },
      include: { candidateProfile: true },
    });

    return this.buildAuthResponse(
      user,
      user.candidateProfile?.id ?? null,
      null,
    );
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.identifier }, { phone: dto.identifier }],
      },
      include: { candidateProfile: true, companyUsers: true },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const companyId = user.companyUsers[0]?.companyId ?? null;
    return this.buildAuthResponse(
      user,
      user.candidateProfile?.id ?? null,
      companyId,
    );
  }

  async recoverAccess(dto: RecoverAccessDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.identifier }, { phone: dto.identifier }],
      },
    });

    if (!user) {
      return {
        status: 'ok',
        message: 'Si el usuario existe, recibirá un código de recuperación.',
      };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const recovery = await this.prisma.passwordRecovery.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });
    const delivery = await this.deliverRecoveryCode(user, code);

    return {
      recoveryId: recovery.id,
      expiresIn: 300,
      ...delivery,
    };
  }

  async verifyCode(dto: VerifyCodeDto) {
    const recovery = await this.prisma.passwordRecovery.findFirst({
      where: {
        id: dto.recoveryId,
        code: dto.code,
        usedAt: null,
        expiresAt: { gte: new Date() },
      },
    });

    if (!recovery) {
      throw new BadRequestException('Código inválido o expirado.');
    }

    const resetToken = this.jwtService.sign(
      { recoveryId: recovery.id, userId: recovery.userId },
      { expiresIn: '15m' },
    );

    return {
      resetToken,
      verified: true,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    let payload: { recoveryId: string; userId: string };
    try {
      payload = this.jwtService.verify(dto.resetToken);
    } catch {
      throw new BadRequestException('Token inválido o expirado.');
    }

    const recovery = await this.prisma.passwordRecovery.findFirst({
      where: {
        id: payload.recoveryId,
        usedAt: null,
      },
    });

    if (!recovery) {
      throw new BadRequestException('Solicitud de recuperación ya utilizada.');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: payload.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordRecovery.update({
        where: { id: recovery.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return {
      status: 'ok',
      message: 'Contraseña actualizada correctamente.',
    };
  }

  async getMe(user: AuthUser) {
    return this.prisma.user.findUnique({
      where: { id: user.id },
      include: { candidateProfile: true, companyUsers: true },
    });
  }

  private buildAuthResponse(
    user: {
      id: string;
      email: string | null;
      phone: string | null;
      secondaryPhone?: string | null;
      role: string;
    },
    candidateId: string | null,
    companyId: string | null,
  ) {
    const payload = {
      sub: user.id,
      role: user.role,
      candidateId,
      companyId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        secondaryPhone: user.secondaryPhone ?? null,
        role: user.role,
        candidateId,
        companyId,
      },
    };
  }

  private async deliverRecoveryCode(
    user: { email: string | null; phone: string | null },
    code: string,
  ) {
    const smtpHost = this.config.get<string>('SMTP_HOST');
    const smtpPort = Number(this.config.get<string>('SMTP_PORT') ?? '587');
    const smtpUser = this.config.get<string>('SMTP_USER');
    const smtpPass = this.config.get<string>('SMTP_PASS');
    const smtpFrom =
      this.config.get<string>('SMTP_FROM') ?? 'no-reply@empleofacil.local';
    const isProduction = this.config.get<string>('NODE_ENV') === 'production';

    if (user.email && smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort == 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: user.email,
        subject: 'Codigo de recuperacion - Empleo',
        text: 'Tu codigo de recuperacion es ' + code + '. Expira en 5 minutos.',
      });

      return {
        deliveryMethod: 'email',
      };
    }

    if (!isProduction) {
      return {
        deliveryMethod: user.phone ? 'sms' : 'email',
        debugCode: code,
      };
    }

    throw new BadRequestException(
      'Recuperacion no configurada para este entorno.',
    );
  }
}
