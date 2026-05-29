import { PrismaService } from '../prisma/prisma.service';
import { ManualPaymentDto } from './dto/manual-payment.dto';
import type { AuthUser } from '../common/types/auth-user';
export declare class BillingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCompanyPlan(user: AuthUser): Promise<{
        data: {
            company: {
                id: string;
                name: string;
            };
            plan: {
                id: string;
                name: string;
                price: number;
                currency: string;
                publicationLimit: number | null;
                userLimit: number | null;
                visibleCandidatesLimit: number | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            subscription: ({
                plan: {
                    id: string;
                    name: string;
                    price: number;
                    currency: string;
                    publicationLimit: number | null;
                    userLimit: number | null;
                    visibleCandidatesLimit: number | null;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.PlanStatus;
                planId: string;
                companyId: string;
                startDate: Date;
                endDate: Date | null;
            }) | null;
            limits: {
                publications: number | null;
                users: number | null;
                candidates: number | null;
            } | null;
        };
    }>;
    getCompanyHistory(user: AuthUser): Promise<{
        items: ({
            plan: {
                id: string;
                name: string;
                price: number;
                currency: string;
                publicationLimit: number | null;
                userLimit: number | null;
                visibleCandidatesLimit: number | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            currency: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.BillingStatus;
            planId: string;
            companyId: string;
            notes: string | null;
            amount: number;
            paymentDate: Date | null;
            reference: string | null;
        })[];
    }>;
    getAdminBilling(): Promise<{
        items: ({
            plan: {
                id: string;
                name: string;
                price: number;
                currency: string;
                publicationLimit: number | null;
                userLimit: number | null;
                visibleCandidatesLimit: number | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            company: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                phone: string | null;
                status: import(".prisma/client").$Enums.CompanyStatus;
                city: string | null;
                country: string | null;
                slug: string;
                legalName: string | null;
                address: string | null;
                website: string | null;
                logoUrl: string | null;
                planId: string | null;
            };
        } & {
            id: string;
            currency: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.BillingStatus;
            planId: string;
            companyId: string;
            notes: string | null;
            amount: number;
            paymentDate: Date | null;
            reference: string | null;
        })[];
        summary: {
            activeSubscriptions: number;
            paymentsByStatus: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BillingPaymentGroupByOutputType, "status"[]> & {
                _count: number;
                _sum: {
                    amount: number | null;
                };
            })[];
        };
    }>;
    createManualPayment(dto: ManualPaymentDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            currency: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.BillingStatus;
            planId: string;
            companyId: string;
            notes: string | null;
            amount: number;
            paymentDate: Date | null;
            reference: string | null;
        };
    }>;
    getPlans(): Promise<{
        id: string;
        name: string;
        price: number;
        currency: string;
        publicationLimit: number | null;
        userLimit: number | null;
        visibleCandidatesLimit: number | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createPlan(data: {
        id: string;
        name: string;
        price: number;
        publicationLimit?: number;
        userLimit?: number;
        visibleCandidatesLimit?: number;
    }): Promise<{
        id: string;
        name: string;
        price: number;
        currency: string;
        publicationLimit: number | null;
        userLimit: number | null;
        visibleCandidatesLimit: number | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updatePlan(id: string, data: {
        name?: string;
        price?: number;
        publicationLimit?: number;
        userLimit?: number;
        visibleCandidatesLimit?: number;
        isActive?: boolean;
    }): Promise<{
        id: string;
        name: string;
        price: number;
        currency: string;
        publicationLimit: number | null;
        userLimit: number | null;
        visibleCandidatesLimit: number | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deletePlan(id: string): Promise<{
        id: string;
        name: string;
        price: number;
        currency: string;
        publicationLimit: number | null;
        userLimit: number | null;
        visibleCandidatesLimit: number | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAdminPayments(filters: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        payments: ({
            plan: {
                id: string;
                name: string;
                price: number;
                currency: string;
                publicationLimit: number | null;
                userLimit: number | null;
                visibleCandidatesLimit: number | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            company: {
                id: string;
                name: string;
                city: string | null;
            };
        } & {
            id: string;
            currency: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.BillingStatus;
            planId: string;
            companyId: string;
            notes: string | null;
            amount: number;
            paymentDate: Date | null;
            reference: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    assignPlanToCompany(companyId: string, planId: string): Promise<{
        plan: {
            id: string;
            name: string;
            price: number;
            currency: string;
            publicationLimit: number | null;
            userLimit: number | null;
            visibleCandidatesLimit: number | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string | null;
        status: import(".prisma/client").$Enums.CompanyStatus;
        city: string | null;
        country: string | null;
        slug: string;
        legalName: string | null;
        address: string | null;
        website: string | null;
        logoUrl: string | null;
        planId: string | null;
    }>;
    getPlatformSettings(): Promise<string | number | boolean | import("@prisma/client/runtime/library").JsonObject | import("@prisma/client/runtime/library").JsonArray>;
    updatePlatformSettings(settings: Record<string, any>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        settings: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
