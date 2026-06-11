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
            interviewerName: string | null;
            contactPhone: string | null;
            mapUrl: string | null;
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
    listForCompany(user: AuthUser, search?: string, jobId?: string, status?: string, page?: string, limit?: string): Promise<{
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
            interviewerName: string | null;
            contactPhone: string | null;
            mapUrl: string | null;
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
        notes: ({
            author: {
                id: string;
                email: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            applicationId: string;
            note: string;
            authorUserId: string;
            updatedByUserId: string | null;
        })[];
    } & {
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        appliedAt: Date;
        jobId: string;
        candidateId: string;
    }>;
    updateStatus(id: string, dto: UpdateApplicationStatusDto, user: AuthUser): Promise<{
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        appliedAt: Date;
        jobId: string;
        candidateId: string;
    }>;
    addNote(id: string, dto: ApplicationNoteDto, user: AuthUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        applicationId: string;
        note: string;
        authorUserId: string;
        updatedByUserId: string | null;
    }>;
    updateNote(id: string, noteId: string, dto: ApplicationNoteDto, user: AuthUser): Promise<{
        author: {
            id: string;
            email: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        applicationId: string;
        note: string;
        authorUserId: string;
        updatedByUserId: string | null;
    }>;
}
