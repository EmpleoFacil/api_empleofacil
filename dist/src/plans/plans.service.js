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
exports.PlansService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PlansService = class PlansService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const plans = await this.prisma.plan.findMany({
            where: { isActive: true },
            orderBy: { price: 'asc' },
        });
        return { items: plans };
    }
    async create(dto) {
        const plan = await this.prisma.plan.create({
            data: {
                id: dto.id,
                name: dto.name,
                price: dto.price,
                currency: dto.currency ?? 'NIO',
                publicationLimit: dto.publicationLimit,
                userLimit: dto.userLimit,
                visibleCandidatesLimit: dto.visibleCandidatesLimit,
            },
        });
        return { success: true, message: 'Plan creado correctamente', data: plan };
    }
    async update(id, dto) {
        const existing = await this.prisma.plan.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException('Plan no encontrado');
        }
        const plan = await this.prisma.plan.update({
            where: { id },
            data: dto,
        });
        return { success: true, message: 'Plan actualizado correctamente', data: plan };
    }
    async remove(id) {
        const existing = await this.prisma.plan.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException('Plan no encontrado');
        }
        await this.prisma.plan.update({
            where: { id },
            data: { isActive: false },
        });
        return { success: true, message: 'Plan eliminado correctamente' };
    }
};
exports.PlansService = PlansService;
exports.PlansService = PlansService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlansService);
//# sourceMappingURL=plans.service.js.map