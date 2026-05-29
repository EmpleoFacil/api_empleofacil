import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../common/types/auth-user';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: AuthUser, dto: CreateApplicationDto) {
    if (!user.candidateId) {
      throw new ForbiddenException('Usuario no es candidato.');
    }

    const job = await this.prisma.job.findUnique({ where: { id: dto.jobId } });

    if (!job || job.status !== 'active') {
      throw new NotFoundException('Vacante no disponible.');
    }

    const existing = await this.prisma.application.findUnique({
      where: { jobId_candidateId: { jobId: dto.jobId, candidateId: user.candidateId } },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.application.create({
      data: {
        jobId: dto.jobId,
        candidateId: user.candidateId,
        status: 'applied',
      },
      include: { job: true },
    });
  }

  listForCandidate(user: AuthUser) {
    if (!user.candidateId) {
      throw new ForbiddenException('Usuario no es candidato.');
    }

    return this.prisma.application.findMany({
      where: { candidateId: user.candidateId },
      include: {
        job: { include: { company: true } },
        interviews: { orderBy: { date: 'asc' }, take: 1 },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async getById(id: string, user: AuthUser) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        job: { include: { company: true } },
        candidate: true,
        interviews: { orderBy: { date: 'asc' } },
        messages: { orderBy: { createdAt: 'desc' } },
        notes: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!application) {
      throw new NotFoundException('Postulación no encontrada.');
    }

    if (user.role === 'candidate' && user.candidateId !== application.candidateId) {
      throw new ForbiddenException('No tienes acceso a esta postulación.');
    }

    return application;
  }

  async getByJobForCandidate(jobId: string, user: AuthUser) {
    if (!user.candidateId) {
      return null;
    }

    return this.prisma.application.findUnique({
      where: {
        jobId_candidateId: {
          jobId,
          candidateId: user.candidateId,
        },
      },
      select: { id: true, status: true, appliedAt: true },
    });
  }

  async getSummary(user: AuthUser) {
    if (!user.candidateId) {
      throw new ForbiddenException('Usuario no es candidato.');
    }

    const applications = await this.prisma.application.findMany({
      where: { candidateId: user.candidateId },
      select: { status: true },
    });

    const summary = {
      total: applications.length,
      enRevision: applications.filter(a => a.status === 'applied' || a.status === 'reviewing').length,
      entrevista: applications.filter(a => a.status === 'interview_scheduled' || a.status === 'interview_confirmed').length,
      noSeleccionado: applications.filter(a => a.status === 'rejected').length,
      postulado: applications.filter(a => a.status === 'applied').length,
    };

    return summary;
  }

  async getStatusSummary(user: AuthUser) {
    if (!user.candidateId) {
      throw new ForbiddenException('Usuario no es candidato.');
    }

    const applications = await this.prisma.application.findMany({
      where: { candidateId: user.candidateId },
      select: { status: true },
    });

    return {
      enRevision: applications.filter(a => a.status === 'applied' || a.status === 'reviewing').length,
    };
  }

  listForCompany(user: AuthUser) {
    if (user.role === 'super_admin') {
      return this.prisma.application.findMany({
        include: { job: { include: { company: true } }, candidate: true },
        orderBy: { appliedAt: 'desc' },
      });
    }

    if (!user.companyId) {
      return [];
    }

    return this.prisma.application.findMany({
      where: { job: { companyId: user.companyId } },
      include: { job: true, candidate: true },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async updateStatus(id: string, dto: UpdateApplicationStatusDto, user: AuthUser) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { job: true },
    });

    if (!application) {
      throw new NotFoundException('Postulación no encontrada.');
    }

    if (user.role === 'company_admin' && user.companyId !== application.job.companyId) {
      throw new ForbiddenException('No tienes acceso a esta postulación.');
    }

    return this.prisma.application.update({
      where: { id },
      data: { status: dto.status as any },
    });
  }

  async getSummaryForCompany(user: AuthUser) {
    if (!user.companyId && user.role !== 'super_admin') {
      throw new ForbiddenException('Usuario sin empresa asignada.');
    }

    const companyId = user.companyId;
    const baseWhere = user.role === 'super_admin' ? {} : { job: { companyId: companyId as string } };
    const apps = await this.prisma.application.findMany({ where: baseWhere, select: { status: true } });

    return {
      total: { value: apps.length },
      nuevo: { value: apps.filter(a => a.status === 'applied').length },
      enRevision: { value: apps.filter(a => a.status === 'reviewing').length },
      entrevista: { value: apps.filter(a => a.status === 'interview_scheduled' || a.status === 'interview_confirmed').length },
      descartado: { value: apps.filter(a => a.status === 'rejected').length },
      contratado: { value: apps.filter(a => a.status === 'hired').length },
    };
  }

  async getPipeline(user: AuthUser, jobId?: string) {
    if (!user.companyId && user.role !== 'super_admin') {
      throw new ForbiddenException('Usuario sin empresa asignada.');
    }

    const companyId = user.companyId;
    const baseWhere = user.role === 'super_admin' ? {} : { job: { companyId: companyId as string } };
    const where = jobId ? { ...baseWhere, jobId } : baseWhere;

    const apps = await this.prisma.application.findMany({
      where,
      include: {
        candidate: { select: { id: true, fullName: true, city: true } },
        job: { select: { id: true, title: true } },
      },
      orderBy: { appliedAt: 'desc' },
    });

    const statuses = ['applied', 'reviewing', 'interview_scheduled', 'rejected'];
    const pipeline: Record<string, typeof apps> = {};
    statuses.forEach(s => { pipeline[s] = apps.filter(a => a.status === s); });

    return pipeline;
  }

  async listForCompanyPaginated(user: AuthUser, params: { search?: string; jobId?: string; status?: string; page?: number; limit?: number }) {
    if (!user.companyId && user.role !== 'super_admin') {
      throw new ForbiddenException('Usuario sin empresa asignada.');
    }

    const { search, jobId, status, page = 1, limit = 20 } = params;
    const companyId = user.companyId;
    const baseWhere = user.role === 'super_admin' ? {} : { job: { companyId: companyId as string } };
    
    const where: Record<string, unknown> = { ...baseWhere };
    if (jobId) where.jobId = jobId;
    if (status) where.status = status;
    if (search) {
      where.candidate = { fullName: { contains: search, mode: 'insensitive' } };
    }

    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        include: {
          candidate: { select: { id: true, fullName: true, city: true } },
          job: { select: { id: true, title: true } },
        },
        orderBy: { appliedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.application.count({ where }),
    ]);

    return {
      applications,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async addNote(id: string, user: AuthUser, content: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { job: true },
    });

    if (!application) {
      throw new NotFoundException('Postulación no encontrada.');
    }

    if (user.role === 'company_admin' && user.companyId !== application.job.companyId) {
      throw new ForbiddenException('No tienes acceso a esta postulación.');
    }

    return this.prisma.applicationNote.create({
      data: {
        applicationId: id,
        authorUserId: user.id,
        note: content,
      },
    });
  }

  async exportForCompany(user: AuthUser, jobId?: string) {
    if (!user.companyId && user.role !== 'super_admin') {
      throw new ForbiddenException('Usuario sin empresa asignada.');
    }

    const companyId = user.companyId;
    const baseWhere = user.role === 'super_admin' ? {} : { job: { companyId: companyId as string } };
    const where = jobId ? { ...baseWhere, jobId } : baseWhere;

    return this.prisma.application.findMany({
      where,
      include: {
        candidate: { select: { fullName: true, phone: true, city: true } },
        job: { select: { title: true } },
      },
      orderBy: { appliedAt: 'desc' },
    });
  }
}
