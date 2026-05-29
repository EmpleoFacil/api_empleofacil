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
exports.InterviewsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const create_interview_dto_1 = require("./dto/create-interview.dto");
const update_interview_status_dto_1 = require("./dto/update-interview-status.dto");
const reschedule_interview_dto_1 = require("./dto/reschedule-interview.dto");
const interviews_service_1 = require("./interviews.service");
let InterviewsController = class InterviewsController {
    interviewsService;
    constructor(interviewsService) {
        this.interviewsService = interviewsService;
    }
    create(user, dto) {
        return this.interviewsService.create(user, dto);
    }
    listForCandidate(user) {
        return this.interviewsService.listForCandidate(user);
    }
    getById(id, user) {
        return this.interviewsService.getById(id, user);
    }
    confirm(id, user) {
        return this.interviewsService.confirm(id, user);
    }
    requestReschedule(id, dto, user) {
        return this.interviewsService.requestReschedule(id, dto, user);
    }
    listForCompany(user) {
        return this.interviewsService.listForCompany(user);
    }
    updateStatus(id, dto, user) {
        return this.interviewsService.updateStatus(id, dto, user);
    }
    reschedule(id, dto, user) {
        return this.interviewsService.reschedule(id, dto, user);
    }
    getSummary(user) {
        return this.interviewsService.getSummary(user);
    }
    update(id, user, data) {
        return this.interviewsService.update(id, user, data);
    }
    sendReminder(id, user) {
        return this.interviewsService.sendReminder(id, user);
    }
    recordResult(id, user, data) {
        return this.interviewsService.recordResult(id, user, data);
    }
};
exports.InterviewsController = InterviewsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('company_admin', 'super_admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_interview_dto_1.CreateInterviewDto]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, roles_decorator_1.Roles)('candidate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "listForCandidate", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('candidate', 'company_admin', 'super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(':id/confirm'),
    (0, roles_decorator_1.Roles)('candidate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "confirm", null);
__decorate([
    (0, common_1.Patch)(':id/reschedule-request'),
    (0, roles_decorator_1.Roles)('candidate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reschedule_interview_dto_1.RescheduleInterviewDto, Object]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "requestReschedule", null);
__decorate([
    (0, common_1.Get)('company'),
    (0, roles_decorator_1.Roles)('company_admin', 'super_admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "listForCompany", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)('company_admin', 'super_admin', 'candidate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_interview_status_dto_1.UpdateInterviewStatusDto, Object]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/reschedule'),
    (0, roles_decorator_1.Roles)('company_admin', 'super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reschedule_interview_dto_1.RescheduleInterviewDto, Object]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "reschedule", null);
__decorate([
    (0, common_1.Get)('company/summary'),
    (0, roles_decorator_1.Roles)('company_admin', 'super_admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('company_admin', 'super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/reminder'),
    (0, roles_decorator_1.Roles)('company_admin', 'super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "sendReminder", null);
__decorate([
    (0, common_1.Post)(':id/result'),
    (0, roles_decorator_1.Roles)('company_admin', 'super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], InterviewsController.prototype, "recordResult", null);
exports.InterviewsController = InterviewsController = __decorate([
    (0, swagger_1.ApiTags)('interviews'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('interviews'),
    __metadata("design:paramtypes", [interviews_service_1.InterviewsService])
], InterviewsController);
//# sourceMappingURL=interviews.controller.js.map