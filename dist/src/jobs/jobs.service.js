"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let JobsService = class JobsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getCategories() {
        return this.prisma.jobCategory.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                icon: true,
            },
            orderBy: { name: 'asc' },
        });
    }
    async getRecommended(user, categoryId) {
        await this.closeExpiredJobs();
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
    async search(query, city, categoryId, page = 1, limit = 20) {
        await this.closeExpiredJobs();
        const skip = (page - 1) * limit;
        const where = {
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
        if (!where.AND.length) {
            delete where.AND;
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
    list(user) {
        return this.listWithExpirationSync(user);
    }
    async listWithExpirationSync(user) {
        await this.closeExpiredJobs();
        if (user.role === 'super_admin') {
            return this.prisma.job.findMany({ include: { company: true } });
        }
        if (user.role === 'company_admin') {
            if (!user.companyId) {
                return [];
            }
            return this.prisma.job.findMany({ where: { companyId: user.companyId } });
        }
        return this.prisma.job.findMany({ where: this.buildPublicActiveWhere() });
    }
    async getCompanyJobs(user, query, city, status, page = 1, limit = 10) {
        await this.closeExpiredJobs();
        if (!user.companyId) {
            throw new common_1.ForbiddenException('Usuario sin empresa asignada.');
        }
        const skip = (page - 1) * limit;
        const where = { companyId: user.companyId };
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
    async getCompanySummary(user) {
        await this.closeExpiredJobs();
        if (!user.companyId) {
            throw new common_1.ForbiddenException('Usuario sin empresa asignada.');
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
        const calcTrend = (current, prev) => {
            if (prev === 0)
                return current > 0 ? 100 : 0;
            return Math.round(((current - prev) / prev) * 100);
        };
        return {
            active: { value: active, trend: calcTrend(active, activePrev) },
            paused: { value: paused, trend: calcTrend(paused, pausedPrev) },
            closed: { value: closed, trend: calcTrend(closed, closedPrev) },
            applications: { value: applications, trend: calcTrend(applications, applicationsPrev) },
        };
    }
    async getAdminJobs(query, companyId, status, page = 1, limit = 10) {
        await this.closeExpiredJobs();
        const skip = (page - 1) * limit;
        const where = {};
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
    async updateStatus(id, user, status) {
        await this.closeExpiredJobs();
        const job = await this.prisma.job.findUnique({ where: { id } });
        if (!job) {
            throw new common_1.NotFoundException('Vacante no encontrada.');
        }
        if (user.role === 'company_admin' && user.companyId !== job.companyId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta vacante.');
        }
        return this.prisma.job.update({
            where: { id },
            data: { status: status },
        });
    }
    async getById(id, user) {
        await this.closeExpiredJobs();
        const job = await this.prisma.job.findUnique({
            where: { id },
            include: { company: true, category: true },
        });
        if (!job) {
            throw new common_1.NotFoundException('Vacante no encontrada.');
        }
        if (user.role === 'company_admin' && user.companyId !== job.companyId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta vacante.');
        }
        if (user.role === 'candidate' && job.status !== 'active') {
            throw new common_1.ForbiddenException('Vacante no disponible.');
        }
        return job;
    }
    async create(user, dto) {
        const companyId = this.resolveCompanyId(user, dto.companyId);
        const categoryId = dto.categoryId && dto.categoryId !== 'other' ? dto.categoryId : null;
        const customCategory = dto.customCategory?.trim() || null;
        return this.prisma.job.create({
            data: {
                companyId,
                categoryId,
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
                status: (dto.status ?? 'active'),
                expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
            },
        });
    }
    async update(id, user, dto) {
        await this.closeExpiredJobs();
        const job = await this.prisma.job.findUnique({ where: { id } });
        if (!job) {
            throw new common_1.NotFoundException('Vacante no encontrada.');
        }
        if (user.role === 'company_admin' && user.companyId !== job.companyId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta vacante.');
        }
        const categoryId = dto.categoryId === undefined ? undefined : dto.categoryId && dto.categoryId !== 'other' ? dto.categoryId : null;
        const customCategory = dto.customCategory === undefined ? undefined : dto.customCategory.trim() || null;
        return this.prisma.job.update({
            where: { id },
            data: {
                categoryId,
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
                status: dto.status,
                expiresAt: dto.expiresAt === undefined ? undefined : dto.expiresAt ? new Date(dto.expiresAt) : null,
            },
        });
    }
    async remove(id, user) {
        const job = await this.prisma.job.findUnique({ where: { id } });
        if (!job) {
            throw new common_1.NotFoundException('Vacante no encontrada.');
        }
        if (user.role === 'company_admin' && user.companyId !== job.companyId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta vacante.');
        }
        await this.prisma.job.delete({ where: { id } });
        return { status: 'ok' };
    }
    resolveCompanyId(user, overrideCompanyId) {
        if (user.role === 'super_admin') {
            if (!overrideCompanyId) {
                throw new common_1.ForbiddenException('CompanyId requerido para super admin.');
            }
            return overrideCompanyId;
        }
        if (!user.companyId) {
            throw new common_1.ForbiddenException('Usuario sin empresa asignada.');
        }
        return user.companyId;
    }
    buildPublicActiveWhere() {
        return {
            status: 'active',
            OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
        };
    }
    async closeExpiredJobs() {
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
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map