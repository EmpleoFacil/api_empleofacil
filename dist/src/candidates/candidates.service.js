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
exports.CandidatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CandidatesService = class CandidatesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMe(user) {
        if (!user.candidateId) {
            throw new common_1.ForbiddenException('Usuario no es candidato.');
        }
        return this.prisma.candidateProfile.findUnique({
            where: { id: user.candidateId },
        });
    }
    async updateMe(user, dto) {
        if (!user.candidateId) {
            throw new common_1.ForbiddenException('Usuario no es candidato.');
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
    async list(user) {
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
    async getById(id, user) {
        const candidate = await this.prisma.candidateProfile.findUnique({
            where: { id },
            include: { user: true, applications: { include: { job: true } } },
        });
        if (!candidate) {
            throw new common_1.NotFoundException('Candidato no encontrado.');
        }
        if (user.role === 'company_admin' && user.companyId) {
            const hasAccess = candidate.applications.some((application) => application.job.companyId === user.companyId);
            if (!hasAccess) {
                throw new common_1.ForbiddenException('No tienes acceso a este candidato.');
            }
        }
        return candidate;
    }
    async listPaginated(params) {
        const { search, status, city, page = 1, limit = 20 } = params;
        const where = {};
        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: 'insensitive' } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
            ];
        }
        if (status)
            where.status = status;
        if (city)
            where.city = { contains: city, mode: 'insensitive' };
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
        const calcTrend = (current, prev) => prev === 0 ? (current > 0 ? 100 : 0) : Math.round(((current - prev) / prev) * 100);
        return {
            total: { value: total, trend: calcTrend(total, totalPrev) },
            complete: { value: complete, trend: calcTrend(complete, completePrev) },
            pendingDocs: { value: pending },
            active: { value: active },
        };
    }
    async getApplications(id) {
        return this.prisma.application.findMany({
            where: { candidateId: id },
            include: { job: { include: { company: { select: { name: true } } } } },
            orderBy: { appliedAt: 'desc' },
        });
    }
    async getDocuments(id) {
        return this.prisma.candidateDocument.findMany({
            where: { candidateId: id },
            orderBy: { uploadedAt: 'desc' },
        });
    }
    async updateStatus(id, status) {
        return this.prisma.candidateProfile.update({
            where: { id },
            data: { status: status },
        });
    }
    async exportCandidates(params) {
        const where = {};
        if (params.status)
            where.status = params.status;
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
};
exports.CandidatesService = CandidatesService;
exports.CandidatesService = CandidatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CandidatesService);
//# sourceMappingURL=candidates.service.js.map