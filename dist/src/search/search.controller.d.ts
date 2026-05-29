import { SearchService } from './search.service';
import type { AuthUser } from '../common/types/auth-user';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    searchCompany(user: AuthUser, query: string, type?: string): Promise<{
        data: Record<string, unknown[]>;
        query: string;
    }>;
}
