import type { AuthUser } from '../common/types/auth-user';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewStatusDto } from './dto/update-interview-status.dto';
import { RescheduleInterviewDto } from './dto/reschedule-interview.dto';
import { InterviewsService } from './interviews.service';
export declare class InterviewsController {
    private readonly interviewsService;
    constructor(interviewsService: InterviewsService);
    create(user: AuthUser, dto: CreateInterviewDto): Promise<{
        id: string;
        date: Date;
        modality: string;
        location: string | null;
        meetingUrl: string | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        notesForCandidate: string | null;
        responsibleUserId: string | null;
        createdAt: Date;
        updatedAt: Date;
        applicationId: string;
        companyId: string;
        candidateId: string;
        jobId: string;
    }>;
    listForCandidate(user: AuthUser): import(".prisma/client").Prisma.PrismaPromise<({
        application: {
            job: {
                id: string;
                modality: string | null;
                status: import(".prisma/client").$Enums.JobStatus;
                createdAt: Date;
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
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            updatedAt: Date;
            candidateId: string;
            jobId: string;
            appliedAt: Date;
        };
        company: {
            id: string;
            status: import(".prisma/client").$Enums.CompanyStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            city: string | null;
            country: string | null;
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
        date: Date;
        modality: string;
        location: string | null;
        meetingUrl: string | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        notesForCandidate: string | null;
        responsibleUserId: string | null;
        createdAt: Date;
        updatedAt: Date;
        applicationId: string;
        companyId: string;
        candidateId: string;
        jobId: string;
    })[]>;
    listForCompany(user: AuthUser, status?: string, jobId?: string, search?: string, dateFrom?: string, dateTo?: string, page?: string, limit?: string): import(".prisma/client").Prisma.PrismaPromise<({
        application: {
            id: string;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            updatedAt: Date;
            candidateId: string;
            jobId: string;
            appliedAt: Date;
        };
        candidate: {
            id: string;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
            city: string | null;
            country: string | null;
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
        job: {
            id: string;
            modality: string | null;
            status: import(".prisma/client").$Enums.JobStatus;
            createdAt: Date;
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
        };
    } & {
        id: string;
        date: Date;
        modality: string;
        location: string | null;
        meetingUrl: string | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        notesForCandidate: string | null;
        responsibleUserId: string | null;
        createdAt: Date;
        updatedAt: Date;
        applicationId: string;
        companyId: string;
        candidateId: string;
        jobId: string;
    })[]>;
    getUpcoming(user: AuthUser, limit?: string): import(".prisma/client").Prisma.PrismaPromise<({
        application: {
            job: {
                id: string;
                modality: string | null;
                status: import(".prisma/client").$Enums.JobStatus;
                createdAt: Date;
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
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            updatedAt: Date;
            candidateId: string;
            jobId: string;
            appliedAt: Date;
        };
        candidate: {
            id: string;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
            city: string | null;
            country: string | null;
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
    } & {
        id: string;
        date: Date;
        modality: string;
        location: string | null;
        meetingUrl: string | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        notesForCandidate: string | null;
        responsibleUserId: string | null;
        createdAt: Date;
        updatedAt: Date;
        applicationId: string;
        companyId: string;
        candidateId: string;
        jobId: string;
    })[]>;
    getSummary(user: AuthUser): Promise<{
        total: {
            value: number;
            trend: number;
        };
        pending: {
            value: number;
        };
        confirmed: {
            value: number;
        };
        rescheduled: {
            value: number;
        };
        completed: {
            value: number;
        };
    }>;
    getById(id: string, user: AuthUser): Promise<{
        application: {
            job: {
                company: {
                    id: string;
                    status: import(".prisma/client").$Enums.CompanyStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    city: string | null;
                    country: string | null;
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
                modality: string | null;
                status: import(".prisma/client").$Enums.JobStatus;
                createdAt: Date;
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
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            updatedAt: Date;
            candidateId: string;
            jobId: string;
            appliedAt: Date;
        };
        company: {
            id: string;
            status: import(".prisma/client").$Enums.CompanyStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            city: string | null;
            country: string | null;
            slug: string;
            legalName: string | null;
            email: string | null;
            phone: string | null;
            address: string | null;
            website: string | null;
            logoUrl: string | null;
            planId: string | null;
        };
        candidate: {
            id: string;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
            city: string | null;
            country: string | null;
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
        job: {
            id: string;
            modality: string | null;
            status: import(".prisma/client").$Enums.JobStatus;
            createdAt: Date;
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
        };
    } & {
        id: string;
        date: Date;
        modality: string;
        location: string | null;
        meetingUrl: string | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        notesForCandidate: string | null;
        responsibleUserId: string | null;
        createdAt: Date;
        updatedAt: Date;
        applicationId: string;
        companyId: string;
        candidateId: string;
        jobId: string;
    }>;
    confirm(id: string, user: AuthUser): Promise<{
        id: string;
        date: Date;
        modality: string;
        location: string | null;
        meetingUrl: string | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        notesForCandidate: string | null;
        responsibleUserId: string | null;
        createdAt: Date;
        updatedAt: Date;
        applicationId: string;
        companyId: string;
        candidateId: string;
        jobId: string;
    }>;
    requestReschedule(id: string, dto: RescheduleInterviewDto, user: AuthUser): Promise<{
        id: string;
        date: Date;
        modality: string;
        location: string | null;
        meetingUrl: string | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        notesForCandidate: string | null;
        responsibleUserId: string | null;
        createdAt: Date;
        updatedAt: Date;
        applicationId: string;
        companyId: string;
        candidateId: string;
        jobId: string;
    }>;
    updateStatus(id: string, dto: UpdateInterviewStatusDto, user: AuthUser): Promise<{
        id: string;
        date: Date;
        modality: string;
        location: string | null;
        meetingUrl: string | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        notesForCandidate: string | null;
        responsibleUserId: string | null;
        createdAt: Date;
        updatedAt: Date;
        applicationId: string;
        companyId: string;
        candidateId: string;
        jobId: string;
    }>;
    reschedule(id: string, dto: RescheduleInterviewDto, user: AuthUser): Promise<{
        id: string;
        date: Date;
        modality: string;
        location: string | null;
        meetingUrl: string | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        notesForCandidate: string | null;
        responsibleUserId: string | null;
        createdAt: Date;
        updatedAt: Date;
        applicationId: string;
        companyId: string;
        candidateId: string;
        jobId: string;
    }>;
    update(id: string, user: AuthUser, data: {
        date?: string;
        modality?: string;
        location?: string;
        meetingUrl?: string;
        notesForCandidate?: string;
    }): Promise<{
        id: string;
        date: Date;
        modality: string;
        location: string | null;
        meetingUrl: string | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        notesForCandidate: string | null;
        responsibleUserId: string | null;
        createdAt: Date;
        updatedAt: Date;
        applicationId: string;
        companyId: string;
        candidateId: string;
        jobId: string;
    }>;
    sendReminder(id: string, user: AuthUser): Promise<{
        sent: boolean;
        interviewId: string;
        candidateId: string;
    }>;
    recordResult(id: string, user: AuthUser, data: {
        result: string;
        notes?: string;
        moveApplicationStatus?: string;
    }): Promise<{
        id: string;
        date: Date;
        modality: string;
        location: string | null;
        meetingUrl: string | null;
        status: import(".prisma/client").$Enums.InterviewStatus;
        notesForCandidate: string | null;
        responsibleUserId: string | null;
        createdAt: Date;
        updatedAt: Date;
        applicationId: string;
        companyId: string;
        candidateId: string;
        jobId: string;
    }>;
}
