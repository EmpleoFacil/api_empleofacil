import type { AuthUser } from '../common/types/auth-user';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { CandidatesService } from './candidates.service';
export declare class CandidatesController {
    private readonly candidatesService;
    constructor(candidatesService: CandidatesService);
    getMe(user: AuthUser): Promise<({
        user: {
            id: string;
            email: string | null;
            phone: string | null;
            secondaryPhone: string | null;
        };
    } & {
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
    }) | null>;
    updateMe(user: AuthUser, dto: UpdateCandidateDto): Promise<{
        user: {
            id: string;
            email: string | null;
            phone: string | null;
            secondaryPhone: string | null;
        };
    } & {
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
    }>;
    getSummary(): Promise<{
        total: {
            value: number;
            trend: number;
        };
        complete: {
            value: number;
            trend: number;
        };
        pendingDocs: {
            value: number;
        };
        active: {
            value: number;
        };
    }>;
    exportCandidates(status?: string, city?: string): Promise<({
        user: {
            email: string | null;
        };
        _count: {
            applications: number;
        };
    } & {
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
    })[]>;
    list(search?: string, status?: string, city?: string, page?: string, limit?: string): Promise<{
        candidates: {
            documentsCount: number;
            user: {
                email: string | null;
            };
            _count: {
                applications: number;
            };
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
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getById(id: string, user: AuthUser): Promise<{
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            phone: string | null;
            secondaryPhone: string | null;
            passwordHash: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
        };
        applications: ({
            job: {
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
            };
        } & {
            id: string;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            appliedAt: Date;
            jobId: string;
            candidateId: string;
        })[];
    } & {
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
    }>;
    getApplications(id: string): Promise<({
        job: {
            company: {
                name: string;
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
        };
    } & {
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        appliedAt: Date;
        jobId: string;
        candidateId: string;
    })[]>;
    getDocuments(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DocumentStatus;
        candidateId: string;
        type: string;
        fileUrl: string | null;
        uploadedAt: Date | null;
        reviewedAt: Date | null;
        reviewedBy: string | null;
    }[]>;
    updateStatus(id: string, status: string): Promise<{
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
    }>;
}
