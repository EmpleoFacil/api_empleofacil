import { MessageTemplatesService } from './message-templates.service';
import { CreateMessageTemplateDto } from './dto/create-message-template.dto';
import { UpdateMessageTemplateDto } from './dto/update-message-template.dto';
import type { AuthUser } from '../common/types/auth-user';
export declare class MessageTemplatesController {
    private readonly service;
    constructor(service: MessageTemplatesService);
    findAll(user: AuthUser): Promise<{
        items: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            companyId: string | null;
            type: import(".prisma/client").$Enums.MessageType;
            body: string;
            subject: string | null;
        }[];
    }>;
    create(user: AuthUser, dto: CreateMessageTemplateDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            companyId: string | null;
            type: import(".prisma/client").$Enums.MessageType;
            body: string;
            subject: string | null;
        };
    }>;
    update(user: AuthUser, id: string, dto: UpdateMessageTemplateDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            companyId: string | null;
            type: import(".prisma/client").$Enums.MessageType;
            body: string;
            subject: string | null;
        };
    }>;
}
