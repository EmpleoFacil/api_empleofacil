import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../common/types/auth-user';
export declare class SearchService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    searchForCompany(user: AuthUser, query: string, type: string): Promise<{
        data: Record<string, unknown[]>;
        query: string;
    }>;
}
