"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const candidates_module_1 = require("./candidates/candidates.module");
const companies_module_1 = require("./companies/companies.module");
const jobs_module_1 = require("./jobs/jobs.module");
const applications_module_1 = require("./applications/applications.module");
const documents_module_1 = require("./documents/documents.module");
const interviews_module_1 = require("./interviews/interviews.module");
const messages_module_1 = require("./messages/messages.module");
const message_templates_module_1 = require("./message-templates/message-templates.module");
const plans_module_1 = require("./plans/plans.module");
const billing_module_1 = require("./billing/billing.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const saved_jobs_module_1 = require("./saved-jobs/saved-jobs.module");
const platform_settings_module_1 = require("./platform-settings/platform-settings.module");
const search_module_1 = require("./search/search.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            candidates_module_1.CandidatesModule,
            companies_module_1.CompaniesModule,
            jobs_module_1.JobsModule,
            applications_module_1.ApplicationsModule,
            documents_module_1.DocumentsModule,
            interviews_module_1.InterviewsModule,
            messages_module_1.MessagesModule,
            message_templates_module_1.MessageTemplatesModule,
            plans_module_1.PlansModule,
            billing_module_1.BillingModule,
            dashboard_module_1.DashboardModule,
            saved_jobs_module_1.SavedJobsModule,
            platform_settings_module_1.PlatformSettingsModule,
            search_module_1.SearchModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map