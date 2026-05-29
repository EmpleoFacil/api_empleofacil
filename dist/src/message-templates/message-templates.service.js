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
exports.MessageTemplatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MessageTemplatesService = class MessageTemplatesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(user) {
        const where = user.role === 'super_admin'
            ? { isActive: true }
            : {
                isActive: true,
                OR: [{ companyId: null }, { companyId: user.companyId }],
            };
        const templates = await this.prisma.messageTemplate.findMany({
            where,
            orderBy: { name: 'asc' },
        });
        return { items: templates };
    }
    async create(user, dto) {
        const companyId = user.role === 'super_admin' ? dto.companyId ?? null : user.companyId;
        const template = await this.prisma.messageTemplate.create({
            data: {
                companyId,
                name: dto.name,
                type: dto.type,
                subject: dto.subject,
                body: dto.body,
            },
        });
        return {
            success: true,
            message: 'Plantilla creada correctamente',
            data: template,
        };
    }
    async update(user, id, dto) {
        const template = await this.prisma.messageTemplate.findUnique({
            where: { id },
        });
        if (!template) {
            throw new common_1.NotFoundException('Plantilla no encontrada');
        }
        if (user.role !== 'super_admin' &&
            template.companyId !== user.companyId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta plantilla');
        }
        const updated = await this.prisma.messageTemplate.update({
            where: { id },
            data: {
                name: dto.name,
                type: dto.type,
                subject: dto.subject,
                body: dto.body,
            },
        });
        return {
            success: true,
            message: 'Plantilla actualizada correctamente',
            data: updated,
        };
    }
};
exports.MessageTemplatesService = MessageTemplatesService;
exports.MessageTemplatesService = MessageTemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessageTemplatesService);
//# sourceMappingURL=message-templates.service.js.map