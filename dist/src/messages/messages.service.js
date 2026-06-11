"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const text_moderation_1 = require("../common/utils/text-moderation");
const messages_gateway_1 = require("./messages.gateway");
let MessagesService = class MessagesService {
    prisma;
    messagesGateway;
    constructor(prisma, messagesGateway) {
        this.prisma = prisma;
        this.messagesGateway = messagesGateway;
    }
    async create(user, dto) {
        (0, text_moderation_1.assertNoOffensiveContent)([
            { label: 'asunto', value: dto.title },
            { label: 'mensaje', value: dto.body },
        ]);
        const companyId = user.role === 'super_admin' ? dto.companyId : user.companyId;
        if (!companyId) {
            throw new common_1.ForbiddenException('CompanyId requerido.');
        }
        const message = await this.prisma.message.create({
            data: {
                companyId,
                candidateId: dto.candidateId,
                applicationId: dto.applicationId,
                type: dto.type,
                title: dto.title,
                body: dto.body,
                status: 'sent',
                sentAt: new Date(),
            },
        });
        this.messagesGateway.emitMessageCreated(message);
        return message;
    }
    listForCandidate(user, filter) {
        if (!user.candidateId) {
            throw new common_1.ForbiddenException('Usuario no es candidato.');
        }
        const where = {
            candidateId: user.candidateId,
        };
        if (filter == 'important') {
            where.type = {
                in: ['interview_invitation', 'document_request'],
            };
        }
        if (filter == 'unread') {
            where.status = {
                in: ['sent', 'unread'],
            };
        }
        return this.prisma.message.findMany({
            where,
            include: { company: true, application: true, responses: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getUnreadCount(user) {
        if (!user.candidateId) {
            throw new common_1.ForbiddenException('Usuario no es candidato.');
        }
        const count = await this.prisma.message.count({
            where: {
                candidateId: user.candidateId,
                status: { in: ['sent', 'unread'] },
            },
        });
        return { unreadCount: count };
    }
    async markAsRead(id, user) {
        const message = await this.prisma.message.findUnique({ where: { id } });
        if (!message) {
            throw new common_1.NotFoundException('Mensaje no encontrado.');
        }
        if (user.role === 'candidate' && user.candidateId !== message.candidateId) {
            throw new common_1.ForbiddenException('No tienes acceso a este mensaje.');
        }
        const updated = await this.prisma.message.update({
            where: { id },
            data: { status: 'read', readAt: new Date() },
        });
        this.messagesGateway.emitMessageUpdated(updated);
        return updated;
    }
    listForCompany(user) {
        if (user.role === 'super_admin') {
            return this.prisma.message.findMany({
                include: { candidate: true, application: true, responses: true },
                orderBy: { createdAt: 'desc' },
            });
        }
        if (!user.companyId) {
            return [];
        }
        return this.prisma.message.findMany({
            where: { companyId: user.companyId },
            include: { candidate: true, application: true, responses: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getById(id, user) {
        const message = await this.prisma.message.findUnique({
            where: { id },
            include: {
                company: true,
                candidate: true,
                application: true,
                responses: true,
            },
        });
        if (!message) {
            throw new common_1.NotFoundException('Mensaje no encontrado.');
        }
        if (user.role === 'candidate' && user.candidateId !== message.candidateId) {
            throw new common_1.ForbiddenException('No tienes acceso a este mensaje.');
        }
        if (user.role === 'company_admin' && user.companyId !== message.companyId) {
            throw new common_1.ForbiddenException('No tienes acceso a este mensaje.');
        }
        return message;
    }
    async respond(id, dto, user) {
        (0, text_moderation_1.assertNoOffensiveContent)([{ label: 'respuesta', value: dto.body }]);
        if (!user.candidateId) {
            throw new common_1.ForbiddenException('Usuario no es candidato.');
        }
        const message = await this.prisma.message.findUnique({ where: { id } });
        if (!message) {
            throw new common_1.NotFoundException('Mensaje no encontrado.');
        }
        if (message.candidateId !== user.candidateId) {
            throw new common_1.ForbiddenException('No tienes acceso a este mensaje.');
        }
        const response = await this.prisma.messageResponse.create({
            data: {
                messageId: message.id,
                candidateId: user.candidateId,
                responseType: dto.responseType,
                body: dto.body,
            },
        });
        const updated = await this.prisma.message.update({
            where: { id: message.id },
            data: { status: 'responded', respondedAt: new Date() },
        });
        this.messagesGateway.emitMessageResponded({
            ...updated,
            response,
        });
        return { messageId: message.id, response };
    }
    async updateStatus(id, dto, user) {
        const message = await this.prisma.message.findUnique({ where: { id } });
        if (!message) {
            throw new common_1.NotFoundException('Mensaje no encontrado.');
        }
        if (user.role === 'company_admin' && user.companyId !== message.companyId) {
            throw new common_1.ForbiddenException('No tienes acceso a este mensaje.');
        }
        const updated = await this.prisma.message.update({
            where: { id },
            data: { status: dto.status },
        });
        this.messagesGateway.emitMessageUpdated(updated);
        return updated;
    }
    listForCompanyPaginated(user, params) {
        const { status, candidateId, search, page = 1, limit = 20 } = params;
        const where = {};
        if (user.role === 'company_admin' && user.companyId) {
            where.companyId = user.companyId;
        }
        if (status && status !== 'all')
            where.status = status;
        if (candidateId)
            where.candidateId = candidateId;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { candidate: { fullName: { contains: search, mode: 'insensitive' } } },
            ];
        }
        return this.prisma.message.findMany({
            where,
            include: {
                candidate: true,
                application: { include: { job: true } },
                responses: true,
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });
    }
    async resend(id, user) {
        const message = await this.prisma.message.findUnique({ where: { id } });
        if (!message) {
            throw new common_1.NotFoundException('Mensaje no encontrado.');
        }
        if (user.role === 'company_admin' && user.companyId !== message.companyId) {
            throw new common_1.ForbiddenException('No tienes acceso a este mensaje.');
        }
        const updated = await this.prisma.message.update({
            where: { id },
            data: { status: 'sent', sentAt: new Date() },
        });
        this.messagesGateway.emitMessageUpdated(updated);
        return updated;
    }
    getTemplates(user) {
        const where = {};
        if (user.role === 'company_admin' && user.companyId) {
            where.OR = [{ companyId: user.companyId }, { companyId: null }];
        }
        return this.prisma.messageTemplate.findMany({
            where,
            orderBy: { name: 'asc' },
        });
    }
    createTemplate(user, data) {
        (0, text_moderation_1.assertNoOffensiveContent)([
            { label: 'nombre de plantilla', value: data.name },
            { label: 'asunto de plantilla', value: data.subject },
            { label: 'contenido de plantilla', value: data.body },
        ]);
        return this.prisma.messageTemplate.create({
            data: {
                name: data.name,
                subject: data.subject,
                body: data.body,
                type: (data.type ?? 'general_message'),
                companyId: user.companyId,
            },
        });
    }
    async updateTemplate(id, user, data) {
        (0, text_moderation_1.assertNoOffensiveContent)([
            { label: 'nombre de plantilla', value: data.name },
            { label: 'asunto de plantilla', value: data.subject },
            { label: 'contenido de plantilla', value: data.body },
        ]);
        const template = await this.prisma.messageTemplate.findUnique({
            where: { id },
        });
        if (!template)
            throw new common_1.NotFoundException('Plantilla no encontrada.');
        if (user.role === 'company_admin' &&
            template.companyId !== user.companyId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta plantilla.');
        }
        return this.prisma.messageTemplate.update({ where: { id }, data });
    }
    async deleteTemplate(id, user) {
        const template = await this.prisma.messageTemplate.findUnique({
            where: { id },
        });
        if (!template)
            throw new common_1.NotFoundException('Plantilla no encontrada.');
        if (user.role === 'company_admin' &&
            template.companyId !== user.companyId) {
            throw new common_1.ForbiddenException('No tienes acceso a esta plantilla.');
        }
        return this.prisma.messageTemplate.delete({ where: { id } });
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        messages_gateway_1.MessagesGateway])
], MessagesService);
//# sourceMappingURL=messages.service.js.map