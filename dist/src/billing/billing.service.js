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
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BillingService = class BillingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCompanyPlan(user) {
        if (!user.companyId) {
            throw new common_1.ForbiddenException('Usuario sin empresa asignada');
        }
        const company = await this.prisma.company.findUnique({
            where: { id: user.companyId },
            include: { plan: true },
        });
        if (!company) {
            throw new common_1.NotFoundException('Empresa no encontrada');
        }
        const subscription = await this.prisma.billingSubscription.findFirst({
            where: { companyId: user.companyId, status: 'active' },
            include: { plan: true },
        });
        return {
            data: {
                company: {
                    id: company.id,
                    name: company.name,
                },
                plan: company.plan,
                subscription,
                limits: company.plan
                    ? {
                        publications: company.plan.publicationLimit,
                        users: company.plan.userLimit,
                        candidates: company.plan.visibleCandidatesLimit,
                    }
                    : null,
            },
        };
    }
    async getCompanyHistory(user) {
        if (!user.companyId) {
            throw new common_1.ForbiddenException('Usuario sin empresa asignada');
        }
        const payments = await this.prisma.billingPayment.findMany({
            where: { companyId: user.companyId },
            include: { plan: true },
            orderBy: { createdAt: 'desc' },
        });
        return { items: payments };
    }
    async getAdminBilling() {
        const [payments, subscriptions, summary] = await Promise.all([
            this.prisma.billingPayment.findMany({
                include: { company: true, plan: true },
                orderBy: { createdAt: 'desc' },
                take: 50,
            }),
            this.prisma.billingSubscription.findMany({
                where: { status: 'active' },
                include: { company: true, plan: true },
            }),
            this.prisma.billingPayment.groupBy({
                by: ['status'],
                _sum: { amount: true },
                _count: true,
            }),
        ]);
        return {
            items: payments,
            summary: {
                activeSubscriptions: subscriptions.length,
                paymentsByStatus: summary,
            },
        };
    }
    async createManualPayment(dto) {
        const company = await this.prisma.company.findUnique({
            where: { id: dto.companyId },
        });
        if (!company) {
            throw new common_1.NotFoundException('Empresa no encontrada');
        }
        const plan = await this.prisma.plan.findUnique({
            where: { id: dto.planId },
        });
        if (!plan) {
            throw new common_1.NotFoundException('Plan no encontrado');
        }
        const payment = await this.prisma.billingPayment.create({
            data: {
                companyId: dto.companyId,
                planId: dto.planId,
                amount: dto.amount,
                currency: dto.currency ?? 'NIO',
                status: 'paid',
                paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : new Date(),
                reference: dto.reference,
                notes: dto.notes,
            },
        });
        return {
            success: true,
            message: 'Pago registrado correctamente',
            data: payment,
        };
    }
    async getPlans() {
        return this.prisma.plan.findMany({
            orderBy: { price: 'asc' },
        });
    }
    async createPlan(data) {
        return this.prisma.plan.create({
            data: {
                id: data.id,
                name: data.name,
                price: data.price,
                publicationLimit: data.publicationLimit,
                userLimit: data.userLimit,
                visibleCandidatesLimit: data.visibleCandidatesLimit,
                isActive: true,
            },
        });
    }
    async updatePlan(id, data) {
        return this.prisma.plan.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.price !== undefined && { price: data.price }),
                ...(data.publicationLimit !== undefined && { publicationLimit: data.publicationLimit }),
                ...(data.userLimit !== undefined && { userLimit: data.userLimit }),
                ...(data.visibleCandidatesLimit !== undefined && { visibleCandidatesLimit: data.visibleCandidatesLimit }),
                ...(data.isActive !== undefined && { isActive: data.isActive }),
            },
        });
    }
    async deletePlan(id) {
        return this.prisma.plan.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async getAdminPayments(filters) {
        const { status, page = 1, limit = 10 } = filters;
        const where = {};
        if (status)
            where.status = status;
        const [payments, total] = await Promise.all([
            this.prisma.billingPayment.findMany({
                where,
                include: { company: { select: { id: true, name: true, city: true } }, plan: true },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.billingPayment.count({ where }),
        ]);
        return { payments, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async assignPlanToCompany(companyId, planId) {
        const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
        if (!plan)
            throw new common_1.NotFoundException('Plan no encontrado');
        return this.prisma.company.update({
            where: { id: companyId },
            data: { planId },
            include: { plan: true },
        });
    }
    async getPlatformSettings() {
        const settings = await this.prisma.platformSettings.findUnique({
            where: { id: 'global' },
        });
        return settings?.settings ?? {
            showCandidatesToCompanies: true,
            showExpectedSalary: true,
            showContactInfo: false,
            billingPeriod: 'monthly',
            graceDays: 7,
            paymentReminders: 'automatic',
            currency: 'NIO',
        };
    }
    async updatePlatformSettings(settings) {
        return this.prisma.platformSettings.upsert({
            where: { id: 'global' },
            update: { settings },
            create: { id: 'global', settings },
        });
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BillingService);
//# sourceMappingURL=billing.service.js.map