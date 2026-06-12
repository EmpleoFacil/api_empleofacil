import type { AuthUser } from '../common/types/auth-user';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobsService } from './jobs.service';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    getCategories(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        icon: string | null;
    }[]>;
    getRecommended(user: AuthUser, categoryId?: string): Promise<({
        company: {
            id: string;
            name: string;
            logoUrl: string | null;
        };
        category: {
            id: string;
            name: string;
            isActive: boolean;
            icon: string | null;
        } | null;
    } & {
        id: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.JobStatus;
        city: string | null;
        country: string | null;
        companyId: string;
        customCategory: string | null;
        title: string;
        description: string | null;
        requirements: string[];
        benefits: string[];
        salaryMin: number | null;
        salaryMax: number | null;
        employmentType: string | null;
        modality: string | null;
        expiresAt: Date | null;
        categoryId: string | null;
    })[]>;
    search(query?: string, city?: string, categoryId?: string, page?: string): Promise<{
        items: ({
            company: {
                id: string;
                name: string;
                logoUrl: string | null;
            };
            category: {
                id: string;
                name: string;
                isActive: boolean;
                icon: string | null;
            } | null;
        } & {
            id: string;
            currency: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.JobStatus;
            city: string | null;
            country: string | null;
            companyId: string;
            customCategory: string | null;
            title: string;
            description: string | null;
            requirements: string[];
            benefits: string[];
            salaryMin: number | null;
            salaryMax: number | null;
            employmentType: string | null;
            modality: string | null;
            expiresAt: Date | null;
            categoryId: string | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    list(user: AuthUser): Promise<{
        id: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.JobStatus;
        city: string | null;
        country: string | null;
        companyId: string;
        customCategory: string | null;
        title: string;
        description: string | null;
        requirements: string[];
        benefits: string[];
        salaryMin: number | null;
        salaryMax: number | null;
        employmentType: string | null;
        modality: string | null;
        expiresAt: Date | null;
        categoryId: string | null;
    }[]>;
    getCompanySummary(user: AuthUser): Promise<{
        active: {
            value: number;
            trend: number;
        };
        paused: {
            value: number;
            trend: number;
        };
        closed: {
            value: number;
            trend: number;
        };
        applications: {
            value: number;
            trend: number;
        };
    }>;
    getCompanyJobs(user: AuthUser, query?: string, city?: string, status?: string, page?: string, limit?: string): Promise<{
        items: {
            applications: number;
            _count: {
                applications: number;
            };
            id: string;
            currency: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.JobStatus;
            city: string | null;
            country: string | null;
            companyId: string;
            customCategory: string | null;
            title: string;
            description: string | null;
            requirements: string[];
            benefits: string[];
            salaryMin: number | null;
            salaryMax: number | null;
            employmentType: string | null;
            modality: string | null;
            expiresAt: Date | null;
            categoryId: string | null;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getAdminJobs(query?: string, companyId?: string, status?: string, page?: string, limit?: string): Promise<{
        items: {
            applications: number;
            company: {
                id: string;
                name: string;
            };
            _count: {
                applications: number;
            };
            id: string;
            currency: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.JobStatus;
            city: string | null;
            country: string | null;
            companyId: string;
            customCategory: string | null;
            title: string;
            description: string | null;
            requirements: string[];
            benefits: string[];
            salaryMin: number | null;
            salaryMax: number | null;
            employmentType: string | null;
            modality: string | null;
            expiresAt: Date | null;
            categoryId: string | null;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    updateStatus(id: string, user: AuthUser, status: string): Promise<{
        id: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.JobStatus;
        city: string | null;
        country: string | null;
        companyId: string;
        customCategory: string | null;
        title: string;
        description: string | null;
        requirements: string[];
        benefits: string[];
        salaryMin: number | null;
        salaryMax: number | null;
        employmentType: string | null;
        modality: string | null;
        expiresAt: Date | null;
        categoryId: string | null;
    }>;
    getById(id: string, user: AuthUser): Promise<{
        company: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            phone: string | null;
            secondaryPhone: string | null;
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
        category: {
            id: string;
            name: string;
            isActive: boolean;
            icon: string | null;
        } | null;
    } & {
        id: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.JobStatus;
        city: string | null;
        country: string | null;
        companyId: string;
        customCategory: string | null;
        title: string;
        description: string | null;
        requirements: string[];
        benefits: string[];
        salaryMin: number | null;
        salaryMax: number | null;
        employmentType: string | null;
        modality: string | null;
        expiresAt: Date | null;
        categoryId: string | null;
    }>;
    create(user: AuthUser, dto: CreateJobDto): Promise<{
        id: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.JobStatus;
        city: string | null;
        country: string | null;
        companyId: string;
        customCategory: string | null;
        title: string;
        description: string | null;
        requirements: string[];
        benefits: string[];
        salaryMin: number | null;
        salaryMax: number | null;
        employmentType: string | null;
        modality: string | null;
        expiresAt: Date | null;
        categoryId: string | null;
    }>;
    update(id: string, user: AuthUser, dto: UpdateJobDto): Promise<{
        id: string;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.JobStatus;
        city: string | null;
        country: string | null;
        companyId: string;
        customCategory: string | null;
        title: string;
        description: string | null;
        requirements: string[];
        benefits: string[];
        salaryMin: number | null;
        salaryMax: number | null;
        employmentType: string | null;
        modality: string | null;
        expiresAt: Date | null;
        categoryId: string | null;
    }>;
    remove(id: string, user: AuthUser): Promise<{
        status: string;
    }>;
}
