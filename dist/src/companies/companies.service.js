"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const supabase_storage_service_1 = require("../supabase/supabase-storage.service");
let CompaniesService = class CompaniesService {
    prisma;
    storage;
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    list(user) {
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
    async getById(id, user) {
        const company = await this.prisma.company.findUnique({ where: { id } });
        if (!company) {
            throw new common_1.NotFoundException('Empresa no encontrada.');
        }
        if (user.role !== 'super_admin' && user.companyId !== company.id) {
            throw new common_1.ForbiddenException('No tienes acceso a esta empresa.');
        }
        return company;
    }
    async create(dto) {
        const slug = dto.slug?.trim() || this.slugify(dto.name);
        return this.prisma.company.create({
            data: {
                name: dto.name,
                slug,
                legalName: dto.legalName,
                email: dto.email,
                phone: dto.phone,
                secondaryPhone: dto.secondaryPhone,
                country: dto.country,
                city: dto.city,
                status: (dto.status ?? 'active'),
            },
        });
    }
    async update(id, dto, user) {
        if (user.role !== 'super_admin' && user.companyId !== id) {
            throw new common_1.ForbiddenException('No tienes permisos para modificar esta empresa.');
        }
        return this.prisma.company.update({
            where: { id },
            data: {
                name: dto.name,
                slug: dto.slug,
                legalName: dto.legalName,
                email: dto.email,
                phone: dto.phone,
                secondaryPhone: dto.secondaryPhone,
                country: dto.country,
                city: dto.city,
                status: dto.status,
            },
        });
    }
    async getPlanLimits(user) {
        if (!user.companyId) {
            throw new common_1.ForbiddenException('Usuario sin empresa asignada.');
        }
        const company = await this.prisma.company.findUnique({
            where: { id: user.companyId },
            include: { plan: true },
        });
        if (!company) {
            throw new common_1.NotFoundException('Empresa no encontrada.');
        }
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const [jobsThisMonth, totalJobs, visibleCandidates, usersCount] = await Promise.all([
            this.prisma.job.count({
                where: {
                    companyId: user.companyId,
                    createdAt: { gte: startOfMonth },
                },
            }),
            this.prisma.job.count({
                where: { companyId: user.companyId, status: 'active' },
            }),
            this.prisma.application.count({
                where: {
                    job: { companyId: user.companyId },
                    status: { not: 'rejected' },
                },
            }),
            this.prisma.companyUser.count({ where: { companyId: user.companyId } }),
        ]);
        const pubLimit = company.plan?.publicationLimit ?? 5;
        const candLimit = company.plan?.visibleCandidatesLimit ?? 100;
        const userLimit = company.plan?.userLimit ?? 3;
        return {
            plan: {
                name: company.plan?.name ?? 'Básico',
                id: company.planId,
            },
            limits: {
                activeJobs: {
                    current: totalJobs,
                    max: pubLimit,
                    remaining: Math.max(0, pubLimit - totalJobs),
                },
                visibleCandidates: {
                    current: visibleCandidates,
                    max: candLimit,
                    remaining: Math.max(0, candLimit - visibleCandidates),
                },
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
    mapCompanyRole(role) {
        const mapping = {
            company_admin: 'admin',
            company_recruiter: 'recruiter',
            admin: 'admin',
            recruiter: 'recruiter',
            editor: 'editor',
            viewer: 'viewer',
        };
        return mapping[role] ?? 'viewer';
    }
    resolveCompanyRole(data) {
        return data.companyRole ?? data.role ?? 'viewer';
    }
    slugify(value) {
        return value
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    async getMe(user) {
        if (!user.companyId) {
            throw new common_1.ForbiddenException('Usuario sin empresa asignada.');
        }
        return this.prisma.company.findUnique({
            where: { id: user.companyId },
            include: { plan: true },
        });
    }
    async updateMe(user, data) {
        if (!user.companyId) {
            throw new common_1.ForbiddenException('Usuario sin empresa asignada.');
        }
        return this.prisma.company.update({
            where: { id: user.companyId },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.email && { email: data.email }),
                ...(data.phone && { phone: data.phone }),
                ...(data.secondaryPhone !== undefined
                    ? { secondaryPhone: data.secondaryPhone || null }
                    : {}),
                ...(data.city && { city: data.city }),
                ...(data.address && { address: data.address }),
                ...(data.website && { website: data.website }),
                ...(data.logoUrl && { logoUrl: data.logoUrl }),
            },
        });
    }
    async uploadMyLogo(user, file) {
        if (!user.companyId) {
            throw new common_1.ForbiddenException('Usuario sin empresa asignada.');
        }
        const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!allowed.includes(file.mimetype)) {
            throw new common_1.ForbiddenException('Formato no permitido. Usa PNG, JPG o WEBP.');
        }
        if (file.size > 2 * 1024 * 1024) {
            throw new common_1.ForbiddenException('El logo excede 2MB.');
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
    async getUsers(user) {
        if (!user.companyId) {
            throw new common_1.ForbiddenException('Usuario sin empresa asignada.');
        }
        const companyUsers = await this.prisma.companyUser.findMany({
            where: { companyId: user.companyId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        phone: true,
                        secondaryPhone: true,
                        role: true,
                        status: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
        return companyUsers.map((cu) => ({ ...cu.user, companyRole: cu.role }));
    }
    async createUser(user, data) {
        if (!user.companyId) {
            throw new common_1.ForbiddenException('Usuario sin empresa asignada.');
        }
        const passwordHash = await bcrypt.hash(data.password, 10);
        const companyRole = this.resolveCompanyRole(data);
        const newUser = await this.prisma.user.create({
            data: {
                email: data.email,
                secondaryPhone: data.secondaryPhone?.trim() || null,
                role: 'company_admin',
                passwordHash,
                status: 'active',
            },
        });
        await this.prisma.companyUser.create({
            data: {
                companyId: user.companyId,
                userId: newUser.id,
                role: this.mapCompanyRole(companyRole),
            },
        });
        return {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
            status: newUser.status,
            companyRole,
            secondaryPhone: newUser.secondaryPhone,
        };
    }
    async updateUser(user, userId, data) {
        if (!user.companyId) {
            throw new common_1.ForbiddenException('Usuario sin empresa asignada.');
        }
        const companyUser = await this.prisma.companyUser.findFirst({
            where: { companyId: user.companyId, userId },
        });
        if (!companyUser) {
            throw new common_1.ForbiddenException('No tienes acceso a este usuario.');
        }
        const companyRole = this.resolveCompanyRole(data);
        if (data.role || data.companyRole) {
            await this.prisma.companyUser.update({
                where: { id: companyUser.id },
                data: { role: this.mapCompanyRole(companyRole) },
            });
        }
        if (data.status || data.secondaryPhone !== undefined) {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    ...(data.status ? { status: data.status } : {}),
                    ...(data.secondaryPhone !== undefined
                        ? { secondaryPhone: data.secondaryPhone?.trim() || null }
                        : {}),
                },
            });
        }
        const updated = await this.prisma.companyUser.findUnique({
            where: { id: companyUser.id },
            include: { user: true },
        });
        return {
            id: updated?.user.id,
            email: updated?.user.email,
            role: updated?.user.role,
            status: updated?.user.status,
            companyRole: updated?.role,
            secondaryPhone: updated?.user.secondaryPhone,
        };
    }
    async deleteUser(user, userId) {
        if (!user.companyId) {
            throw new common_1.ForbiddenException('Usuario sin empresa asignada.');
        }
        const companyUser = await this.prisma.companyUser.findFirst({
            where: { companyId: user.companyId, userId },
        });
        if (!companyUser) {
            throw new common_1.ForbiddenException('No tienes acceso a este usuario.');
        }
        if (userId === user.id) {
            throw new common_1.ForbiddenException('No puedes eliminarte a ti mismo.');
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: { status: 'inactive' },
        });
    }
    async getCompanyPlan(user) {
        if (!user.companyId) {
            throw new common_1.ForbiddenException('Usuario sin empresa asignada.');
        }
        const company = await this.prisma.company.findUnique({
            where: { id: user.companyId },
            include: { plan: true },
        });
        if (!company)
            throw new common_1.NotFoundException('Empresa no encontrada.');
        const now = new Date();
        const [jobsCount, usersCount, candidatesCount] = await Promise.all([
            this.prisma.job.count({
                where: { companyId: user.companyId, status: 'active' },
            }),
            this.prisma.companyUser.count({ where: { companyId: user.companyId } }),
            this.prisma.application.count({
                where: {
                    job: { companyId: user.companyId },
                    status: { not: 'rejected' },
                },
            }),
        ]);
        return {
            plan: company.plan,
            usage: {
                jobs: { current: jobsCount, max: company.plan?.publicationLimit ?? 5 },
                users: { current: usersCount, max: company.plan?.userLimit ?? 3 },
                candidates: {
                    current: candidatesCount,
                    max: company.plan?.visibleCandidatesLimit ?? 100,
                },
            },
            renewalDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        };
    }
    getPlans() {
        return this.prisma.plan.findMany({
            where: { isActive: true },
            orderBy: { price: 'asc' },
        });
    }
    async updatePlan(user, planId) {
        if (!user.companyId) {
            throw new common_1.ForbiddenException('Usuario sin empresa asignada.');
        }
        const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
        if (!plan)
            throw new common_1.NotFoundException('Plan no encontrado.');
        return this.prisma.company.update({
            where: { id: user.companyId },
            data: { planId },
            include: { plan: true },
        });
    }
    async adminListCompanies(filters) {
        const { status, planId, search, page = 1, limit = 10 } = filters;
        const where = {};
        if (status)
            where.status = status;
        if (planId)
            where.planId = planId;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [companies, total] = await Promise.all([
            this.prisma.company.findMany({
                where,
                include: {
                    plan: true,
                    _count: { select: { jobs: true, users: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.company.count({ where }),
        ]);
        return {
            companies,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async adminGetSummary() {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const [active, suspended, pending, total, activeLastMonth] = await Promise.all([
            this.prisma.company.count({ where: { status: 'active' } }),
            this.prisma.company.count({ where: { status: 'suspended' } }),
            this.prisma.company.count({ where: { status: 'pending_approval' } }),
            this.prisma.company.count(),
            this.prisma.company.count({
                where: { status: 'active', createdAt: { lt: thirtyDaysAgo } },
            }),
        ]);
        const activeTrend = activeLastMonth > 0
            ? Math.round(((active - activeLastMonth) / activeLastMonth) * 100)
            : 0;
        return {
            active: { value: active, trend: activeTrend },
            suspended: { value: suspended },
            pending: { value: pending },
            total: {
                value: total,
                trend: Math.round((total / Math.max(1, total - active + activeLastMonth)) * 100 - 100),
            },
        };
    }
    async adminUpdateStatus(id, status) {
        return this.prisma.company.update({
            where: { id },
            data: { status: status },
        });
    }
    async adminDeleteCompany(id) {
        return this.prisma.company.update({
            where: { id },
            data: { status: 'inactive' },
        });
    }
    async adminGetCompanyDetail(id) {
        const company = await this.prisma.company.findUnique({
            where: { id },
            include: { plan: true },
        });
        if (!company)
            throw new common_1.NotFoundException('Empresa no encontrada.');
        return company;
    }
    async adminGetCompanyUsers(companyId) {
        const companyUsers = await this.prisma.companyUser.findMany({
            where: { companyId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        phone: true,
                        secondaryPhone: true,
                        role: true,
                        status: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
        return companyUsers.map((cu) => ({
            ...cu.user,
            companyRole: cu.role,
            companyUserId: cu.id,
        }));
    }
    async adminGetCompanyJobs(companyId, filters) {
        const { status, page = 1, limit = 5 } = filters;
        const where = { companyId };
        if (status)
            where.status = status;
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
    async adminGetCompanyApplications(companyId, filters) {
        const { status, page = 1, limit = 10 } = filters;
        const where = { job: { companyId } };
        if (status)
            where.status = status;
        const [applications, total] = await Promise.all([
            this.prisma.application.findMany({
                where,
                include: {
                    candidate: true,
                    job: { select: { id: true, title: true } },
                },
                orderBy: { appliedAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.application.count({ where }),
        ]);
        return { applications, total, page, limit };
    }
    async adminGetCompanyMetrics(companyId) {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const [activeJobs, totalApplications, scheduledInterviews, hires, recentActivity,] = await Promise.all([
            this.prisma.job.count({ where: { companyId, status: 'active' } }),
            this.prisma.application.count({ where: { job: { companyId } } }),
            this.prisma.interview.count({
                where: { companyId, status: { in: ['scheduled', 'confirmed'] } },
            }),
            this.prisma.application.count({
                where: { job: { companyId }, status: 'hired' },
            }),
            this.prisma.activityLog.findMany({
                where: { entityId: companyId, createdAt: { gte: sevenDaysAgo } },
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
        ]);
        const [jobsLastMonth, appsLastMonth, interviewsLastMonth, hiresLastMonth] = await Promise.all([
            this.prisma.job.count({
                where: {
                    companyId,
                    status: 'active',
                    createdAt: { lt: thirtyDaysAgo },
                },
            }),
            this.prisma.application.count({
                where: { job: { companyId }, appliedAt: { lt: thirtyDaysAgo } },
            }),
            this.prisma.interview.count({
                where: { companyId, createdAt: { lt: thirtyDaysAgo } },
            }),
            this.prisma.application.count({
                where: {
                    job: { companyId },
                    status: 'hired',
                    updatedAt: { lt: thirtyDaysAgo },
                },
            }),
        ]);
        const calcTrend = (curr, prev) => prev > 0 ? Math.round(((curr - prev) / prev) * 100) : 0;
        return {
            activeJobs: {
                value: activeJobs,
                trend: calcTrend(activeJobs, jobsLastMonth),
            },
            totalApplications: {
                value: totalApplications,
                trend: calcTrend(totalApplications, appsLastMonth),
            },
            scheduledInterviews: {
                value: scheduledInterviews,
                trend: calcTrend(scheduledInterviews, interviewsLastMonth),
            },
            hires: { value: hires, trend: calcTrend(hires, hiresLastMonth) },
            recentActivity,
        };
    }
    async adminUpdateCompanyPlan(companyId, planId) {
        const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
        if (!plan)
            throw new common_1.NotFoundException('Plan no encontrado.');
        return this.prisma.company.update({
            where: { id: companyId },
            data: { planId },
            include: { plan: true },
        });
    }
    async adminCreateCompanyUser(companyId, data) {
        const passwordHash = await bcrypt.hash(data.password, 10);
        const companyRole = this.resolveCompanyRole(data);
        const newUser = await this.prisma.user.create({
            data: {
                email: data.email,
                secondaryPhone: data.secondaryPhone?.trim() || null,
                role: 'company_admin',
                passwordHash,
                status: 'active',
            },
        });
        await this.prisma.companyUser.create({
            data: {
                companyId,
                userId: newUser.id,
                role: this.mapCompanyRole(companyRole),
            },
        });
        return {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
            status: newUser.status,
            companyRole,
            secondaryPhone: newUser.secondaryPhone,
        };
    }
    async adminUpdateCompanyUser(companyId, userId, data) {
        const companyUser = await this.prisma.companyUser.findFirst({
            where: { companyId, userId },
        });
        if (!companyUser)
            throw new common_1.NotFoundException('Usuario no encontrado en esta empresa.');
        const companyRole = this.resolveCompanyRole(data);
        if (data.role || data.companyRole) {
            await this.prisma.companyUser.update({
                where: { id: companyUser.id },
                data: { role: this.mapCompanyRole(companyRole) },
            });
        }
        if (data.status || data.secondaryPhone !== undefined) {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    ...(data.status ? { status: data.status } : {}),
                    ...(data.secondaryPhone !== undefined
                        ? { secondaryPhone: data.secondaryPhone?.trim() || null }
                        : {}),
                },
            });
        }
        return { success: true };
    }
    async adminUpdateCompany(id, data) {
        return this.prisma.company.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.email && { email: data.email }),
                ...(data.phone && { phone: data.phone }),
                ...(data.secondaryPhone !== undefined
                    ? { secondaryPhone: data.secondaryPhone || null }
                    : {}),
                ...(data.city && { city: data.city }),
                ...(data.address && { address: data.address }),
                ...(data.website && { website: data.website }),
                ...(data.planId && { planId: data.planId }),
            },
            include: { plan: true },
        });
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        supabase_storage_service_1.SupabaseStorageService])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map