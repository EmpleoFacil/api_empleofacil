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
exports.SavedJobsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SavedJobsService = class SavedJobsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByCandidate(user) {
        if (!user.candidateId) {
            throw new common_1.ForbiddenException('Usuario no es candidato');
        }
        const savedJobs = await this.prisma.savedJob.findMany({
            where: { candidateId: user.candidateId },
            include: {
                job: {
                    include: {
                        company: { select: { id: true, name: true, logoUrl: true } },
                        category: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return { items: savedJobs.map((s) => s.job) };
    }
    async save(user, jobId) {
        if (!user.candidateId) {
            throw new common_1.ForbiddenException('Usuario no es candidato');
        }
        const job = await this.prisma.job.findUnique({ where: { id: jobId } });
        if (!job) {
            throw new common_1.NotFoundException('Vacante no encontrada');
        }
        const existing = await this.prisma.savedJob.findUnique({
            where: {
                candidateId_jobId: {
                    candidateId: user.candidateId,
                    jobId,
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Vacante ya está guardada');
        }
        await this.prisma.savedJob.create({
            data: {
                candidateId: user.candidateId,
                jobId,
            },
        });
        return { success: true, message: 'Vacante guardada correctamente' };
    }
    async unsave(user, jobId) {
        if (!user.candidateId) {
            throw new common_1.ForbiddenException('Usuario no es candidato');
        }
        const existing = await this.prisma.savedJob.findUnique({
            where: {
                candidateId_jobId: {
                    candidateId: user.candidateId,
                    jobId,
                },
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Vacante no está guardada');
        }
        await this.prisma.savedJob.delete({
            where: { id: existing.id },
        });
        return { success: true, message: 'Vacante removida de guardadas' };
    }
};
exports.SavedJobsService = SavedJobsService;
exports.SavedJobsService = SavedJobsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SavedJobsService);
//# sourceMappingURL=saved-jobs.service.js.map