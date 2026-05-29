import type { AuthUser } from '../common/types/auth-user';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompaniesService } from './companies.service';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    list(user: AuthUser): never[] | import(".prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    getPlanLimits(user: AuthUser): Promise<{
        plan: {
            name: string;
            id: string | null;
        };
        limits: {
            activeJobs: {
                current: number;
                max: number;
                remaining: number;
            };
            visibleCandidates: {
                current: number;
                max: number;
                remaining: number;
            };
        };
        usage: {
            jobsThisMonth: number;
        };
    }>;
    getById(id: string, user: AuthUser): Promise<{
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
    create(dto: CreateCompanyDto): Promise<{
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
    update(id: string, dto: UpdateCompanyDto, user: AuthUser): Promise<{
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
    getMe(user: AuthUser): Promise<({
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
    }) | null>;
    updateMe(user: AuthUser, data: {
        name?: string;
        email?: string;
        phone?: string;
        city?: string;
        address?: string;
        website?: string;
        logo?: string;
    }): Promise<{
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
    getUsers(user: AuthUser): Promise<{
        companyRole: import(".prisma/client").$Enums.CompanyRole;
        id: string;
        createdAt: Date;
        email: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
    }[]>;
    createUser(user: AuthUser, data: {
        email: string;
        name: string;
        role: string;
        password: string;
    }): Promise<{
        id: string;
        email: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        companyRole: string;
    }>;
    updateUser(user: AuthUser, userId: string, data: {
        name?: string;
        role?: string;
        status?: string;
    }): Promise<{
        id: string | undefined;
        email: string | null | undefined;
        role: import(".prisma/client").$Enums.UserRole | undefined;
        status: import(".prisma/client").$Enums.UserStatus | undefined;
        companyRole: import(".prisma/client").$Enums.CompanyRole | undefined;
    }>;
    deleteUser(user: AuthUser, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string | null;
        passwordHash: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
    }>;
    getCompanyPlan(user: AuthUser): Promise<{
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
        usage: {
            jobs: {
                current: number;
                max: number;
            };
            users: {
                current: number;
                max: number;
            };
            candidates: {
                current: number;
                max: number;
            };
        };
        renewalDate: Date;
    }>;
    getPlans(): import(".prisma/client").Prisma.PrismaPromise<{
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
    updatePlan(user: AuthUser, planId: string): Promise<{
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
    adminListCompanies(status?: string, planId?: string, search?: string, page?: string, limit?: string): Promise<{
        companies: ({
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
            _count: {
                users: number;
                jobs: number;
            };
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    adminGetSummary(): Promise<{
        active: {
            value: number;
            trend: number;
        };
        suspended: {
            value: number;
        };
        pending: {
            value: number;
        };
        total: {
            value: number;
            trend: number;
        };
    }>;
    adminUpdateStatus(id: string, status: string): Promise<{
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
    adminDeleteCompany(id: string): Promise<{
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
    adminGetCompanyDetail(id: string): Promise<{
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
    adminGetCompanyUsers(id: string): Promise<{
        companyRole: import(".prisma/client").$Enums.CompanyRole;
        companyUserId: string;
        id: string;
        createdAt: Date;
        email: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
    }[]>;
    adminGetCompanyJobs(id: string, status?: string, page?: string, limit?: string): Promise<{
        jobs: ({
            _count: {
                applications: number;
            };
        } & {
            id: string;
            currency: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.JobStatus;
            city: string | null;
            country: string | null;
            companyId: string;
            title: string;
            description: string | null;
            requirements: string[];
            benefits: string[];
            salaryMin: number | null;
            salaryMax: number | null;
            employmentType: string | null;
            modality: string | null;
            categoryId: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    adminGetCompanyApplications(id: string, status?: string, page?: string, limit?: string): Promise<{
        applications: ({
            candidate: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                phone: string | null;
                status: import(".prisma/client").$Enums.UserStatus;
                fullName: string;
                city: string | null;
                country: string | null;
                desiredJobType: string | null;
                availability: string | null;
                salaryExpectationMin: number | null;
                salaryExpectationMax: number | null;
                experienceLevel: string | null;
                educationLevel: string | null;
                profileCompletion: number;
                userId: string;
            };
            job: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            appliedAt: Date;
            jobId: string;
            candidateId: string;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    adminGetCompanyMetrics(id: string): Promise<{
        activeJobs: {
            value: number;
            trend: number;
        };
        totalApplications: {
            value: number;
            trend: number;
        };
        scheduledInterviews: {
            value: number;
            trend: number;
        };
        hires: {
            value: number;
            trend: number;
        };
        recentActivity: {
            id: string;
            createdAt: Date;
            actorUserId: string | null;
            entityType: string;
            entityId: string | null;
            action: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    }>;
    adminUpdateCompanyPlan(id: string, planId: string): Promise<{
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
    adminCreateCompanyUser(id: string, data: {
        email: string;
        role: string;
        password: string;
    }): Promise<{
        id: string;
        email: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        companyRole: string;
    }>;
    adminUpdateCompanyUser(companyId: string, userId: string, data: {
        role?: string;
        status?: string;
    }): Promise<{
        success: boolean;
    }>;
    adminUpdateCompany(id: string, data: {
        name?: string;
        email?: string;
        phone?: string;
        city?: string;
        address?: string;
        website?: string;
        planId?: string;
    }): Promise<{
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
}
