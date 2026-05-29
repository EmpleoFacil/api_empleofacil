import { SavedJobsService } from './saved-jobs.service';
import { SaveJobDto } from './dto/save-job.dto';
import type { AuthUser } from '../common/types/auth-user';
export declare class SavedJobsController {
    private readonly savedJobsService;
    constructor(savedJobsService: SavedJobsService);
    findMySavedJobs(user: AuthUser): Promise<{
        items: ({
            company: {
                id: string;
                name: string;
                logoUrl: string | null;
            };
            category: {
                id: string;
                name: string;
                isActive: boolean;
                icon: string | null;
            } | null;
        } & {
            id: string;
            currency: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.JobStatus;
            city: string | null;
            country: string | null;
            companyId: string;
            title: string;
            description: string | null;
            requirements: string[];
            benefits: string[];
            salaryMin: number | null;
            salaryMax: number | null;
            employmentType: string | null;
            modality: string | null;
            categoryId: string | null;
        })[];
    }>;
    saveJob(user: AuthUser, dto: SaveJobDto): Promise<{
        success: boolean;
        message: string;
    }>;
    unsaveJob(user: AuthUser, jobId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
