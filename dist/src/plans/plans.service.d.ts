import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
export declare class PlansService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        items: {
            id: string;
            name: string;
            price: number;
            currency: string;
            publicationLimit: number | null;
            userLimit: number | null;
            visibleCandidatesLimit: number | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    create(dto: CreatePlanDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            name: string;
            price: number;
            currency: string;
            publicationLimit: number | null;
            userLimit: number | null;
            visibleCandidatesLimit: number | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    update(id: string, dto: UpdatePlanDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            name: string;
            price: number;
            currency: string;
            publicationLimit: number | null;
            userLimit: number | null;
            visibleCandidatesLimit: number | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
