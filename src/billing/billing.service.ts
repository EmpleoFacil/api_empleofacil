import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ManualPaymentDto } from './dto/manual-payment.dto';
import type { AuthUser } from '../common/types/auth-user';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async getCompanyPlan(user: AuthUser) {
    if (!user.companyId) {
      throw new ForbiddenException('Usuario sin empresa asignada');
    }

    const company = await this.prisma.company.findUnique({
      where: { id: user.companyId },
      include: { plan: true },
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
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

  async getCompanyHistory(user: AuthUser) {
    if (!user.companyId) {
      throw new ForbiddenException('Usuario sin empresa asignada');
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

  async createManualPayment(dto: ManualPaymentDto) {
    const company = await this.prisma.company.findUnique({
      where: { id: dto.companyId },
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    const plan = await this.prisma.plan.findUnique({
      where: { id: dto.planId },
    });

    if (!plan) {
      throw new NotFoundException('Plan no encontrado');
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

  // ========== SA-06: Plans Management ==========

  async getPlans() {
    return this.prisma.plan.findMany({
      orderBy: { price: 'asc' },
    });
  }

  async createPlan(data: { id: string; name: string; price: number; publicationLimit?: number; userLimit?: number; visibleCandidatesLimit?: number }) {
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

  async updatePlan(id: string, data: { name?: string; price?: number; publicationLimit?: number; userLimit?: number; visibleCandidatesLimit?: number; isActive?: boolean }) {
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

  async deletePlan(id: string) {
    return this.prisma.plan.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getAdminPayments(filters: { status?: string; page?: number; limit?: number }) {
    const { status, page = 1, limit = 10 } = filters;
    const where: any = {};
    if (status) where.status = status;

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

  async assignPlanToCompany(companyId: string, planId: string) {
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException('Plan no encontrado');

    return this.prisma.company.update({
      where: { id: companyId },
      data: { planId },
      include: { plan: true },
    });
  }

  // ========== Platform Settings ==========

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

  async updatePlatformSettings(settings: Record<string, any>) {
    return this.prisma.platformSettings.upsert({
      where: { id: 'global' },
      update: { settings },
      create: { id: 'global', settings },
    });
  }
}
