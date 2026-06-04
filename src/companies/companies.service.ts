import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../common/types/auth-user';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import * as bcrypt from 'bcryptjs';
import { SupabaseStorageService } from '../supabase/supabase-storage.service';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: SupabaseStorageService,
  ) {}

  list(user: AuthUser) {
    if (user.role === 'super_admin') {
      return this.prisma.company.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    if (!user.companyId) {
      return [];
    }

    return this.prisma.company.findMany({ where: { id: user.companyId } });
  }

  async getById(id: string, user: AuthUser) {
    const company = await this.prisma.company.findUnique({ where: { id } });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada.');
    }

    if (user.role !== 'super_admin' && user.companyId !== company.id) {
      throw new ForbiddenException('No tienes acceso a esta empresa.');
    }

    return company;
  }

  async create(dto: CreateCompanyDto) {
    const slug = dto.slug?.trim() || this.slugify(dto.name);

    return this.prisma.company.create({
      data: {
        name: dto.name,
        slug,
        legalName: dto.legalName,
        email: dto.email,
        phone: dto.phone,
        country: dto.country,
        city: dto.city,
        status: (dto.status ?? 'active') as any,
      },
    });
  }

  async update(id: string, dto: UpdateCompanyDto, user: AuthUser) {
    if (user.role !== 'super_admin' && user.companyId !== id) {
      throw new ForbiddenException('No tienes permisos para modificar esta empresa.');
    }

    return this.prisma.company.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        legalName: dto.legalName,
        email: dto.email,
        phone: dto.phone,
        country: dto.country,
        city: dto.city,
        status: dto.status as any,
      },
    });
  }

  async getPlanLimits(user: AuthUser) {
    if (!user.companyId) {
      throw new ForbiddenException('Usuario sin empresa asignada.');
    }

    const company = await this.prisma.company.findUnique({
      where: { id: user.companyId },
      include: { plan: true },
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada.');
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [jobsThisMonth, totalJobs, visibleCandidates, usersCount] = await Promise.all([
      this.prisma.job.count({
        where: { companyId: user.companyId, createdAt: { gte: startOfMonth } },
      }),
      this.prisma.job.count({ where: { companyId: user.companyId, status: 'active' } }),
      this.prisma.application.count({
        where: { job: { companyId: user.companyId }, status: { not: 'rejected' } },
      }),
      this.prisma.companyUser.count({ where: { companyId: user.companyId } }),
    ]);

    const pubLimit = company.plan?.publicationLimit ?? 5;
    const candLimit = company.plan?.visibleCandidatesLimit ?? 100;
    const userLimit = (company.plan as any)?.userLimit ?? 3;

    return {
      plan: {
        name: company.plan?.name ?? 'Básico',
        id: company.planId,
      },
      limits: {
        activeJobs: { current: totalJobs, max: pubLimit, remaining: Math.max(0, pubLimit - totalJobs) },
        visibleCandidates: { current: visibleCandidates, max: candLimit, remaining: Math.max(0, candLimit - visibleCandidates) },
      },
      usage: {
        jobsThisMonth,
        jobs: { current: totalJobs, max: pubLimit },
        users: { current: usersCount, max: userLimit },
        candidates: { current: visibleCandidates, max: candLimit },
        activeJobs: { current: totalJobs, max: pubLimit },
        visibleCandidates: { current: visibleCandidates, max: candLimit },
      },
    };
  }

  private mapCompanyRole(role: string): string {
    const mapping: Record<string, string> = {
      company_admin: 'admin',
      company_recruiter: 'recruiter',
      admin: 'admin',
      recruiter: 'recruiter',
      editor: 'editor',
      viewer: 'viewer',
    };
    return mapping[role] ?? 'viewer';
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async getMe(user: AuthUser) {
    if (!user.companyId) {
      throw new ForbiddenException('Usuario sin empresa asignada.');
    }
    return this.prisma.company.findUnique({
      where: { id: user.companyId },
      include: { plan: true },
    });
  }

  async updateMe(user: AuthUser, data: { name?: string; email?: string; phone?: string; city?: string; address?: string; website?: string; logoUrl?: string }) {
    if (!user.companyId) {
      throw new ForbiddenException('Usuario sin empresa asignada.');
    }
    return this.prisma.company.update({
      where: { id: user.companyId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.phone && { phone: data.phone }),
        ...(data.city && { city: data.city }),
        ...(data.address && { address: data.address }),
        ...(data.website && { website: data.website }),
        ...(data.logoUrl && { logoUrl: data.logoUrl }),
      },
    });
  }

  async uploadMyLogo(user: AuthUser, file: Express.Multer.File) {
    if (!user.companyId) {
      throw new ForbiddenException('Usuario sin empresa asignada.');
    }

    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      throw new ForbiddenException('Formato no permitido. Usa PNG, JPG o WEBP.');
    }

    if (file.size > 2 * 1024 * 1024) {
      throw new ForbiddenException('El logo excede 2MB.');
    }

    const ext = file.originalname.split('.').pop()?.toLowerCase() || 'png';
    const fileName = `logo-${Date.now()}.${ext}`;
    const logoUrl = await this.storage.upload(file, fileName, `companies/${user.companyId}`);

    await this.prisma.company.update({
      where: { id: user.companyId },
      data: { logoUrl },
    });

    return { logoUrl };
  }

  async getUsers(user: AuthUser) {
    if (!user.companyId) {
      throw new ForbiddenException('Usuario sin empresa asignada.');
    }
    const companyUsers = await this.prisma.companyUser.findMany({
      where: { companyId: user.companyId },
      include: { user: { select: { id: true, email: true, role: true, status: true, createdAt: true } } },
      orderBy: { createdAt: 'asc' },
    });
    return companyUsers.map(cu => ({ ...cu.user, companyRole: cu.role }));
  }

  async createUser(user: AuthUser, data: { email: string; role: string; password: string }) {
    if (!user.companyId) {
      throw new ForbiddenException('Usuario sin empresa asignada.');
    }
    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email: data.email,
        role: 'company_admin',
        passwordHash,
        status: 'active',
      },
    });

    await this.prisma.companyUser.create({
      data: {
        companyId: user.companyId,
        userId: newUser.id,
        role: this.mapCompanyRole(data.role) as any,
      },
    });

    return { id: newUser.id, email: newUser.email, role: newUser.role, status: newUser.status, companyRole: data.role };
  }

  async updateUser(user: AuthUser, userId: string, data: { role?: string; status?: string }) {
    if (!user.companyId) {
      throw new ForbiddenException('Usuario sin empresa asignada.');
    }
    const companyUser = await this.prisma.companyUser.findFirst({
      where: { companyId: user.companyId, userId },
    });
    if (!companyUser) {
      throw new ForbiddenException('No tienes acceso a este usuario.');
    }

    if (data.role) {
      await this.prisma.companyUser.update({
        where: { id: companyUser.id },
        data: { role: this.mapCompanyRole(data.role) as any },
      });
    }

    if (data.status) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { status: data.status as any },
      });
    }

    const updated = await this.prisma.companyUser.findUnique({
      where: { id: companyUser.id },
      include: { user: true },
    });
    return { id: updated?.user.id, email: updated?.user.email, role: updated?.user.role, status: updated?.user.status, companyRole: updated?.role };
  }

  async deleteUser(user: AuthUser, userId: string) {
    if (!user.companyId) {
      throw new ForbiddenException('Usuario sin empresa asignada.');
    }
    const companyUser = await this.prisma.companyUser.findFirst({
      where: { companyId: user.companyId, userId },
    });
    if (!companyUser) {
      throw new ForbiddenException('No tienes acceso a este usuario.');
    }
    if (userId === user.id) {
      throw new ForbiddenException('No puedes eliminarte a ti mismo.');
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: { status: 'inactive' },
    });
  }

  async getCompanyPlan(user: AuthUser) {
    if (!user.companyId) {
      throw new ForbiddenException('Usuario sin empresa asignada.');
    }
    const company = await this.prisma.company.findUnique({
      where: { id: user.companyId },
      include: { plan: true },
    });
    if (!company) throw new NotFoundException('Empresa no encontrada.');

    const now = new Date();
    const [jobsCount, usersCount, candidatesCount] = await Promise.all([
      this.prisma.job.count({ where: { companyId: user.companyId, status: 'active' } }),
      this.prisma.companyUser.count({ where: { companyId: user.companyId } }),
      this.prisma.application.count({ where: { job: { companyId: user.companyId }, status: { not: 'rejected' } } }),
    ]);

    return {
      plan: company.plan,
      usage: {
        jobs: { current: jobsCount, max: company.plan?.publicationLimit ?? 5 },
        users: { current: usersCount, max: company.plan?.userLimit ?? 3 },
        candidates: { current: candidatesCount, max: company.plan?.visibleCandidatesLimit ?? 100 },
      },
      renewalDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
    };
  }

  getPlans() {
    return this.prisma.plan.findMany({ where: { isActive: true }, orderBy: { price: 'asc' } });
  }

  async updatePlan(user: AuthUser, planId: string) {
    if (!user.companyId) {
      throw new ForbiddenException('Usuario sin empresa asignada.');
    }
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException('Plan no encontrado.');

    return this.prisma.company.update({
      where: { id: user.companyId },
      data: { planId },
      include: { plan: true },
    });
  }

  // ========== SA-04: Admin Company Management ==========

  async adminListCompanies(filters: { status?: string; planId?: string; search?: string; page?: number; limit?: number }) {
    const { status, planId, search, page = 1, limit = 10 } = filters;
    const where: any = {};

    if (status) where.status = status;
    if (planId) where.planId = planId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        include: { plan: true, _count: { select: { jobs: true, users: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.company.count({ where }),
    ]);

    return { companies, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async adminGetSummary() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [active, suspended, pending, total, activeLastMonth] = await Promise.all([
      this.prisma.company.count({ where: { status: 'active' } }),
      this.prisma.company.count({ where: { status: 'suspended' } }),
      this.prisma.company.count({ where: { status: 'pending_approval' } }),
      this.prisma.company.count(),
      this.prisma.company.count({ where: { status: 'active', createdAt: { lt: thirtyDaysAgo } } }),
    ]);

    const activeTrend = activeLastMonth > 0 ? Math.round(((active - activeLastMonth) / activeLastMonth) * 100) : 0;

    return {
      active: { value: active, trend: activeTrend },
      suspended: { value: suspended },
      pending: { value: pending },
      total: { value: total, trend: Math.round((total / Math.max(1, total - active + activeLastMonth)) * 100 - 100) },
    };
  }

  async adminUpdateStatus(id: string, status: string) {
    return this.prisma.company.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async adminDeleteCompany(id: string) {
    return this.prisma.company.update({
      where: { id },
      data: { status: 'inactive' },
    });
  }

  // ========== SA-05: Company Detail for Admin ==========

  async adminGetCompanyDetail(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: { plan: true },
    });
    if (!company) throw new NotFoundException('Empresa no encontrada.');
    return company;
  }

  async adminGetCompanyUsers(companyId: string) {
    const companyUsers = await this.prisma.companyUser.findMany({
      where: { companyId },
      include: { user: { select: { id: true, email: true, role: true, status: true, createdAt: true } } },
      orderBy: { createdAt: 'asc' },
    });
    return companyUsers.map(cu => ({ ...cu.user, companyRole: cu.role, companyUserId: cu.id }));
  }

  async adminGetCompanyJobs(companyId: string, filters: { status?: string; page?: number; limit?: number }) {
    const { status, page = 1, limit = 5 } = filters;
    const where: any = { companyId };
    if (status) where.status = status;

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        include: { _count: { select: { applications: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.job.count({ where }),
    ]);

    return { jobs, total, page, limit };
  }

  async adminGetCompanyApplications(companyId: string, filters: { status?: string; page?: number; limit?: number }) {
    const { status, page = 1, limit = 10 } = filters;
    const where: any = { job: { companyId } };
    if (status) where.status = status;

    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        include: { candidate: true, job: { select: { id: true, title: true } } },
        orderBy: { appliedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.application.count({ where }),
    ]);

    return { applications, total, page, limit };
  }

  async adminGetCompanyMetrics(companyId: string) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [activeJobs, totalApplications, scheduledInterviews, hires, recentActivity] = await Promise.all([
      this.prisma.job.count({ where: { companyId, status: 'active' } }),
      this.prisma.application.count({ where: { job: { companyId } } }),
      this.prisma.interview.count({ where: { companyId, status: { in: ['scheduled', 'confirmed'] } } }),
      this.prisma.application.count({ where: { job: { companyId }, status: 'hired' } }),
      this.prisma.activityLog.findMany({
        where: { entityId: companyId, createdAt: { gte: sevenDaysAgo } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    const [jobsLastMonth, appsLastMonth, interviewsLastMonth, hiresLastMonth] = await Promise.all([
      this.prisma.job.count({ where: { companyId, status: 'active', createdAt: { lt: thirtyDaysAgo } } }),
      this.prisma.application.count({ where: { job: { companyId }, appliedAt: { lt: thirtyDaysAgo } } }),
      this.prisma.interview.count({ where: { companyId, createdAt: { lt: thirtyDaysAgo } } }),
      this.prisma.application.count({ where: { job: { companyId }, status: 'hired', updatedAt: { lt: thirtyDaysAgo } } }),
    ]);

    const calcTrend = (curr: number, prev: number) => prev > 0 ? Math.round(((curr - prev) / prev) * 100) : 0;

    return {
      activeJobs: { value: activeJobs, trend: calcTrend(activeJobs, jobsLastMonth) },
      totalApplications: { value: totalApplications, trend: calcTrend(totalApplications, appsLastMonth) },
      scheduledInterviews: { value: scheduledInterviews, trend: calcTrend(scheduledInterviews, interviewsLastMonth) },
      hires: { value: hires, trend: calcTrend(hires, hiresLastMonth) },
      recentActivity,
    };
  }

  async adminUpdateCompanyPlan(companyId: string, planId: string) {
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException('Plan no encontrado.');

    return this.prisma.company.update({
      where: { id: companyId },
      data: { planId },
      include: { plan: true },
    });
  }

  async adminCreateCompanyUser(companyId: string, data: { email: string; role: string; password: string }) {
    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email: data.email,
        role: 'company_admin',
        passwordHash,
        status: 'active',
      },
    });

    await this.prisma.companyUser.create({
      data: {
        companyId,
        userId: newUser.id,
        role: this.mapCompanyRole(data.role) as any,
      },
    });

    return { id: newUser.id, email: newUser.email, role: newUser.role, status: newUser.status, companyRole: data.role };
  }

  async adminUpdateCompanyUser(companyId: string, userId: string, data: { role?: string; status?: string }) {
    const companyUser = await this.prisma.companyUser.findFirst({
      where: { companyId, userId },
    });
    if (!companyUser) throw new NotFoundException('Usuario no encontrado en esta empresa.');

    if (data.role) {
      await this.prisma.companyUser.update({
        where: { id: companyUser.id },
        data: { role: this.mapCompanyRole(data.role) as any },
      });
    }

    if (data.status) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { status: data.status as any },
      });
    }

    return { success: true };
  }

  async adminUpdateCompany(id: string, data: { name?: string; email?: string; phone?: string; city?: string; address?: string; website?: string; planId?: string }) {
    return this.prisma.company.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.phone && { phone: data.phone }),
        ...(data.city && { city: data.city }),
        ...(data.address && { address: data.address }),
        ...(data.website && { website: data.website }),
        ...(data.planId && { planId: data.planId }),
      },
      include: { plan: true },
    });
  }
}
