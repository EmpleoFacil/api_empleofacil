import type { AuthUser } from '../common/types/auth-user';
import { CreateMessageDto } from './dto/create-message.dto';
import { RespondMessageDto } from './dto/respond-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    create(user: AuthUser, dto: CreateMessageDto): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.MessageType;
        title: string;
        body: string;
        status: import(".prisma/client").$Enums.MessageStatus;
        sentAt: Date | null;
        readAt: Date | null;
        respondedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        candidateId: string;
        applicationId: string | null;
        parentMessageId: string | null;
    }>;
    listForCandidate(user: AuthUser): import(".prisma/client").Prisma.PrismaPromise<({
        company: {
            id: string;
            status: import(".prisma/client").$Enums.CompanyStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            legalName: string | null;
            email: string | null;
            phone: string | null;
            city: string | null;
            country: string | null;
            address: string | null;
            website: string | null;
            logoUrl: string | null;
            planId: string | null;
        };
        application: {
            id: string;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            updatedAt: Date;
            candidateId: string;
            jobId: string;
            appliedAt: Date;
        } | null;
        responses: {
            id: string;
            body: string | null;
            createdAt: Date;
            candidateId: string;
            messageId: string;
            responseType: string;
        }[];
    } & {
        id: string;
        type: import(".prisma/client").$Enums.MessageType;
        title: string;
        body: string;
        status: import(".prisma/client").$Enums.MessageStatus;
        sentAt: Date | null;
        readAt: Date | null;
        respondedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        candidateId: string;
        applicationId: string | null;
        parentMessageId: string | null;
    })[]>;
    getUnreadCount(user: AuthUser): Promise<{
        unreadCount: number;
    }>;
    markAsRead(id: string, user: AuthUser): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.MessageType;
        title: string;
        body: string;
        status: import(".prisma/client").$Enums.MessageStatus;
        sentAt: Date | null;
        readAt: Date | null;
        respondedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        candidateId: string;
        applicationId: string | null;
        parentMessageId: string | null;
    }>;
    listForCompany(user: AuthUser, status?: string, candidateId?: string, search?: string, page?: string, limit?: string): import(".prisma/client").Prisma.PrismaPromise<({
        candidate: {
            id: string;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            city: string | null;
            country: string | null;
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
        application: ({
            job: {
                id: string;
                title: string;
                status: import(".prisma/client").$Enums.JobStatus;
                createdAt: Date;
                updatedAt: Date;
                companyId: string;
                city: string | null;
                country: string | null;
                categoryId: string | null;
                description: string | null;
                requirements: string[];
                benefits: string[];
                salaryMin: number | null;
                salaryMax: number | null;
                currency: string;
                employmentType: string | null;
                modality: string | null;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            updatedAt: Date;
            candidateId: string;
            jobId: string;
            appliedAt: Date;
        }) | null;
        responses: {
            id: string;
            body: string | null;
            createdAt: Date;
            candidateId: string;
            messageId: string;
            responseType: string;
        }[];
    } & {
        id: string;
        type: import(".prisma/client").$Enums.MessageType;
        title: string;
        body: string;
        status: import(".prisma/client").$Enums.MessageStatus;
        sentAt: Date | null;
        readAt: Date | null;
        respondedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        candidateId: string;
        applicationId: string | null;
        parentMessageId: string | null;
    })[]>;
    getById(id: string, user: AuthUser): Promise<{
        company: {
            id: string;
            status: import(".prisma/client").$Enums.CompanyStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            legalName: string | null;
            email: string | null;
            phone: string | null;
            city: string | null;
            country: string | null;
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
            phone: string | null;
            city: string | null;
            country: string | null;
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
        application: {
            id: string;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            updatedAt: Date;
            candidateId: string;
            jobId: string;
            appliedAt: Date;
        } | null;
        responses: {
            id: string;
            body: string | null;
            createdAt: Date;
            candidateId: string;
            messageId: string;
            responseType: string;
        }[];
    } & {
        id: string;
        type: import(".prisma/client").$Enums.MessageType;
        title: string;
        body: string;
        status: import(".prisma/client").$Enums.MessageStatus;
        sentAt: Date | null;
        readAt: Date | null;
        respondedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        candidateId: string;
        applicationId: string | null;
        parentMessageId: string | null;
    }>;
    respond(id: string, dto: RespondMessageDto, user: AuthUser): Promise<{
        messageId: string;
        response: {
            id: string;
            body: string | null;
            createdAt: Date;
            candidateId: string;
            messageId: string;
            responseType: string;
        };
    }>;
    updateStatus(id: string, dto: UpdateMessageStatusDto, user: AuthUser): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.MessageType;
        title: string;
        body: string;
        status: import(".prisma/client").$Enums.MessageStatus;
        sentAt: Date | null;
        readAt: Date | null;
        respondedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        candidateId: string;
        applicationId: string | null;
        parentMessageId: string | null;
    }>;
    resend(id: string, user: AuthUser): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.MessageType;
        title: string;
        body: string;
        status: import(".prisma/client").$Enums.MessageStatus;
        sentAt: Date | null;
        readAt: Date | null;
        respondedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        candidateId: string;
        applicationId: string | null;
        parentMessageId: string | null;
    }>;
    getTemplates(user: AuthUser): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        type: import(".prisma/client").$Enums.MessageType;
        body: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string | null;
        name: string;
        subject: string | null;
        isActive: boolean;
    }[]>;
    createTemplate(user: AuthUser, data: {
        name: string;
        subject: string;
        body: string;
        type?: string;
    }): import(".prisma/client").Prisma.Prisma__MessageTemplateClient<{
        id: string;
        type: import(".prisma/client").$Enums.MessageType;
        body: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string | null;
        name: string;
        subject: string | null;
        isActive: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateTemplate(id: string, user: AuthUser, data: {
        name?: string;
        subject?: string;
        body?: string;
    }): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.MessageType;
        body: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string | null;
        name: string;
        subject: string | null;
        isActive: boolean;
    }>;
    deleteTemplate(id: string, user: AuthUser): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.MessageType;
        body: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string | null;
        name: string;
        subject: string | null;
        isActive: boolean;
    }>;
}
