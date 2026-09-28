import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../common/types/auth-user';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  getCategories() {
    return this.prisma.jobCategory.findMany({
      where: {
        isActive: true,
        specialties: { some: { isActive: true } },
      },
      select: {
        id: true,
        name: true,
        icon: true,
        specialties: {
          where: { isActive: true },
          select: { id: true, name: true, categoryId: true },
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async getRecommended(user: AuthUser, categoryId?: string, specialtyId?: string) {
    await this.closeExpiredJobs();

    if (!user.candidateId) {
      return this.prisma.job.findMany({
        where: {
          status: 'active',
          ...(categoryId && { categoryId }),
          ...(specialtyId && {
            specialtySelections: { some: { specialtyId } },
          }),
        },
        include: {
          company: { select: { id: true, name: true, logoUrl: true } },
          category: true,
          specialtySelections: { include: { specialty: true } },
        },
        take: 20,
        orderBy: { createdAt: 'desc' },
      });
    }

    const preferences = await this.prisma.candidateJobPreference.findMany({
      where: { candidateId: user.candidateId },
      select: {
        categoryId: true,
        specialties: { select: { specialtyId: true } },
      },
    });
    const preferredCategoryIds = preferences.map((preference) => preference.categoryId);
    const preferredSpecialtyIds = preferences.flatMap((preference) =>
      preference.specialties.map((specialty) => specialty.specialtyId),
    );
    const preferencesWithoutSpecialties = preferences
      .filter((preference) => preference.specialties.length === 0)
      .map((preference) => preference.categoryId);
    const preferenceMatches: any[] = [];
    if (preferredSpecialtyIds.length > 0) {
      preferenceMatches.push({
        specialtySelections: {
          some: { specialtyId: { in: preferredSpecialtyIds } },
        },
      });
    }
    if (preferencesWithoutSpecialties.length > 0) {
      preferenceMatches.push({
        categoryId: { in: preferencesWithoutSpecialties },
      });
    }
    preferenceMatches.push({
      AND: [
        { categoryId: { in: preferredCategoryIds } },
        { specialtySelections: { none: {} } },
      ],
    });

    const jobs = await this.prisma.job.findMany({
      where: {
        status: 'active',
        ...(categoryId && { categoryId }),
        ...(specialtyId && {
          specialtySelections: { some: { specialtyId } },
        }),
        ...(preferences.length > 0 && {
          OR: preferenceMatches,
        }),
      },
      include: {
        company: { select: { id: true, name: true, logoUrl: true } },
        category: true,
        specialtySelections: { include: { specialty: true } },
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

  async search(
    query?: string,
    city?: string,
    categoryId?: string,
    specialtyId?: string,
    page = 1,
    limit = 20,
  ) {
    await this.closeExpiredJobs();

    const skip = (page - 1) * limit;
    const where: any = {
      ...this.buildPublicActiveWhere(),
      AND: [],
    };

    if (query) {
      where.AND.push({
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { company: { name: { contains: query, mode: 'insensitive' } } },
        ],
      });
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (specialtyId) {
      where.specialtySelections = { some: { specialtyId } };
    }

    if (!where.AND.length) {
      delete where.AND;
    }

    const [items, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        include: {
          company: { select: { id: true, name: true, logoUrl: true } },
          category: true,
          specialtySelections: { include: { specialty: true } },
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
    return this.listWithExpirationSync(user);
  }

  private async listWithExpirationSync(user: AuthUser) {
    await this.closeExpiredJobs();

    if (user.role === 'super_admin') {
      return this.prisma.job.findMany({
        include: {
          company: true,
          category: true,
          specialtySelections: { include: { specialty: true } },
        },
      });
    }

    if (user.role === 'company_admin') {
      if (!user.companyId) {
        return [];
      }
      return this.prisma.job.findMany({
        where: { companyId: user.companyId },
        include: {
          category: true,
          specialtySelections: { include: { specialty: true } },
        },
      });
    }

    return this.prisma.job.findMany({
      where: this.buildPublicActiveWhere(),
      include: {
        company: { select: { id: true, name: true, logoUrl: true } },
        category: true,
        specialtySelections: { include: { specialty: true } },
      },
    });
  }

  async getCompanyJobs(user: AuthUser, query?: string, city?: string, status?: string, page = 1, limit = 10) {
    await this.closeExpiredJobs();

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
          category: true,
          specialtySelections: { include: { specialty: true } },
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
    await this.closeExpiredJobs();

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
    await this.closeExpiredJobs();

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
          category: true,
          specialtySelections: { include: { specialty: true } },
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
    await this.closeExpiredJobs();

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
    await this.closeExpiredJobs();

    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        category: true,
        specialtySelections: { include: { specialty: true } },
      },
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
    const catalog = await this.resolveJobCatalog(dto.categoryId, dto.specialtyIds ?? []);
    const customCategory = dto.customCategory?.trim() || null;

    return this.prisma.job.create({
      data: {
        companyId,
        categoryId: catalog.categoryId,
        customCategory,
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
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        specialtySelections: {
          create: catalog.specialtyIds.map((specialtyId) => ({
            specialty: { connect: { id: specialtyId } },
          })),
        },
      },
      include: {
        category: true,
        specialtySelections: { include: { specialty: true } },
      },
    });
  }

  async update(id: string, user: AuthUser, dto: UpdateJobDto) {
    await this.closeExpiredJobs();

    const job = await this.prisma.job.findUnique({
      where: { id },
      include: { specialtySelections: true },
    });

    if (!job) {
      throw new NotFoundException('Vacante no encontrada.');
    }

    if (user.role === 'company_admin' && user.companyId !== job.companyId) {
      throw new ForbiddenException('No tienes acceso a esta vacante.');
    }

    const requestedCategoryId =
      dto.categoryId === undefined
        ? job.categoryId
        : dto.categoryId && dto.categoryId !== 'other'
          ? dto.categoryId
          : null;
    const categoryChanged =
      dto.categoryId !== undefined && requestedCategoryId !== job.categoryId;
    const requestedSpecialtyIds =
      dto.specialtyIds ??
      (categoryChanged
        ? []
        : job.specialtySelections.map((selection) => selection.specialtyId));
    const catalog = await this.resolveJobCatalog(
      requestedCategoryId ?? undefined,
      requestedSpecialtyIds,
    );
    const customCategory = dto.customCategory === undefined ? undefined : dto.customCategory.trim() || null;

    return this.prisma.job.update({
      where: { id },
      data: {
        categoryId: catalog.categoryId,
        customCategory,
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
        expiresAt: dto.expiresAt === undefined ? undefined : dto.expiresAt ? new Date(dto.expiresAt) : null,
        ...(dto.specialtyIds !== undefined || categoryChanged
          ? {
              specialtySelections: {
                deleteMany: {},
                create: catalog.specialtyIds.map((specialtyId) => ({
                  specialty: { connect: { id: specialtyId } },
                })),
              },
            }
          : {}),
      },
      include: {
        category: true,
        specialtySelections: { include: { specialty: true } },
      },
    });
  }

  private async resolveJobCatalog(
    requestedCategoryId: string | null | undefined,
    specialtyIds: string[],
  ) {
    let categoryId = requestedCategoryId === 'other' ? null : requestedCategoryId ?? null;
    const uniqueSpecialtyIds = [...new Set(specialtyIds)];
    if (uniqueSpecialtyIds.length !== specialtyIds.length) {
      throw new BadRequestException('No repitas una especialidad en la vacante.');
    }

    const specialties = uniqueSpecialtyIds.length
      ? await this.prisma.jobSpecialty.findMany({
          where: { id: { in: uniqueSpecialtyIds }, isActive: true },
          select: { id: true, categoryId: true },
        })
      : [];
    if (specialties.length !== uniqueSpecialtyIds.length) {
      throw new BadRequestException('Una especialidad seleccionada no existe.');
    }

    const specialtyCategoryIds = [...new Set(specialties.map((item) => item.categoryId))];
    if (categoryId == null && specialtyCategoryIds.length === 1) {
      categoryId = specialtyCategoryIds[0];
    }
    if (specialtyCategoryIds.length > 1 ||
        (specialtyCategoryIds.length === 1 && specialtyCategoryIds[0] !== categoryId)) {
      throw new BadRequestException(
        'Las especialidades deben pertenecer al rubro de la vacante.',
      );
    }

    if (categoryId) {
      const category = await this.prisma.jobCategory.findFirst({
        where: {
          id: categoryId,
          isActive: true,
          specialties: { some: { isActive: true } },
        },
        select: { id: true },
      });
      if (!category) throw new BadRequestException('El rubro seleccionado no existe.');
    }

    return { categoryId, specialtyIds: uniqueSpecialtyIds };
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

  private buildPublicActiveWhere() {
    return {
      status: 'active' as const,
      OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
    };
  }

  private async closeExpiredJobs() {
    await this.prisma.job.updateMany({
      where: {
        status: 'active',
        expiresAt: { lt: new Date() },
      },
      data: {
        status: 'closed',
      },
    });
  }
}
