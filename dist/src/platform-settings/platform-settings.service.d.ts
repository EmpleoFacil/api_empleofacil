import { PrismaService } from '../prisma/prisma.service';
import { UpdatePlatformSettingsDto } from './dto/update-platform-settings.dto';
export declare class PlatformSettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            settings: import("@prisma/client/runtime/library").JsonValue;
        };
    }>;
    updateSettings(dto: UpdatePlatformSettingsDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            settings: import("@prisma/client/runtime/library").JsonValue;
        };
    }>;
}
