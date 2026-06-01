import type { AuthUser } from '../common/types/auth-user';
import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getCompanyDashboard(user: AuthUser): Promise<{
        kpis: {
            activeJobs: {
                value: number;
                trend: number;
                period: string;
            };
            applications: {
                value: number;
                trend: number;
                period: string;
            };
            interviewsWeek: {
                value: number;
                trend: number;
                period: string;
            };
            messagesUnread: {
                value: number;
                trend: number;
                period: string;
            };
        };
        recentJobs: {
            applications: number;
            id: string;
            status: import(".prisma/client").$Enums.JobStatus;
            city: string | null;
            title: string;
            _count: {
                applications: number;
            };
        }[];
        upcomingInterviews: ({
            candidate: {
                id: string;
                fullName: string;
            };
            job: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.InterviewStatus;
            companyId: string;
            modality: string;
            jobId: string;
            candidateId: string;
            date: Date;
            location: string | null;
            meetingUrl: string | null;
            interviewerName: string | null;
            contactPhone: string | null;
            mapUrl: string | null;
            notesForCandidate: string | null;
            responsibleUserId: string | null;
            applicationId: string;
        })[];
        recentMessages: ({
            candidate: {
                id: string;
                fullName: string;
            };
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
        })[];
        company: {
            id: string | undefined;
            name: string | undefined;
        };
        plan: {
            name: string;
            jobsThisMonth: number;
            maxJobs: number;
        };
    }>;
    getAdminDashboard(): Promise<{
        kpis: {
            companies: {
                value: number;
                trend: number;
            };
            candidates: {
                value: number;
                trend: number;
            };
            activeJobs: {
                value: number;
            };
            applications: {
                value: number;
            };
            documentsPending: {
                value: number;
            };
        };
        recentActivity: {
            id: string;
            status: import(".prisma/client").$Enums.ApplicationStatus;
            candidate: {
                fullName: string;
            };
            job: {
                company: {
                    name: string;
                };
                title: string;
            };
            appliedAt: Date;
        }[];
        platformStatus: string;
    }>;
}
