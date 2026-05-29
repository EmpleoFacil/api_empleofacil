import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../common/types/auth-user';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
export declare class ApplicationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(user: AuthUser, dto: CreateApplicationDto): Promise<{
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        appliedAt: Date;
        jobId: string;
        candidateId: string;
    }>;
    listForCandidate(user: AuthUser): import(".prisma/client").Prisma.PrismaPromise<({
        interviews: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.InterviewStatus;
            companyId: string;
            modality: string;
            jobId: string;
            candidateId: string;
            date: Date;
            location: string | null;
            meetingUrl: string | null;
            notesForCandidate: string | null;
            responsibleUserId: string | null;
            applicationId: string;
        }[];
        messages: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.MessageStatus;
            companyId: string;
            title: string;
            candidateId: string;
            applicationId: string | null;
            type: import(".prisma/client").$Enums.MessageType;
            body: string;
            sentAt: Date | null;
            readAt: Date | null;
            respondedAt: Date | null;
            parentMessageId: string | null;
        }[];
        job: {
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
    getById(id: string, user: AuthUser): Promise<{
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
        interviews: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.InterviewStatus;
            companyId: string;
            modality: string;
            jobId: string;
            candidateId: string;
            date: Date;
            location: string | null;
            meetingUrl: string | null;
            notesForCandidate: string | null;
            responsibleUserId: string | null;
            applicationId: string;
        }[];
        messages: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.MessageStatus;
            companyId: string;
            title: string;
            candidateId: string;
            applicationId: string | null;
            type: import(".prisma/client").$Enums.MessageType;
            body: string;
            sentAt: Date | null;
            readAt: Date | null;
            respondedAt: Date | null;
            parentMessageId: string | null;
        }[];
        job: {
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
        notes: {
            id: string;
            createdAt: Date;
            applicationId: string;
            authorUserId: string;
            note: string;
        }[];
    } & {
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        appliedAt: Date;
        jobId: string;
        candidateId: string;
    }>;
    getByJobForCandidate(jobId: string, user: AuthUser): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        appliedAt: Date;
    } | null>;
    getSummary(user: AuthUser): Promise<{
        total: number;
        enRevision: number;
        entrevista: number;
        noSeleccionado: number;
        postulado: number;
    }>;
    getStatusSummary(user: AuthUser): Promise<{
        enRevision: number;
    }>;
    listForCompany(user: AuthUser): never[] | import(".prisma/client").Prisma.PrismaPromise<({
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
    updateStatus(id: string, dto: UpdateApplicationStatusDto, user: AuthUser): Promise<{
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        appliedAt: Date;
        jobId: string;
        candidateId: string;
    }>;
    getSummaryForCompany(user: AuthUser): Promise<{
        total: {
            value: number;
        };
        nuevo: {
            value: number;
        };
        enRevision: {
            value: number;
        };
        entrevista: {
            value: number;
        };
        descartado: {
            value: number;
        };
        contratado: {
            value: number;
        };
    }>;
    getPipeline(user: AuthUser, jobId?: string): Promise<Record<string, ({
        candidate: {
            id: string;
            fullName: string;
            city: string | null;
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
    })[]>>;
    listForCompanyPaginated(user: AuthUser, params: {
        search?: string;
        jobId?: string;
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        applications: ({
            candidate: {
                id: string;
                fullName: string;
                city: string | null;
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
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    addNote(id: string, user: AuthUser, content: string): Promise<{
        id: string;
        createdAt: Date;
        applicationId: string;
        authorUserId: string;
        note: string;
    }>;
    exportForCompany(user: AuthUser, jobId?: string): Promise<({
        candidate: {
            phone: string | null;
            fullName: string;
            city: string | null;
        };
        job: {
            title: string;
        };
    } & {
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        appliedAt: Date;
        jobId: string;
        candidateId: string;
    })[]>;
}
