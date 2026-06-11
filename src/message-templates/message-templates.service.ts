import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageTemplateDto } from './dto/create-message-template.dto';
import { UpdateMessageTemplateDto } from './dto/update-message-template.dto';
import type { AuthUser } from '../common/types/auth-user';
import { assertNoOffensiveContent } from '../common/utils/text-moderation';

@Injectable()
export class MessageTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user: AuthUser) {
    const where =
      user.role === 'super_admin'
        ? { isActive: true }
        : {
            isActive: true,
            OR: [{ companyId: null }, { companyId: user.companyId }],
          };

    const templates = await this.prisma.messageTemplate.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return { items: templates };
  }

  async create(user: AuthUser, dto: CreateMessageTemplateDto) {
    assertNoOffensiveContent([
      { label: 'nombre de plantilla', value: dto.name },
      { label: 'asunto de plantilla', value: dto.subject },
      { label: 'contenido de plantilla', value: dto.body },
    ]);

    const companyId =
      user.role === 'super_admin' ? dto.companyId ?? null : user.companyId;

    const template = await this.prisma.messageTemplate.create({
      data: {
        companyId,
        name: dto.name,
        type: dto.type as any,
        subject: dto.subject,
        body: dto.body,
      },
    });

    return {
      success: true,
      message: 'Plantilla creada correctamente',
      data: template,
    };
  }

  async update(user: AuthUser, id: string, dto: UpdateMessageTemplateDto) {
    assertNoOffensiveContent([
      { label: 'nombre de plantilla', value: dto.name },
      { label: 'asunto de plantilla', value: dto.subject },
      { label: 'contenido de plantilla', value: dto.body },
    ]);

    const template = await this.prisma.messageTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Plantilla no encontrada');
    }

    if (
      user.role !== 'super_admin' &&
      template.companyId !== user.companyId
    ) {
      throw new ForbiddenException('No tienes acceso a esta plantilla');
    }

    const updated = await this.prisma.messageTemplate.update({
      where: { id },
      data: {
        name: dto.name,
        type: dto.type as any,
        subject: dto.subject,
        body: dto.body,
      },
    });

    return {
      success: true,
      message: 'Plantilla actualizada correctamente',
      data: updated,
    };
  }
}
