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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const create_message_dto_1 = require("./dto/create-message.dto");
const respond_message_dto_1 = require("./dto/respond-message.dto");
const update_message_status_dto_1 = require("./dto/update-message-status.dto");
const messages_service_1 = require("./messages.service");
let MessagesController = class MessagesController {
    messagesService;
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    create(user, dto) {
        return this.messagesService.create(user, dto);
    }
    listForCandidate(user) {
        return this.messagesService.listForCandidate(user);
    }
    getUnreadCount(user) {
        return this.messagesService.getUnreadCount(user);
    }
    markAsRead(id, user) {
        return this.messagesService.markAsRead(id, user);
    }
    listForCompany(user, status, candidateId, search, page, limit) {
        return this.messagesService.listForCompanyPaginated(user, {
            status,
            candidateId,
            search,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
        });
    }
    getById(id, user) {
        return this.messagesService.getById(id, user);
    }
    respond(id, dto, user) {
        return this.messagesService.respond(id, dto, user);
    }
    updateStatus(id, dto, user) {
        return this.messagesService.updateStatus(id, dto, user);
    }
    resend(id, user) {
        return this.messagesService.resend(id, user);
    }
    getTemplates(user) {
        return this.messagesService.getTemplates(user);
    }
    createTemplate(user, data) {
        return this.messagesService.createTemplate(user, data);
    }
    updateTemplate(id, user, data) {
        return this.messagesService.updateTemplate(id, user, data);
    }
    deleteTemplate(id, user) {
        return this.messagesService.deleteTemplate(id, user);
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('company_admin', 'super_admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, roles_decorator_1.Roles)('candidate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "listForCandidate", null);
__decorate([
    (0, common_1.Get)('me/unread-count'),
    (0, roles_decorator_1.Roles)('candidate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, roles_decorator_1.Roles)('candidate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Get)('company'),
    (0, roles_decorator_1.Roles)('company_admin', 'super_admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('candidateId')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "listForCompany", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('candidate', 'company_admin', 'super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(':id/respond'),
    (0, roles_decorator_1.Roles)('candidate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, respond_message_dto_1.RespondMessageDto, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "respond", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)('company_admin', 'super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_message_status_dto_1.UpdateMessageStatusDto, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/resend'),
    (0, roles_decorator_1.Roles)('company_admin', 'super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "resend", null);
__decorate([
    (0, common_1.Get)('templates'),
    (0, roles_decorator_1.Roles)('company_admin', 'super_admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "getTemplates", null);
__decorate([
    (0, common_1.Post)('templates'),
    (0, roles_decorator_1.Roles)('company_admin', 'super_admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Patch)('templates/:id'),
    (0, roles_decorator_1.Roles)('company_admin', 'super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Delete)('templates/:id'),
    (0, roles_decorator_1.Roles)('company_admin', 'super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "deleteTemplate", null);
exports.MessagesController = MessagesController = __decorate([
    (0, swagger_1.ApiTags)('messages'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map