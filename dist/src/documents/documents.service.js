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
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const supabase_storage_service_1 = require("../supabase/supabase-storage.service");
const path_1 = require("path");
const crypto_1 = require("crypto");
let DocumentsService = class DocumentsService {
    prisma;
    storage;
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    getDocumentTypes() {
        return this.prisma.documentType.findMany();
    }
    async upload(user, dto, file) {
        if (!user.candidateId) {
            throw new common_1.ForbiddenException('Usuario no es candidato.');
        }
        let fileUrl = null;
        if (file) {
            const ext = (0, path_1.extname)(file.originalname);
            const fileName = `${(0, crypto_1.randomUUID)()}${ext}`;
            fileUrl = await this.storage.upload(file, fileName, user.candidateId);
            if (dto.replace) {
                const existing = await this.prisma.candidateDocument.findFirst({
                    where: { candidateId: user.candidateId, type: dto.type },
                    orderBy: { uploadedAt: 'desc' },
                });
                if (existing) {
                    await this.prisma.candidateDocument.delete({ where: { id: existing.id } });
                }
            }
        }
        return this.prisma.candidateDocument.create({
            data: {
                candidateId: user.candidateId,
                type: dto.type,
                fileUrl,
                status: 'uploaded',
                uploadedAt: new Date(),
            },
        });
    }
    listForCandidate(user) {
        if (!user.candidateId) {
            throw new common_1.ForbiddenException('Usuario no es candidato.');
        }
        return this.prisma.candidateDocument.findMany({
            where: { candidateId: user.candidateId },
            orderBy: { uploadedAt: 'desc' },
        });
    }
    listPending() {
        return this.prisma.candidateDocument.findMany({
            where: { status: { in: ['pending', 'uploaded'] } },
            include: { candidate: true },
            orderBy: { uploadedAt: 'desc' },
        });
    }
    listByCandidateId(candidateId) {
        return this.prisma.candidateDocument.findMany({
            where: { candidateId },
            orderBy: { uploadedAt: 'desc' },
        });
    }
    async updateStatus(id, dto) {
        const document = await this.prisma.candidateDocument.findUnique({ where: { id } });
        if (!document) {
            throw new common_1.NotFoundException('Documento no encontrado.');
        }
        return this.prisma.candidateDocument.update({
            where: { id },
            data: { status: dto.status, reviewedAt: new Date() },
        });
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        supabase_storage_service_1.SupabaseStorageService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map