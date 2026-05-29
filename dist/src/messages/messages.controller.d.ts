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
    }>;
    listForCandidate(user: AuthUser): import(".prisma/client").Prisma.PrismaPromise<({
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
        application: {
            id: string;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            appliedAt: Date;
            jobId: string;
            candidateId: string;
        } | null;
        responses: {
            id: string;
            createdAt: Date;
            candidateId: string;
            body: string | null;
            responseType: string;
            messageId: string;
        }[];
    } & {
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
    })[]>;
    getUnreadCount(user: AuthUser): Promise<{
        unreadCount: number;
    }>;
    markAsRead(id: string, user: AuthUser): Promise<{
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
        application: {
            id: string;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            appliedAt: Date;
            jobId: string;
            candidateId: string;
        } | null;
        responses: {
            id: string;
            createdAt: Date;
            candidateId: string;
            body: string | null;
            responseType: string;
            messageId: string;
        }[];
    } & {
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
        application: {
            id: string;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            appliedAt: Date;
            jobId: string;
            candidateId: string;
        } | null;
        responses: {
            id: string;
            createdAt: Date;
            candidateId: string;
            body: string | null;
            responseType: string;
            messageId: string;
        }[];
    } & {
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
    }>;
    respond(id: string, dto: RespondMessageDto, user: AuthUser): Promise<{
        messageId: string;
        response: {
            id: string;
            createdAt: Date;
            candidateId: string;
            body: string | null;
            responseType: string;
            messageId: string;
        };
    }>;
    updateStatus(id: string, dto: UpdateMessageStatusDto, user: AuthUser): Promise<{
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
    }>;
    resend(id: string, user: AuthUser): Promise<{
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
    }>;
    getTemplates(user: AuthUser): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        companyId: string | null;
        type: import(".prisma/client").$Enums.MessageType;
        body: string;
        subject: string | null;
    }[]>;
    createTemplate(user: AuthUser, data: {
        name: string;
        subject: string;
        body: string;
        type?: string;
    }): import(".prisma/client").Prisma.Prisma__MessageTemplateClient<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        companyId: string | null;
        type: import(".prisma/client").$Enums.MessageType;
        body: string;
        subject: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateTemplate(id: string, user: AuthUser, data: {
        name?: string;
        subject?: string;
        body?: string;
    }): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        companyId: string | null;
        type: import(".prisma/client").$Enums.MessageType;
        body: string;
        subject: string | null;
    }>;
    deleteTemplate(id: string, user: AuthUser): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        companyId: string | null;
        type: import(".prisma/client").$Enums.MessageType;
        body: string;
        subject: string | null;
    }>;
}
