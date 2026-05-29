import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../common/types/auth-user';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewStatusDto } from './dto/update-interview-status.dto';
import { RescheduleInterviewDto } from './dto/reschedule-interview.dto';

@Injectable()
export class InterviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: AuthUser, dto: CreateInterviewDto) {
    const application = await this.prisma.application.findUnique({
      where: { id: dto.applicationId },
      include: { job: true },
    });

    if (!application) {
      throw new NotFoundException('Postulación no encontrada.');
    }

    if (user.role === 'company_admin' && user.companyId !== application.job.companyId) {
      throw new ForbiddenException('No tienes acceso a esta postulación.');
    }

    const scheduledDate = new Date(dto.date);

    return this.prisma.interview.create({
      data: {
        applicationId: dto.applicationId,
        companyId: application.job.companyId,
        candidateId: application.candidateId,
        date: scheduledDate,
        modality: dto.type,
        location: dto.location,
        meetingUrl: dto.meetingUrl,
        jobId: application.jobId,
        status: (dto.status ?? 'scheduled') as any,
        notesForCandidate: dto.notesForCandidate,
        responsibleUserId: user.id,
      },
    });
  }

  listForCandidate(user: AuthUser) {
    if (!user.candidateId) {
      throw new ForbiddenException('Usuario no es candidato.');
    }

    return this.prisma.interview.findMany({
      where: { candidateId: user.candidateId },
      include: { company: true, application: { include: { job: true } } },
      orderBy: { date: 'asc' },
    });
  }

  async getById(id: string, user: AuthUser) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: {
        company: true,
        candidate: true,
        application: { include: { job: { include: { company: true } } } },
        job: true,
      },
    });

    if (!interview) {
      throw new NotFoundException('Entrevista no encontrada.');
    }

    if (user.role === 'candidate' && user.candidateId !== interview.candidateId) {
      throw new ForbiddenException('No tienes acceso a esta entrevista.');
    }

    return interview;
  }

  async confirm(id: string, user: AuthUser) {
    const interview = await this.prisma.interview.findUnique({ where: { id } });

    if (!interview) {
      throw new NotFoundException('Entrevista no encontrada.');
    }

    if (user.role === 'candidate' && user.candidateId !== interview.candidateId) {
      throw new ForbiddenException('No tienes acceso a esta entrevista.');
    }

    return this.prisma.interview.update({
      where: { id },
      data: { status: 'confirmed' },
    });
  }

  async requestReschedule(id: string, dto: RescheduleInterviewDto, user: AuthUser) {
    const interview = await this.prisma.interview.findUnique({ where: { id } });

    if (!interview) {
      throw new NotFoundException('Entrevista no encontrada.');
    }

    if (user.role === 'candidate' && user.candidateId !== interview.candidateId) {
      throw new ForbiddenException('No tienes acceso a esta entrevista.');
    }

    return this.prisma.interview.update({
      where: { id },
      data: {
        status: 'rescheduled',
        notesForCandidate: dto.reason || interview.notesForCandidate,
      },
    });
  }

  listForCompany(user: AuthUser) {
    if (user.role === 'super_admin') {
      return this.prisma.interview.findMany({
        include: { company: true, candidate: true, application: true },
        orderBy: { date: 'asc' },
      });
    }

    if (!user.companyId) {
      return [];
    }

    return this.prisma.interview.findMany({
      where: { companyId: user.companyId },
      include: { candidate: true, application: { include: { job: true } } },
      orderBy: { date: 'asc' },
    });
  }

  async updateStatus(id: string, dto: UpdateInterviewStatusDto, user: AuthUser) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!interview) {
      throw new NotFoundException('Entrevista no encontrada.');
    }

    if (user.role === 'company_admin' && user.companyId !== interview.companyId) {
      throw new ForbiddenException('No tienes acceso a esta entrevista.');
    }

    if (user.role === 'candidate' && user.candidateId !== interview.candidateId) {
      throw new ForbiddenException('No tienes acceso a esta entrevista.');
    }

    return this.prisma.interview.update({
      where: { id },
      data: { status: dto.status as any },
    });
  }

  async reschedule(id: string, dto: RescheduleInterviewDto, user: AuthUser) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!interview) {
      throw new NotFoundException('Entrevista no encontrada.');
    }

    if (user.role === 'company_admin' && user.companyId !== interview.companyId) {
      throw new ForbiddenException('No tienes acceso a esta entrevista.');
    }

    return this.prisma.interview.update({
      where: { id },
      data: {
        ...(dto.date && { date: new Date(dto.date) }),
        status: 'rescheduled' as any,
        meetingUrl: dto.meetingUrl ?? interview.meetingUrl,
        location: dto.location ?? interview.location,
      },
    });
  }

  async getSummary(user: AuthUser) {
    const where: Record<string, unknown> = {};
    if (user.role === 'company_admin' && user.companyId) {
      where.companyId = user.companyId;
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [total, pending, confirmed, rescheduled, completed, totalPrev] = await Promise.all([
      this.prisma.interview.count({ where }),
      this.prisma.interview.count({ where: { ...where, status: 'scheduled' } }),
      this.prisma.interview.count({ where: { ...where, status: 'confirmed' } }),
      this.prisma.interview.count({ where: { ...where, status: 'rescheduled' } }),
      this.prisma.interview.count({ where: { ...where, status: 'completed' } }),
      this.prisma.interview.count({ where: { ...where, createdAt: { lt: thirtyDaysAgo } } }),
    ]);

    const calcTrend = (curr: number, prev: number) => prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100);

    return {
      total: { value: total, trend: calcTrend(total, totalPrev) },
      pending: { value: pending },
      confirmed: { value: confirmed },
      rescheduled: { value: rescheduled },
      completed: { value: completed },
    };
  }

  listForCompanyPaginated(user: AuthUser, params: { status?: string; jobId?: string; search?: string; dateFrom?: string; dateTo?: string; page?: number; limit?: number }) {
    const { status, jobId, search, dateFrom, dateTo, page = 1, limit = 20 } = params;
    const where: Record<string, unknown> = {};

    if (user.role === 'company_admin' && user.companyId) {
      where.companyId = user.companyId;
    }
    if (status && status !== 'all') where.status = status;
    if (jobId) where.jobId = jobId;
    if (search) {
      where.candidate = { fullName: { contains: search, mode: 'insensitive' } };
    }
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) (where.date as Record<string, unknown>).gte = new Date(dateFrom);
      if (dateTo) (where.date as Record<string, unknown>).lte = new Date(dateTo);
    }

    return this.prisma.interview.findMany({
      where,
      include: { candidate: true, job: true, application: true },
      orderBy: { date: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async update(id: string, user: AuthUser, data: { date?: string; modality?: string; location?: string; meetingUrl?: string; notesForCandidate?: string }) {
    const interview = await this.prisma.interview.findUnique({ where: { id } });
    if (!interview) throw new NotFoundException('Entrevista no encontrada.');
    if (user.role === 'company_admin' && interview.companyId !== user.companyId) {
      throw new ForbiddenException('No tienes acceso a esta entrevista.');
    }

    return this.prisma.interview.update({
      where: { id },
      data: {
        ...(data.date && { date: new Date(data.date) }),
        ...(data.modality && { modality: data.modality }),
        ...(data.location && { location: data.location }),
        ...(data.meetingUrl && { meetingUrl: data.meetingUrl }),
        ...(data.notesForCandidate && { notesForCandidate: data.notesForCandidate }),
      },
    });
  }

  async sendReminder(id: string, user: AuthUser) {
    const interview = await this.prisma.interview.findUnique({ where: { id }, include: { candidate: true } });
    if (!interview) throw new NotFoundException('Entrevista no encontrada.');
    if (user.role === 'company_admin' && interview.companyId !== user.companyId) {
      throw new ForbiddenException('No tienes acceso a esta entrevista.');
    }
    // In a real app, send notification here
    return { sent: true, interviewId: id, candidateId: interview.candidateId };
  }

  async recordResult(id: string, user: AuthUser, data: { result: string; notes?: string; moveApplicationStatus?: string }) {
    const interview = await this.prisma.interview.findUnique({ where: { id }, include: { application: true } });
    if (!interview) throw new NotFoundException('Entrevista no encontrada.');
    if (user.role === 'company_admin' && interview.companyId !== user.companyId) {
      throw new ForbiddenException('No tienes acceso a esta entrevista.');
    }

    const updated = await this.prisma.interview.update({
      where: { id },
      data: {
        status: 'completed',
        result: {
          create: {
            result: data.result,
            notes: data.notes,
            createdBy: user.id,
          },
        },
      },
    });

    if (data.moveApplicationStatus && interview.applicationId) {
      await this.prisma.application.update({
        where: { id: interview.applicationId },
        data: { status: data.moveApplicationStatus as any },
      });
    }

    return updated;
  }
}
