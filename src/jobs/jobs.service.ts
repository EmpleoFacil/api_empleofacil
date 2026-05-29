import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../common/types/auth-user';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  getCategories() {
    return this.prisma.jobCategory.findMany({
      select: {
        id: true,
        name: true,
        icon: true,
      },
    });
  }

  async getRecommended(user: AuthUser, categoryId?: string) {
    if (!user.candidateId) {
      return this.prisma.job.findMany({
        where: {
          status: 'active',
          ...(categoryId && { categoryId }),
        },
        include: {
          company: { select: { id: true, name: true, logoUrl: true } },
          category: true,
        },
        take: 20,
        orderBy: { createdAt: 'desc' },
      });
    }

    const candidate = await this.prisma.candidateProfile.findUnique({
      where: { id: user.candidateId },
    });

    const jobs = await this.prisma.job.findMany({
      where: {
        status: 'active',
        ...(categoryId && { categoryId }),
      },
      include: {
        company: { select: { id: true, name: true, logoUrl: true } },
        category: true,
        applications: {
          where: { candidateId: user.candidateId },
          select: { id: true, status: true },
        },
        savedJobs: {
          where: { candidateId: user.candidateId },
          select: { id: true },
        },
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    return jobs.map((job) => ({
      ...job,
      isSaved: job.savedJobs.length > 0,
      hasApplied: job.applications.length > 0,
      applicationId: job.applications[0]?.id || null,
      applicationStatus: job.applications[0]?.status || null,
    }));
  }

  async search(query?: string, city?: string, categoryId?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where: any = { status: 'active' };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { company: { name: { contains: query, mode: 'insensitive' } } },
      ];
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [items, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        include: {
          company: { select: { id: true, name: true, logoUrl: true } },
          category: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  list(user: AuthUser) {
    if (user.role === 'super_admin') {
      return this.prisma.job.findMany({ include: { company: true } });
    }

    if (user.role === 'company_admin') {
      if (!user.companyId) {
        return [];
      }
      return this.prisma.job.findMany({ where: { companyId: user.companyId } });
    }

    return this.prisma.job.findMany({ where: { status: 'active' } });
  }

  async getCompanyJobs(user: AuthUser, query?: string, city?: string, status?: string, page = 1, limit = 10) {
    if (!user.companyId) {
      throw new ForbiddenException('Usuario sin empresa asignada.');
    }

    const skip = (page - 1) * limit;
    const where: any = { companyId: user.companyId };

    if (query) {
      where.title = { contains: query, mode: 'insensitive' };
    }
    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }
    if (status && status !== 'all') {
      where.status = status;
    }

    const [items, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        include: {
          _count: { select: { applications: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      items: items.map(j => ({ ...j, applications: j._count.applications })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCompanySummary(user: AuthUser) {
    if (!user.companyId) {
      throw new ForbiddenException('Usuario sin empresa asignada.');
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [active, paused, closed, applications, activePrev, pausedPrev, closedPrev, applicationsPrev] = await Promise.all([
      this.prisma.job.count({ where: { companyId: user.companyId, status: 'active' } }),
      this.prisma.job.count({ where: { companyId: user.companyId, status: 'paused' } }),
      this.prisma.job.count({ where: { companyId: user.companyId, status: 'closed' } }),
      this.prisma.application.count({ where: { job: { companyId: user.companyId } } }),
      this.prisma.job.count({ where: { companyId: user.companyId, status: 'active', createdAt: { lt: thirtyDaysAgo } } }),
      this.prisma.job.count({ where: { companyId: user.companyId, status: 'paused', createdAt: { lt: thirtyDaysAgo } } }),
      this.prisma.job.count({ where: { companyId: user.companyId, status: 'closed', createdAt: { lt: thirtyDaysAgo } } }),
      this.prisma.application.count({ where: { job: { companyId: user.companyId }, appliedAt: { lt: thirtyDaysAgo } } }),
    ]);

    const calcTrend = (current: number, prev: number) => {
      if (prev === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - prev) / prev) * 100);
    };

    return {
      active: { value: active, trend: calcTrend(active, activePrev) },
      paused: { value: paused, trend: calcTrend(paused, pausedPrev) },
      closed: { value: closed, trend: calcTrend(closed, closedPrev) },
      applications: { value: applications, trend: calcTrend(applications, applicationsPrev) },
    };
  }

  async getAdminJobs(query?: string, companyId?: string, status?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { company: { name: { contains: query, mode: 'insensitive' } } },
      ];
    }
    if (companyId) {
      where.companyId = companyId;
    }
    if (status && status !== 'all') {
      where.status = status;
    }

    const [items, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        include: {
          company: { select: { id: true, name: true } },
          _count: { select: { applications: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      items: items.map(j => ({ ...j, applications: j._count.applications })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateStatus(id: string, user: AuthUser, status: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });

    if (!job) {
      throw new NotFoundException('Vacante no encontrada.');
    }

    if (user.role === 'company_admin' && user.companyId !== job.companyId) {
      throw new ForbiddenException('No tienes acceso a esta vacante.');
    }

    return this.prisma.job.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async getById(id: string, user: AuthUser) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!job) {
      throw new NotFoundException('Vacante no encontrada.');
    }

    if (user.role === 'company_admin' && user.companyId !== job.companyId) {
      throw new ForbiddenException('No tienes acceso a esta vacante.');
    }

    if (user.role === 'candidate' && job.status !== 'active') {
      throw new ForbiddenException('Vacante no disponible.');
    }

    return job;
  }

  async create(user: AuthUser, dto: CreateJobDto) {
    const companyId = this.resolveCompanyId(user, dto.companyId);

    return this.prisma.job.create({
      data: {
        companyId,
        title: dto.title,
        description: dto.description,
        requirements: dto.requirements ?? [],
        benefits: dto.benefits ?? [],
        city: dto.city,
        country: dto.country,
        salaryMin: dto.salaryMin,
        salaryMax: dto.salaryMax,
        employmentType: dto.employmentType,
        modality: dto.modality,
        status: (dto.status ?? 'active') as any,
      },
    });
  }

  async update(id: string, user: AuthUser, dto: UpdateJobDto) {
    const job = await this.prisma.job.findUnique({ where: { id } });

    if (!job) {
      throw new NotFoundException('Vacante no encontrada.');
    }

    if (user.role === 'company_admin' && user.companyId !== job.companyId) {
      throw new ForbiddenException('No tienes acceso a esta vacante.');
    }

    return this.prisma.job.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        requirements: dto.requirements,
        benefits: dto.benefits,
        city: dto.city,
        country: dto.country,
        salaryMin: dto.salaryMin,
        salaryMax: dto.salaryMax,
        employmentType: dto.employmentType,
        modality: dto.modality,
        status: dto.status as any,
      },
    });
  }

  async remove(id: string, user: AuthUser) {
    const job = await this.prisma.job.findUnique({ where: { id } });

    if (!job) {
      throw new NotFoundException('Vacante no encontrada.');
    }

    if (user.role === 'company_admin' && user.companyId !== job.companyId) {
      throw new ForbiddenException('No tienes acceso a esta vacante.');
    }

    await this.prisma.job.delete({ where: { id } });
    return { status: 'ok' };
  }

  private resolveCompanyId(user: AuthUser, overrideCompanyId?: string) {
    if (user.role === 'super_admin') {
      if (!overrideCompanyId) {
        throw new ForbiddenException('CompanyId requerido para super admin.');
      }
      return overrideCompanyId;
    }

    if (!user.companyId) {
      throw new ForbiddenException('Usuario sin empresa asignada.');
    }

    return user.companyId;
  }
}
