import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../common/types/auth-user';
export declare class SavedJobsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByCandidate(user: AuthUser): Promise<{
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
            customCategory: string | null;
            title: string;
            description: string | null;
            requirements: string[];
            benefits: string[];
            salaryMin: number | null;
            salaryMax: number | null;
            employmentType: string | null;
            modality: string | null;
            expiresAt: Date | null;
            categoryId: string | null;
        })[];
    }>;
    save(user: AuthUser, jobId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    unsave(user: AuthUser, jobId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
