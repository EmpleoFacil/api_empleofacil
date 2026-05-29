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
exports.SavedJobsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const saved_jobs_service_1 = require("./saved-jobs.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const save_job_dto_1 = require("./dto/save-job.dto");
let SavedJobsController = class SavedJobsController {
    savedJobsService;
    constructor(savedJobsService) {
        this.savedJobsService = savedJobsService;
    }
    findMySavedJobs(user) {
        return this.savedJobsService.findByCandidate(user);
    }
    saveJob(user, dto) {
        return this.savedJobsService.save(user, dto.jobId);
    }
    unsaveJob(user, jobId) {
        return this.savedJobsService.unsave(user, jobId);
    }
};
exports.SavedJobsController = SavedJobsController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Vacantes guardadas del candidato' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SavedJobsController.prototype, "findMySavedJobs", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Guardar vacante' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, save_job_dto_1.SaveJobDto]),
    __metadata("design:returntype", void 0)
], SavedJobsController.prototype, "saveJob", null);
__decorate([
    (0, common_1.Delete)(':jobId'),
    (0, swagger_1.ApiOperation)({ summary: 'Quitar vacante guardada' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SavedJobsController.prototype, "unsaveJob", null);
exports.SavedJobsController = SavedJobsController = __decorate([
    (0, swagger_1.ApiTags)('Saved Jobs'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('candidate'),
    (0, common_1.Controller)('saved-jobs'),
    __metadata("design:paramtypes", [saved_jobs_service_1.SavedJobsService])
], SavedJobsController);
//# sourceMappingURL=saved-jobs.controller.js.map