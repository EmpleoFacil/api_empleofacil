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
exports.InterviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InterviewsService = class InterviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(user, dto) {
        const application = await this.prisma.application.findUnique({
            where: { id: dto.applicationId },
            include: { job: true },
        });
        if (!application) {
            throw new common_1.NotFoundException('Postulación no encontrada.');
        }
        if (user.role === 'company_admin' && user.companyId !== application.job.companyId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta postulación.');
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
                status: (dto.status ?? 'scheduled'),
                notesForCandidate: dto.notesForCandidate,
                responsibleUserId: user.id,
            },
        });
    }
    listForCandidate(user) {
        if (!user.candidateId) {
            throw new common_1.ForbiddenException('Usuario no es candidato.');
        }
        return this.prisma.interview.findMany({
            where: { candidateId: user.candidateId },
            include: { company: true, application: { include: { job: true } } },
            orderBy: { date: 'asc' },
        });
    }
    async getById(id, user) {
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
            throw new common_1.NotFoundException('Entrevista no encontrada.');
        }
        if (user.role === 'candidate' && user.candidateId !== interview.candidateId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta entrevista.');
        }
        return interview;
    }
    async confirm(id, user) {
        const interview = await this.prisma.interview.findUnique({ where: { id } });
        if (!interview) {
            throw new common_1.NotFoundException('Entrevista no encontrada.');
        }
        if (user.role === 'candidate' && user.candidateId !== interview.candidateId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta entrevista.');
        }
        return this.prisma.interview.update({
            where: { id },
            data: { status: 'confirmed' },
        });
    }
    async requestReschedule(id, dto, user) {
        const interview = await this.prisma.interview.findUnique({ where: { id } });
        if (!interview) {
            throw new common_1.NotFoundException('Entrevista no encontrada.');
        }
        if (user.role === 'candidate' && user.candidateId !== interview.candidateId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta entrevista.');
        }
        return this.prisma.interview.update({
            where: { id },
            data: {
                status: 'rescheduled',
                notesForCandidate: dto.reason || interview.notesForCandidate,
            },
        });
    }
    listForCompany(user) {
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
    async updateStatus(id, dto, user) {
        const interview = await this.prisma.interview.findUnique({
            where: { id },
            include: { company: true },
        });
        if (!interview) {
            throw new common_1.NotFoundException('Entrevista no encontrada.');
        }
        if (user.role === 'company_admin' && user.companyId !== interview.companyId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta entrevista.');
        }
        if (user.role === 'candidate' && user.candidateId !== interview.candidateId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta entrevista.');
        }
        return this.prisma.interview.update({
            where: { id },
            data: { status: dto.status },
        });
    }
    async reschedule(id, dto, user) {
        const interview = await this.prisma.interview.findUnique({
            where: { id },
            include: { company: true },
        });
        if (!interview) {
            throw new common_1.NotFoundException('Entrevista no encontrada.');
        }
        if (user.role === 'company_admin' && user.companyId !== interview.companyId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta entrevista.');
        }
        return this.prisma.interview.update({
            where: { id },
            data: {
                ...(dto.date && { date: new Date(dto.date) }),
                status: 'rescheduled',
                meetingUrl: dto.meetingUrl ?? interview.meetingUrl,
                location: dto.location ?? interview.location,
            },
        });
    }
    async getSummary(user) {
        const where = {};
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
        const calcTrend = (curr, prev) => prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100);
        return {
            total: { value: total, trend: calcTrend(total, totalPrev) },
            pending: { value: pending },
            confirmed: { value: confirmed },
            rescheduled: { value: rescheduled },
            completed: { value: completed },
        };
    }
    listForCompanyPaginated(user, params) {
        const { status, jobId, search, dateFrom, dateTo, page = 1, limit = 20 } = params;
        const where = {};
        if (user.role === 'company_admin' && user.companyId) {
            where.companyId = user.companyId;
        }
        if (status && status !== 'all')
            where.status = status;
        if (jobId)
            where.jobId = jobId;
        if (search) {
            where.candidate = { fullName: { contains: search, mode: 'insensitive' } };
        }
        if (dateFrom || dateTo) {
            where.date = {};
            if (dateFrom)
                where.date.gte = new Date(dateFrom);
            if (dateTo)
                where.date.lte = new Date(dateTo);
        }
        return this.prisma.interview.findMany({
            where,
            include: { candidate: true, job: true, application: true },
            orderBy: { date: 'asc' },
            skip: (page - 1) * limit,
            take: limit,
        });
    }
    async update(id, user, data) {
        const interview = await this.prisma.interview.findUnique({ where: { id } });
        if (!interview)
            throw new common_1.NotFoundException('Entrevista no encontrada.');
        if (user.role === 'company_admin' && interview.companyId !== user.companyId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta entrevista.');
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
    async sendReminder(id, user) {
        const interview = await this.prisma.interview.findUnique({ where: { id }, include: { candidate: true } });
        if (!interview)
            throw new common_1.NotFoundException('Entrevista no encontrada.');
        if (user.role === 'company_admin' && interview.companyId !== user.companyId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta entrevista.');
        }
        return { sent: true, interviewId: id, candidateId: interview.candidateId };
    }
    async recordResult(id, user, data) {
        const interview = await this.prisma.interview.findUnique({ where: { id }, include: { application: true } });
        if (!interview)
            throw new common_1.NotFoundException('Entrevista no encontrada.');
        if (user.role === 'company_admin' && interview.companyId !== user.companyId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta entrevista.');
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
                data: { status: data.moveApplicationStatus },
            });
        }
        return updated;
    }
};
exports.InterviewsService = InterviewsService;
exports.InterviewsService = InterviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InterviewsService);
//# sourceMappingURL=interviews.service.js.map