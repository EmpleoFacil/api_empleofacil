import type { AuthUser } from '../common/types/auth-user';
import { ApplicationsService } from './applications.service';
import { ApplicationNoteDto } from './dto/application-note.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
export declare class ApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
    create(user: AuthUser, dto: CreateApplicationDto): Promise<{
        id: string;
        jobId: string;
        candidateId: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        appliedAt: Date;
        updatedAt: Date;
    }>;
    listForCandidate(user: AuthUser): import(".prisma/client").Prisma.PrismaPromise<({
        job: {
            company: {
                id: string;
                status: import(".prisma/client").$Enums.CompanyStatus;
                updatedAt: Date;
                name: string;
                city: string | null;
                country: string | null;
                createdAt: Date;
                slug: string;
                legalName: string | null;
                email: string | null;
                phone: string | null;
                address: string | null;
                website: string | null;
                logoUrl: string | null;
                planId: string | null;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.JobStatus;
            updatedAt: Date;
            companyId: string;
            categoryId: string | null;
            title: string;
            description: string | null;
            requirements: string[];
            benefits: string[];
            city: string | null;
            country: string | null;
            salaryMin: number | null;
            salaryMax: number | null;
            currency: string;
            employmentType: string | null;
            modality: string | null;
            createdAt: Date;
        };
        interviews: {
            id: string;
            jobId: string;
            candidateId: string;
            status: import(".prisma/client").$Enums.InterviewStatus;
            updatedAt: Date;
            companyId: string;
            modality: string;
            createdAt: Date;
            date: Date;
            applicationId: string;
            location: string | null;
            meetingUrl: string | null;
            interviewerName: string | null;
            contactPhone: string | null;
            mapUrl: string | null;
            notesForCandidate: string | null;
            responsibleUserId: string | null;
        }[];
        messages: {
            id: string;
            candidateId: string;
            status: import(".prisma/client").$Enums.MessageStatus;
            updatedAt: Date;
            companyId: string;
            title: string;
            createdAt: Date;
            applicationId: string | null;
            parentMessageId: string | null;
            type: import(".prisma/client").$Enums.MessageType;
            body: string;
            sentAt: Date | null;
            readAt: Date | null;
            respondedAt: Date | null;
        }[];
    } & {
        id: string;
        jobId: string;
        candidateId: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        appliedAt: Date;
        updatedAt: Date;
    })[]>;
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
    getByJobForCandidate(jobId: string, user: AuthUser): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        appliedAt: Date;
    } | null>;
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
        job: {
            id: string;
            title: string;
        };
        candidate: {
            id: string;
            city: string | null;
            fullName: string;
        };
    } & {
        id: string;
        jobId: string;
        candidateId: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        appliedAt: Date;
        updatedAt: Date;
    })[]>>;
    exportForCompany(user: AuthUser, jobId?: string): Promise<({
        job: {
            title: string;
        };
        candidate: {
            city: string | null;
            phone: string | null;
            fullName: string;
        };
    } & {
        id: string;
        jobId: string;
        candidateId: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        appliedAt: Date;
        updatedAt: Date;
    })[]>;
    listForCompany(user: AuthUser, search?: string, jobId?: string, status?: string, page?: string, limit?: string): Promise<{
        applications: ({
            job: {
                id: string;
                title: string;
            };
            candidate: {
                id: string;
                city: string | null;
                fullName: string;
            };
        } & {
            id: string;
            jobId: string;
            candidateId: string;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            appliedAt: Date;
            updatedAt: Date;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getById(id: string, user: AuthUser): Promise<{
        job: {
            company: {
                id: string;
                status: import(".prisma/client").$Enums.CompanyStatus;
                updatedAt: Date;
                name: string;
                city: string | null;
                country: string | null;
                createdAt: Date;
                slug: string;
                legalName: string | null;
                email: string | null;
                phone: string | null;
                address: string | null;
                website: string | null;
                logoUrl: string | null;
                planId: string | null;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.JobStatus;
            updatedAt: Date;
            companyId: string;
            categoryId: string | null;
            title: string;
            description: string | null;
            requirements: string[];
            benefits: string[];
            city: string | null;
            country: string | null;
            salaryMin: number | null;
            salaryMax: number | null;
            currency: string;
            employmentType: string | null;
            modality: string | null;
            createdAt: Date;
        };
        candidate: {
            id: string;
            status: import(".prisma/client").$Enums.UserStatus;
            updatedAt: Date;
            city: string | null;
            country: string | null;
            createdAt: Date;
            phone: string | null;
            userId: string;
            fullName: string;
            desiredJobType: string | null;
            availability: string | null;
            salaryExpectationMin: number | null;
            salaryExpectationMax: number | null;
            experienceLevel: string | null;
            educationLevel: string | null;
            profileCompletion: number;
        };
        interviews: {
            id: string;
            jobId: string;
            candidateId: string;
            status: import(".prisma/client").$Enums.InterviewStatus;
            updatedAt: Date;
            companyId: string;
            modality: string;
            createdAt: Date;
            date: Date;
            applicationId: string;
            location: string | null;
            meetingUrl: string | null;
            interviewerName: string | null;
            contactPhone: string | null;
            mapUrl: string | null;
            notesForCandidate: string | null;
            responsibleUserId: string | null;
        }[];
        messages: {
            id: string;
            candidateId: string;
            status: import(".prisma/client").$Enums.MessageStatus;
            updatedAt: Date;
            companyId: string;
            title: string;
            createdAt: Date;
            applicationId: string | null;
            parentMessageId: string | null;
            type: import(".prisma/client").$Enums.MessageType;
            body: string;
            sentAt: Date | null;
            readAt: Date | null;
            respondedAt: Date | null;
        }[];
        notes: ({
            author: {
                id: string;
                email: string | null;
            };
        } & {
            id: string;
            updatedAt: Date;
            createdAt: Date;
            applicationId: string;
            authorUserId: string;
            note: string;
            updatedByUserId: string | null;
        })[];
    } & {
        id: string;
        jobId: string;
        candidateId: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        appliedAt: Date;
        updatedAt: Date;
    }>;
    updateStatus(id: string, dto: UpdateApplicationStatusDto, user: AuthUser): Promise<{
        id: string;
        jobId: string;
        candidateId: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        appliedAt: Date;
        updatedAt: Date;
    }>;
    addNote(id: string, dto: ApplicationNoteDto, user: AuthUser): Promise<{
        id: string;
        updatedAt: Date;
        createdAt: Date;
        applicationId: string;
        authorUserId: string;
        note: string;
        updatedByUserId: string | null;
    }>;
    updateNote(id: string, noteId: string, dto: ApplicationNoteDto, user: AuthUser): Promise<{
        author: {
            id: string;
            email: string | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        createdAt: Date;
        applicationId: string;
        authorUserId: string;
        note: string;
        updatedByUserId: string | null;
    }>;
}
