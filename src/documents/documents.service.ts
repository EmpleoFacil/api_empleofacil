import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseStorageService } from '../supabase/supabase-storage.service';
import type { AuthUser } from '../common/types/auth-user';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { UpdateDocumentStatusDto } from './dto/update-document-status.dto';
import { extname } from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: SupabaseStorageService,
  ) {}

  getDocumentTypes() {
    return this.prisma.documentType.findMany();
  }

  async upload(user: AuthUser, dto: UploadDocumentDto, file?: Express.Multer.File) {
    if (!user.candidateId) {
      throw new ForbiddenException('Usuario no es candidato.');
    }
    if (!file) {
      throw new BadRequestException('Selecciona un archivo para subir.');
    }

    const ext = extname(file.originalname).toLowerCase();
    const mimeType = this.mimeTypeForExtension(ext);
    if (!mimeType || !this.hasValidSignature(ext, file.buffer)) {
      throw new BadRequestException('El contenido no coincide con un formato permitido.');
    }

    const existing = dto.replace
      ? await this.prisma.candidateDocument.findFirst({
          where: { candidateId: user.candidateId, type: dto.type },
          orderBy: { uploadedAt: 'desc' },
        })
      : null;
    const fileName = `${randomUUID()}${ext}`;
    const fileUrl = await this.storage.uploadDocument(file, fileName, user.candidateId, mimeType);

    let saved;
    try {
      saved = await this.prisma.candidateDocument.create({
        data: {
          candidateId: user.candidateId,
          type: dto.type,
          fileUrl,
          status: 'uploaded',
          uploadedAt: new Date(),
        },
      });
    } catch (error) {
      await this.storage.removeDocumentFile(fileUrl);
      throw error;
    }

    if (existing) {
      try {
        await this.prisma.candidateDocument.delete({ where: { id: existing.id } });
        if (existing.fileUrl?.startsWith('storage://')) {
          await this.storage.removeDocumentFile(existing.fileUrl);
        }
      } catch {
        // Keep the newly uploaded document even if cleanup of its predecessor fails.
      }
    }
    return this.withSignedFileUrl(saved);
  }

  async listForCandidate(user: AuthUser) {
    if (!user.candidateId) {
      throw new ForbiddenException('Usuario no es candidato.');
    }

    const documents = await this.prisma.candidateDocument.findMany({
      where: { candidateId: user.candidateId },
      orderBy: { uploadedAt: 'desc' },
    });
    return this.withSignedFileUrls(documents);
  }

  async listPending() {
    const documents = await this.prisma.candidateDocument.findMany({
      where: { status: { in: ['pending', 'uploaded'] } },
      include: { candidate: true },
      orderBy: { uploadedAt: 'desc' },
    });
    return this.withSignedFileUrls(documents);
  }

  async listByCandidateId(candidateId: string, user: AuthUser) {
    if (user.role === 'company_admin') {
      if (!user.companyId) {
        throw new ForbiddenException('Usuario sin empresa asignada.');
      }
      const hasApplication = await this.prisma.application.count({
        where: { candidateId, job: { companyId: user.companyId } },
      });
      if (!hasApplication) {
        throw new ForbiddenException('No tienes acceso a los documentos de este candidato.');
      }
    }

    const documents = await this.prisma.candidateDocument.findMany({
      where: { candidateId },
      orderBy: { uploadedAt: 'desc' },
    });
    return this.withSignedFileUrls(documents);
  }

  private async withSignedFileUrl<T extends { fileUrl: string | null }>(document: T): Promise<T> {
    if (!document.fileUrl?.startsWith('storage://')) return document;
    return { ...document, fileUrl: await this.storage.createSignedDocumentUrl(document.fileUrl) };
  }

  private withSignedFileUrls<T extends { fileUrl: string | null }>(documents: T[]): Promise<T[]> {
    return Promise.all(documents.map((document) => this.withSignedFileUrl(document)));
  }

  private mimeTypeForExtension(extension: string) {
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
    };
    return mimeTypes[extension];
  }

  private hasValidSignature(extension: string, buffer: Buffer) {
    if (extension === '.pdf') return buffer.subarray(0, 5).toString() === '%PDF-';
    if (extension === '.png') return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    if (extension === '.jpg' || extension === '.jpeg') return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    if (extension === '.docx') return buffer.subarray(0, 2).toString() === 'PK';
    if (extension === '.doc') return buffer.subarray(0, 4).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0]));
    return false;
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
