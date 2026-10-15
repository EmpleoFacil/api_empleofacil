import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseStorageService } from '../supabase/supabase-storage.service';
import type { AuthUser } from '../common/types/auth-user';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

@Injectable()
export class CandidatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: SupabaseStorageService,
  ) {}

  async getMe(user: AuthUser) {
    if (!user.candidateId) {
      throw new ForbiddenException('Usuario no es candidato.');
    }

    const candidate = await this.prisma.candidateProfile.findUnique({
      where: { id: user.candidateId },
      include: {
        jobPreferences: {
          include: {
            category: true,
            specialties: { include: { specialty: true } },
          },
          orderBy: { category: { sortOrder: 'asc' } },
        },
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            secondaryPhone: true,
          },
        },
        _count: { select: { applications: true, documents: true } },
      },
    });

    if (!candidate) return null;
    return {
      ...candidate,
      applicationsCount: candidate._count.applications,
      profileCompletion: this.calculateProfileCompletion(candidate),
    };
  }

  async updateMe(user: AuthUser, dto: UpdateCandidateDto) {
    if (!user.candidateId) {
      throw new ForbiddenException('Usuario no es candidato.');
    }

    if (dto.jobPreferences !== undefined) {
      await this.validateJobPreferences(dto.jobPreferences);
    }

    const normalizedPhone = this.normalizePhone(dto.phone);
    const birthDate = dto.birthDate ? new Date(dto.birthDate) : undefined;
    const normalizedSecondaryPhone =
      dto.secondaryPhone === undefined
        ? undefined
        : dto.secondaryPhone.trim() === ''
        ? null
        : this.normalizePhone(dto.secondaryPhone);

    const candidateData = {
      fullName: dto.fullName,
      ...(birthDate ? { birthDate, age: this.calculateAge(birthDate) } : { age: dto.age }),
      department: dto.department,
      municipality: dto.municipality,
      zone: dto.zone,
      neighborhood: dto.neighborhood,
      city: dto.department ?? dto.city,
      country: dto.country,
      phone: normalizedPhone,
      desiredJobType:
        dto.jobPreferences === undefined
          ? dto.desiredJobType
          : dto.jobPreferences[0]?.categoryId ?? null,
      availability: dto.availability,
      salaryExpectationMin: dto.salaryExpectationMin,
      salaryExpectationMax: dto.salaryExpectationMax,
      experienceLevel: dto.experienceLevel,
      educationLevel: dto.educationLevel,
      profileCompletion: dto.profileCompletion,
    };

    const userData = {
      ...(dto.email != null ? { email: dto.email } : {}),
      ...(normalizedPhone != null ? { phone: normalizedPhone } : {}),
      ...(dto.secondaryPhone !== undefined
        ? { secondaryPhone: normalizedSecondaryPhone }
        : {}),
    };

    return this.prisma.$transaction(async (tx) => {
      if (Object.keys(userData).length > 0) {
        await tx.user.update({
          where: { id: user.id },
          data: userData,
        });
      }

      if (dto.jobPreferences !== undefined) {
        await tx.candidateJobPreference.deleteMany({
          where: { candidateId: user.candidateId! },
        });
        for (const preference of dto.jobPreferences) {
          await tx.candidateJobPreference.create({
            data: {
              candidateId: user.candidateId!,
              categoryId: preference.categoryId,
              specialties: {
                create: preference.specialtyIds.map((specialtyId) => ({
                  specialty: { connect: { id: specialtyId } },
                })),
              },
            },
          });
        }
      }

      return tx.candidateProfile.update({
        where: { id: user.candidateId! },
        data: candidateData,
        include: {
          jobPreferences: {
            include: {
              category: true,
              specialties: { include: { specialty: true } },
            },
            orderBy: { category: { sortOrder: 'asc' } },
          },
          user: {
            select: {
              id: true,
              email: true,
              phone: true,
              secondaryPhone: true,
            },
          },
          _count: { select: { applications: true, documents: true } },
        },
      });
    });
  }

  private calculateProfileCompletion(candidate: {
    fullName: string;
    phone: string | null;
    city: string | null;
    availability: string | null;
    educationLevel: string | null;
    experienceLevel: string | null;
    salaryExpectationMin: number | null;
    salaryExpectationMax: number | null;
    photoUrl: string | null;
    jobPreferences?: unknown[];
    _count?: { documents: number };
  }) {
    const complete = [
      Boolean(candidate.fullName?.trim()),
      Boolean(candidate.phone?.trim()),
      Boolean(candidate.city?.trim()),
      Boolean(candidate.jobPreferences?.length),
      Boolean(candidate.availability?.trim()),
      Boolean(candidate.educationLevel?.trim()),
      Boolean(candidate.experienceLevel?.trim()),
      candidate.salaryExpectationMin != null || candidate.salaryExpectationMax != null,
      Boolean(candidate.photoUrl?.trim()),
      (candidate._count?.documents ?? 0) > 0,
    ].filter(Boolean).length;
    return complete * 10;
  }

  private normalizePhone(value?: string) {
    if (!value) return undefined;
    const digits = value.replace(/\D/g, '');
    const local = digits.startsWith('505') ? digits.slice(3) : digits;
    if (!/^\d{8}$/.test(local)) {
      throw new BadRequestException('El teléfono debe tener 8 dígitos de Nicaragua.');
    }
    return `+505${local}`;
  }

  private calculateAge(birthDate: Date) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) age--;
    if (age < 18) {
      throw new BadRequestException('Debes ser mayor de edad para usar la plataforma como candidato.');
    }
    return age;
  }

  private async validateJobPreferences(
    preferences: NonNullable<UpdateCandidateDto['jobPreferences']>,
  ) {
    if (preferences.length > 5) {
      throw new BadRequestException('Puedes seleccionar hasta 5 rubros.');
    }

    const categoryIds = preferences.map((preference) => preference.categoryId);
    if (new Set(categoryIds).size !== categoryIds.length) {
      throw new BadRequestException('No repitas el mismo rubro.');
    }

    const activeCategoryCount = categoryIds.length
      ? await this.prisma.jobCategory.count({
          where: { id: { in: categoryIds }, isActive: true },
        })
      : 0;
    if (activeCategoryCount !== categoryIds.length) {
      throw new BadRequestException('Uno de los rubros seleccionados no existe.');
    }

    for (const preference of preferences) {
      if (new Set(preference.specialtyIds).size !== preference.specialtyIds.length) {
        throw new BadRequestException('No repitas una especialidad.');
      }
      const specialtyCount = preference.specialtyIds.length
        ? await this.prisma.jobSpecialty.count({
            where: {
              id: { in: preference.specialtyIds },
              categoryId: preference.categoryId,
              isActive: true,
            },
          })
        : 0;
      if (specialtyCount !== preference.specialtyIds.length) {
        throw new BadRequestException(
          'Una especialidad no corresponde al rubro seleccionado.',
        );
      }
    }
  }

  async uploadMyPhoto(user: AuthUser, file?: Express.Multer.File) {
    if (!user.candidateId) {
      throw new ForbiddenException('Usuario no es candidato.');
    }
    if (!file) {
      throw new BadRequestException('Selecciona una imagen.');
    }

    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException('Formato no permitido. Usa JPG, PNG o WEBP.');
    }
    if (file.size > 2 * 1024 * 1024) {
      throw new BadRequestException('La foto excede 2 MB.');
    }

    const url = await this.storage.upload(
      file,
      'profile-photo',
      `candidates/${user.candidateId}`,
    );
    const photoUrl = `${url}?v=${Date.now()}`;
    await this.prisma.candidateProfile.update({
      where: { id: user.candidateId },
      data: { photoUrl },
    });

    return { photoUrl };
  }

  async deleteMyPhoto(user: AuthUser) {
    if (!user.candidateId) {
      throw new ForbiddenException('Usuario no es candidato.');
    }

    const candidate = await this.prisma.candidateProfile.findUnique({
      where: { id: user.candidateId },
      select: { photoUrl: true },
    });
    if (!candidate) throw new NotFoundException('Candidato no encontrado.');

    if (candidate.photoUrl) {
      await this.storage.remove('profile-photo', `candidates/${user.candidateId}`);
    }
    await this.prisma.candidateProfile.update({
      where: { id: user.candidateId },
      data: { photoUrl: null },
    });

    return { photoUrl: null };
  }

  async list(user: AuthUser) {
    if (user.role === 'super_admin') {
      return this.prisma.candidateProfile.findMany({
        include: {
          user: true,
          jobPreferences: {
            include: {
              category: true,
              specialties: { include: { specialty: true } },
            },
          },
        },
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
        include: {
          user: true,
          jobPreferences: {
            include: {
              category: true,
              specialties: { include: { specialty: true } },
            },
          },
        },
      });
    }

    return [];
  }

  async getById(id: string, user: AuthUser) {
    const candidate = await this.prisma.candidateProfile.findUnique({
      where: { id },
      include: {
        user: true,
        jobPreferences: {
          include: {
            category: true,
            specialties: { include: { specialty: true } },
          },
        },
        applications: { include: { job: true } },
      },
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

  async listPaginated(params: {
    search?: string;
    status?: string;
    city?: string;
    page?: number;
    limit?: number;
  }) {
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
          jobPreferences: {
            include: {
              category: true,
              specialties: { include: { specialty: true } },
            },
          },
          documents: { select: { type: true } },
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.candidateProfile.count({ where }),
    ]);

    return {
      candidates: candidates.map(({ documents, ...candidate }) => ({
        ...candidate,
        documentsCount: Math.min(
          4,
          new Set(documents.map((document) => document.type)).size,
        ),
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getSummary() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [total, complete, pending, active, totalPrev, completePrev] =
      await Promise.all([
        this.prisma.candidateProfile.count(),
        this.prisma.candidateProfile.count({
          where: { profileCompletion: { gte: 80 } },
        }),
        this.prisma.candidateDocument.count({
          where: { status: { in: ['pending', 'uploaded'] } },
        }),
        this.prisma.candidateProfile.count({ where: { status: 'active' } }),
        this.prisma.candidateProfile.count({
          where: { createdAt: { lt: thirtyDaysAgo } },
        }),
        this.prisma.candidateProfile.count({
          where: {
            profileCompletion: { gte: 80 },
            createdAt: { lt: thirtyDaysAgo },
          },
        }),
      ]);

    const calcTrend = (current: number, prev: number) =>
      prev === 0
        ? current > 0
          ? 100
          : 0
        : Math.round(((current - prev) / prev) * 100);

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
    if (params.city)
      where.city = { contains: params.city, mode: 'insensitive' };

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
