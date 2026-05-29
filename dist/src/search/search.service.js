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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SearchService = class SearchService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async searchForCompany(user, query, type) {
        if (!user.companyId) {
            throw new common_1.ForbiddenException('Usuario sin empresa asignada');
        }
        const searchTerm = query.toLowerCase().trim();
        const results = {};
        if (type === 'all' || type === 'jobs') {
            const jobs = await this.prisma.job.findMany({
                where: {
                    companyId: user.companyId,
                    OR: [
                        { title: { contains: searchTerm, mode: 'insensitive' } },
                        { description: { contains: searchTerm, mode: 'insensitive' } },
                    ],
                },
                take: 10,
                select: {
                    id: true,
                    title: true,
                    status: true,
                    city: true,
                },
            });
            results.jobs = jobs;
        }
        if (type === 'all' || type === 'candidates') {
            const applications = await this.prisma.application.findMany({
                where: {
                    job: { companyId: user.companyId },
                    candidate: {
                        fullName: { contains: searchTerm, mode: 'insensitive' },
                    },
                },
                take: 10,
                include: {
                    candidate: {
                        select: { id: true, fullName: true, city: true },
                    },
                    job: {
                        select: { id: true, title: true },
                    },
                },
            });
            results.candidates = applications.map((a) => ({
                applicationId: a.id,
                candidate: a.candidate,
                job: a.job,
                status: a.status,
            }));
        }
        if (type === 'all' || type === 'messages') {
            const messages = await this.prisma.message.findMany({
                where: {
                    companyId: user.companyId,
                    OR: [
                        { title: { contains: searchTerm, mode: 'insensitive' } },
                        { body: { contains: searchTerm, mode: 'insensitive' } },
                    ],
                },
                take: 10,
                select: {
                    id: true,
                    title: true,
                    type: true,
                    status: true,
                    createdAt: true,
                },
            });
            results.messages = messages;
        }
        return { data: results, query: searchTerm };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map