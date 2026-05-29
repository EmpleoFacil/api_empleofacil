import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../common/types/auth-user';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { UpdateDocumentStatusDto } from './dto/update-document-status.dto';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  getDocumentTypes() {
    return this.prisma.documentType.findMany();
  }

  async upload(user: AuthUser, dto: UploadDocumentDto) {
    if (!user.candidateId) {
      throw new ForbiddenException('Usuario no es candidato.');
    }

    return this.prisma.candidateDocument.create({
      data: {
        candidateId: user.candidateId,
        type: dto.type,
        fileUrl: dto.fileUrl,
        status: 'uploaded',
        uploadedAt: new Date(),
      },
    });
  }

  listForCandidate(user: AuthUser) {
    if (!user.candidateId) {
      throw new ForbiddenException('Usuario no es candidato.');
    }

    return this.prisma.candidateDocument.findMany({
      where: { candidateId: user.candidateId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  listPending() {
    return this.prisma.candidateDocument.findMany({
      where: { status: { in: ['pending', 'uploaded'] } },
      include: { candidate: true },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  listByCandidateId(candidateId: string) {
    return this.prisma.candidateDocument.findMany({
      where: { candidateId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async updateStatus(id: string, dto: UpdateDocumentStatusDto) {
    const document = await this.prisma.candidateDocument.findUnique({ where: { id } });

    if (!document) {
      throw new NotFoundException('Documento no encontrado.');
    }

    return this.prisma.candidateDocument.update({
      where: { id },
      data: { status: dto.status as any, reviewedAt: new Date() },
    });
  }
}
