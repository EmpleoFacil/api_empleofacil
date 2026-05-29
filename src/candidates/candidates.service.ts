import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../common/types/auth-user';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

@Injectable()
export class CandidatesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(user: AuthUser) {
    if (!user.candidateId) {
      throw new ForbiddenException('Usuario no es candidato.');
    }

    return this.prisma.candidateProfile.findUnique({
      where: { id: user.candidateId },
    });
  }

  async updateMe(user: AuthUser, dto: UpdateCandidateDto) {
    if (!user.candidateId) {
      throw new ForbiddenException('Usuario no es candidato.');
    }

    return this.prisma.candidateProfile.update({
      where: { id: user.candidateId },
      data: {
        fullName: dto.fullName,
        city: dto.city,
        country: dto.country,
        phone: dto.phone,
        desiredJobType: dto.desiredJobType,
        availability: dto.availability,
        salaryExpectationMin: dto.salaryExpectationMin,
        salaryExpectationMax: dto.salaryExpectationMax,
        experienceLevel: dto.experienceLevel,
        educationLevel: dto.educationLevel,
        profileCompletion: dto.profileCompletion,
      },
    });
  }

  async list(user: AuthUser) {
    if (user.role === 'super_admin') {
      return this.prisma.candidateProfile.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (user.role === 'company_admin' && user.companyId) {
      return this.prisma.candidateProfile.findMany({
        where: {
          applications: {
            some: { job: { companyId: user.companyId } },
          },
        },
        include: { user: true },
      });
    }

    return [];
  }

  async getById(id: string, user: AuthUser) {
    const candidate = await this.prisma.candidateProfile.findUnique({
      where: { id },
      include: { user: true, applications: { include: { job: true } } },
    });

    if (!candidate) {
      throw new NotFoundException('Candidato no encontrado.');
    }

    if (user.role === 'company_admin' && user.companyId) {
      const hasAccess = candidate.applications.some(
        (application) => application.job.companyId === user.companyId,
      );

      if (!hasAccess) {
        throw new ForbiddenException('No tienes acceso a este candidato.');
      }
    }

    return candidate;
  }

  async listPaginated(params: { search?: string; status?: string; city?: string; page?: number; limit?: number }) {
    const { search, status, city, page = 1, limit = 20 } = params;
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (status) where.status = status;
    if (city) where.city = { contains: city, mode: 'insensitive' };

    const [candidates, total] = await Promise.all([
      this.prisma.candidateProfile.findMany({
        where,
        include: {
          user: { select: { email: true } },
          _count: { select: { applications: true, documents: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.candidateProfile.count({ where }),
    ]);

    return {
      candidates,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getSummary() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [total, complete, pending, active, totalPrev, completePrev] = await Promise.all([
      this.prisma.candidateProfile.count(),
      this.prisma.candidateProfile.count({ where: { profileCompletion: { gte: 80 } } }),
      this.prisma.candidateDocument.count({ where: { status: { in: ['pending', 'uploaded'] } } }),
      this.prisma.candidateProfile.count({ where: { status: 'active' } }),
      this.prisma.candidateProfile.count({ where: { createdAt: { lt: thirtyDaysAgo } } }),
      this.prisma.candidateProfile.count({ where: { profileCompletion: { gte: 80 }, createdAt: { lt: thirtyDaysAgo } } }),
    ]);

    const calcTrend = (current: number, prev: number) => prev === 0 ? (current > 0 ? 100 : 0) : Math.round(((current - prev) / prev) * 100);

    return {
      total: { value: total, trend: calcTrend(total, totalPrev) },
      complete: { value: complete, trend: calcTrend(complete, completePrev) },
      pendingDocs: { value: pending },
      active: { value: active },
    };
  }

  async getApplications(id: string) {
    return this.prisma.application.findMany({
      where: { candidateId: id },
      include: { job: { include: { company: { select: { name: true } } } } },
      orderBy: { appliedAt: 'desc' },
    });
  }

  async getDocuments(id: string) {
    return this.prisma.candidateDocument.findMany({
      where: { candidateId: id },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.candidateProfile.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async exportCandidates(params: { status?: string; city?: string }) {
    const where: Record<string, unknown> = {};
    if (params.status) where.status = params.status;
    if (params.city) where.city = { contains: params.city, mode: 'insensitive' };

    return this.prisma.candidateProfile.findMany({
      where,
      include: {
        user: { select: { email: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
