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
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ApplicationsService = class ApplicationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    noteInclude = {
        author: {
            select: {
                id: true,
                email: true,
            },
        },
        updatedBy: {
            select: {
                id: true,
                email: true,
            },
        },
    };
    async create(user, dto) {
        if (!user.candidateId) {
            throw new common_1.ForbiddenException('Usuario no es candidato.');
        }
        const job = await this.prisma.job.findUnique({ where: { id: dto.jobId } });
        if (!job || job.status !== 'active') {
            throw new common_1.NotFoundException('Vacante no disponible.');
        }
        const existing = await this.prisma.application.findUnique({
            where: {
                jobId_candidateId: { jobId: dto.jobId, candidateId: user.candidateId },
            },
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
    listForCandidate(user) {
        if (!user.candidateId) {
            throw new common_1.ForbiddenException('Usuario no es candidato.');
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
    async getById(id, user) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: {
                job: { include: { company: true } },
                candidate: true,
                interviews: { orderBy: { date: 'asc' } },
                messages: { orderBy: { createdAt: 'desc' } },
                notes: {
                    orderBy: { createdAt: 'desc' },
                    include: this.noteInclude,
                },
            },
        });
        if (!application) {
            throw new common_1.NotFoundException('Postulación no encontrada.');
        }
        if (user.role === 'candidate' &&
            user.candidateId !== application.candidateId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta postulación.');
        }
        return application;
    }
    async getByJobForCandidate(jobId, user) {
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
    async getSummary(user) {
        if (!user.candidateId) {
            throw new common_1.ForbiddenException('Usuario no es candidato.');
        }
        const applications = await this.prisma.application.findMany({
            where: { candidateId: user.candidateId },
            select: { status: true },
        });
        const summary = {
            total: applications.length,
            enRevision: applications.filter((a) => a.status === 'applied' || a.status === 'reviewing').length,
            entrevista: applications.filter((a) => a.status === 'interview_scheduled' ||
                a.status === 'interview_confirmed').length,
            noSeleccionado: applications.filter((a) => a.status === 'rejected')
                .length,
            postulado: applications.filter((a) => a.status === 'applied').length,
        };
        return summary;
    }
    async getStatusSummary(user) {
        if (!user.candidateId) {
            throw new common_1.ForbiddenException('Usuario no es candidato.');
        }
        const applications = await this.prisma.application.findMany({
            where: { candidateId: user.candidateId },
            select: { status: true },
        });
        return {
            enRevision: applications.filter((a) => a.status === 'applied' || a.status === 'reviewing').length,
        };
    }
    listForCompany(user) {
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
    async updateStatus(id, dto, user) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: { job: true },
        });
        if (!application) {
            throw new common_1.NotFoundException('Postulación no encontrada.');
        }
        if (user.role === 'company_admin' &&
            user.companyId !== application.job.companyId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta postulación.');
        }
        return this.prisma.application.update({
            where: { id },
            data: { status: dto.status },
        });
    }
    async getSummaryForCompany(user) {
        if (!user.companyId && user.role !== 'super_admin') {
            throw new common_1.ForbiddenException('Usuario sin empresa asignada.');
        }
        const companyId = user.companyId;
        const baseWhere = user.role === 'super_admin'
            ? {}
            : { job: { companyId: companyId } };
        const apps = await this.prisma.application.findMany({
            where: baseWhere,
            select: { status: true },
        });
        return {
            total: { value: apps.length },
            nuevo: { value: apps.filter((a) => a.status === 'applied').length },
            enRevision: {
                value: apps.filter((a) => a.status === 'reviewing').length,
            },
            entrevista: {
                value: apps.filter((a) => a.status === 'interview_scheduled' ||
                    a.status === 'interview_confirmed').length,
            },
            descartado: { value: apps.filter((a) => a.status === 'rejected').length },
            contratado: { value: apps.filter((a) => a.status === 'hired').length },
        };
    }
    async getPipeline(user, jobId) {
        if (!user.companyId && user.role !== 'super_admin') {
            throw new common_1.ForbiddenException('Usuario sin empresa asignada.');
        }
        const companyId = user.companyId;
        const baseWhere = user.role === 'super_admin'
            ? {}
            : { job: { companyId: companyId } };
        const where = jobId ? { ...baseWhere, jobId } : baseWhere;
        const apps = await this.prisma.application.findMany({
            where,
            include: {
                candidate: { select: { id: true, fullName: true, city: true } },
                job: { select: { id: true, title: true } },
            },
            orderBy: { appliedAt: 'desc' },
        });
        const statuses = [
            'applied',
            'reviewing',
            'interview_scheduled',
            'rejected',
        ];
        const pipeline = {};
        statuses.forEach((s) => {
            pipeline[s] = apps.filter((a) => a.status === s);
        });
        return pipeline;
    }
    async listForCompanyPaginated(user, params) {
        if (!user.companyId && user.role !== 'super_admin') {
            throw new common_1.ForbiddenException('Usuario sin empresa asignada.');
        }
        const { search, jobId, status, page = 1, limit = 20 } = params;
        const companyId = user.companyId;
        const baseWhere = user.role === 'super_admin'
            ? {}
            : { job: { companyId: companyId } };
        const where = { ...baseWhere };
        if (jobId)
            where.jobId = jobId;
        if (status)
            where.status = status;
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
    async addNote(id, user, content) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: { job: true },
        });
        if (!application) {
            throw new common_1.NotFoundException('Postulación no encontrada.');
        }
        if (user.role === 'company_admin' &&
            user.companyId !== application.job.companyId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta postulación.');
        }
        return this.prisma.applicationNote.create({
            data: {
                applicationId: id,
                authorUserId: user.id,
                note: content,
            },
            include: this.noteInclude,
        });
    }
    async updateNote(applicationId, noteId, user, content) {
        const note = await this.prisma.applicationNote.findUnique({
            where: { id: noteId },
            include: {
                application: {
                    include: { job: true },
                },
            },
        });
        if (!note || note.applicationId !== applicationId) {
            throw new common_1.NotFoundException('Nota no encontrada.');
        }
        if (user.role === 'company_admin' &&
            user.companyId !== note.application.job.companyId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta nota.');
        }
        return this.prisma.applicationNote.update({
            where: { id: noteId },
            data: {
                note: content,
                updatedByUserId: user.id,
            },
            include: this.noteInclude,
        });
    }
    async exportForCompany(user, jobId) {
        if (!user.companyId && user.role !== 'super_admin') {
            throw new common_1.ForbiddenException('Usuario sin empresa asignada.');
        }
        const companyId = user.companyId;
        const baseWhere = user.role === 'super_admin'
            ? {}
            : { job: { companyId: companyId } };
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
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map