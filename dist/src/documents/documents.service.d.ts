import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../common/types/auth-user';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { UpdateDocumentStatusDto } from './dto/update-document-status.dto';
export declare class DocumentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDocumentTypes(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        label: string;
        isRequired: boolean;
    }[]>;
    upload(user: AuthUser, dto: UploadDocumentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DocumentStatus;
        candidateId: string;
        type: string;
        fileUrl: string | null;
        uploadedAt: Date | null;
        reviewedAt: Date | null;
        reviewedBy: string | null;
    }>;
    listForCandidate(user: AuthUser): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DocumentStatus;
        candidateId: string;
        type: string;
        fileUrl: string | null;
        uploadedAt: Date | null;
        reviewedAt: Date | null;
        reviewedBy: string | null;
    }[]>;
    listPending(): import(".prisma/client").Prisma.PrismaPromise<({
        candidate: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            status: import(".prisma/client").$Enums.UserStatus;
            fullName: string;
            city: string | null;
            country: string | null;
            desiredJobType: string | null;
            availability: string | null;
            salaryExpectationMin: number | null;
            salaryExpectationMax: number | null;
            experienceLevel: string | null;
            educationLevel: string | null;
            profileCompletion: number;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DocumentStatus;
        candidateId: string;
        type: string;
        fileUrl: string | null;
        uploadedAt: Date | null;
        reviewedAt: Date | null;
        reviewedBy: string | null;
    })[]>;
    listByCandidateId(candidateId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DocumentStatus;
        candidateId: string;
        type: string;
        fileUrl: string | null;
        uploadedAt: Date | null;
        reviewedAt: Date | null;
        reviewedBy: string | null;
    }[]>;
    updateStatus(id: string, dto: UpdateDocumentStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DocumentStatus;
        candidateId: string;
        type: string;
        fileUrl: string | null;
        uploadedAt: Date | null;
        reviewedAt: Date | null;
        reviewedBy: string | null;
    }>;
}
