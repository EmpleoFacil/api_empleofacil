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
exports.CompaniesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const create_company_dto_1 = require("./dto/create-company.dto");
const update_company_dto_1 = require("./dto/update-company.dto");
const companies_service_1 = require("./companies.service");
let CompaniesController = class CompaniesController {
    companiesService;
    constructor(companiesService) {
        this.companiesService = companiesService;
    }
    list(user) {
        return this.companiesService.list(user);
    }
    getPlanLimits(user) {
        return this.companiesService.getPlanLimits(user);
    }
    getMe(user) {
        return this.companiesService.getMe(user);
    }
    updateMe(user, data) {
        return this.companiesService.updateMe(user, data);
    }
    getUsers(user) {
        return this.companiesService.getUsers(user);
    }
    createUser(user, data) {
        return this.companiesService.createUser(user, data);
    }
    updateUser(user, userId, data) {
        return this.companiesService.updateUser(user, userId, data);
    }
    deleteUser(user, userId) {
        return this.companiesService.deleteUser(user, userId);
    }
    getCompanyPlan(user) {
        return this.companiesService.getCompanyPlan(user);
    }
    getPlans() {
        return this.companiesService.getPlans();
    }
    updatePlan(user, planId) {
        return this.companiesService.updatePlan(user, planId);
    }
    adminListCompanies(status, planId, search, page, limit) {
        return this.companiesService.adminListCompanies({ status, planId, search, page: page ? +page : 1, limit: limit ? +limit : 10 });
    }
    adminGetSummary() {
        return this.companiesService.adminGetSummary();
    }
    getById(id, user) {
        return this.companiesService.getById(id, user);
    }
    create(dto) {
        return this.companiesService.create(dto);
    }
    update(id, dto, user) {
        return this.companiesService.update(id, dto, user);
    }
    adminUpdateStatus(id, status) {
        return this.companiesService.adminUpdateStatus(id, status);
    }
    adminDeleteCompany(id) {
        return this.companiesService.adminDeleteCompany(id);
    }
    adminGetCompanyDetail(id) {
        return this.companiesService.adminGetCompanyDetail(id);
    }
    adminGetCompanyUsers(id) {
        return this.companiesService.adminGetCompanyUsers(id);
    }
    adminGetCompanyJobs(id, status, page, limit) {
        return this.companiesService.adminGetCompanyJobs(id, { status, page: page ? +page : 1, limit: limit ? +limit : 5 });
    }
    adminGetCompanyApplications(id, status, page, limit) {
        return this.companiesService.adminGetCompanyApplications(id, { status, page: page ? +page : 1, limit: limit ? +limit : 10 });
    }
    adminGetCompanyMetrics(id) {
        return this.companiesService.adminGetCompanyMetrics(id);
    }
    adminUpdateCompanyPlan(id, planId) {
        return this.companiesService.adminUpdateCompanyPlan(id, planId);
    }
    adminCreateCompanyUser(id, data) {
        return this.companiesService.adminCreateCompanyUser(id, data);
    }
    adminUpdateCompanyUser(companyId, userId, data) {
        return this.companiesService.adminUpdateCompanyUser(companyId, userId, data);
    }
    adminUpdateCompany(id, data) {
        return this.companiesService.adminUpdateCompany(id, data);
    }
};
exports.CompaniesController = CompaniesController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('me/plan-limits'),
    (0, roles_decorator_1.Roles)('company_admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "getPlanLimits", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, roles_decorator_1.Roles)('company_admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "getMe", null);
__decorate([
    (0, common_1.Patch)('me'),
    (0, roles_decorator_1.Roles)('company_admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Get)('me/users'),
    (0, roles_decorator_1.Roles)('company_admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)('me/users'),
    (0, roles_decorator_1.Roles)('company_admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "createUser", null);
__decorate([
    (0, common_1.Patch)('me/users/:userId'),
    (0, roles_decorator_1.Roles)('company_admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('me/users/:userId'),
    (0, roles_decorator_1.Roles)('company_admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('billing/company-plan'),
    (0, roles_decorator_1.Roles)('company_admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "getCompanyPlan", null);
__decorate([
    (0, common_1.Get)('plans'),
    (0, roles_decorator_1.Roles)('company_admin', 'super_admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "getPlans", null);
__decorate([
    (0, common_1.Patch)('me/plan'),
    (0, roles_decorator_1.Roles)('company_admin'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)('planId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "updatePlan", null);
__decorate([
    (0, common_1.Get)('admin/list'),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('planId')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "adminListCompanies", null);
__decorate([
    (0, common_1.Get)('admin/summary'),
    (0, roles_decorator_1.Roles)('super_admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "adminGetSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('super_admin', 'company_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_dto_1.CreateCompanyDto]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('super_admin', 'company_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_company_dto_1.UpdateCompanyDto, Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('admin/:id/status'),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "adminUpdateStatus", null);
__decorate([
    (0, common_1.Delete)('admin/:id'),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "adminDeleteCompany", null);
__decorate([
    (0, common_1.Get)('admin/:id'),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "adminGetCompanyDetail", null);
__decorate([
    (0, common_1.Get)('admin/:id/users'),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "adminGetCompanyUsers", null);
__decorate([
    (0, common_1.Get)('admin/:id/jobs'),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "adminGetCompanyJobs", null);
__decorate([
    (0, common_1.Get)('admin/:id/applications'),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "adminGetCompanyApplications", null);
__decorate([
    (0, common_1.Get)('admin/:id/metrics'),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "adminGetCompanyMetrics", null);
__decorate([
    (0, common_1.Patch)('admin/:id/plan'),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('planId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "adminUpdateCompanyPlan", null);
__decorate([
    (0, common_1.Post)('admin/:id/users'),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "adminCreateCompanyUser", null);
__decorate([
    (0, common_1.Patch)('admin/:companyId/users/:userId'),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "adminUpdateCompanyUser", null);
__decorate([
    (0, common_1.Patch)('admin/:id'),
    (0, roles_decorator_1.Roles)('super_admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CompaniesController.prototype, "adminUpdateCompany", null);
exports.CompaniesController = CompaniesController = __decorate([
    (0, swagger_1.ApiTags)('companies'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('companies'),
    __metadata("design:paramtypes", [companies_service_1.CompaniesService])
], CompaniesController);
//# sourceMappingURL=companies.controller.js.map