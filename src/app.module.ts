import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CandidatesModule } from './candidates/candidates.module';
import { CompaniesModule } from './companies/companies.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { DocumentsModule } from './documents/documents.module';
import { InterviewsModule } from './interviews/interviews.module';
import { MessagesModule } from './messages/messages.module';
import { MessageTemplatesModule } from './message-templates/message-templates.module';
import { PlansModule } from './plans/plans.module';
import { BillingModule } from './billing/billing.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SavedJobsModule } from './saved-jobs/saved-jobs.module';
import { PlatformSettingsModule } from './platform-settings/platform-settings.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CandidatesModule,
    CompaniesModule,
    JobsModule,
    ApplicationsModule,
    DocumentsModule,
    InterviewsModule,
    MessagesModule,
    MessageTemplatesModule,
    PlansModule,
    BillingModule,
    DashboardModule,
    SavedJobsModule,
    PlatformSettingsModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
