import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../common/types/auth-user';

@Injectable()
export class SavedJobsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByCandidate(user: AuthUser) {
    if (!user.candidateId) {
      throw new ForbiddenException('Usuario no es candidato');
    }

    const savedJobs = await this.prisma.savedJob.findMany({
      where: { candidateId: user.candidateId },
      include: {
        job: {
          include: {
            company: { select: { id: true, name: true, logoUrl: true } },
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { items: savedJobs.map((s) => s.job) };
  }

  async save(user: AuthUser, jobId: string) {
    if (!user.candidateId) {
      throw new ForbiddenException('Usuario no es candidato');
    }

    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Vacante no encontrada');
    }

    const existing = await this.prisma.savedJob.findUnique({
      where: {
        candidateId_jobId: {
          candidateId: user.candidateId,
          jobId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Vacante ya está guardada');
    }

    await this.prisma.savedJob.create({
      data: {
        candidateId: user.candidateId,
        jobId,
      },
    });

    return { success: true, message: 'Vacante guardada correctamente' };
  }

  async unsave(user: AuthUser, jobId: string) {
    if (!user.candidateId) {
      throw new ForbiddenException('Usuario no es candidato');
    }

    const existing = await this.prisma.savedJob.findUnique({
      where: {
        candidateId_jobId: {
          candidateId: user.candidateId,
          jobId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Vacante no está guardada');
    }

    await this.prisma.savedJob.delete({
      where: { id: existing.id },
    });

    return { success: true, message: 'Vacante removida de guardadas' };
  }
}
