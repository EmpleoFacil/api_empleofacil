import { PlatformSettingsService } from './platform-settings.service';
import { UpdatePlatformSettingsDto } from './dto/update-platform-settings.dto';
export declare class PlatformSettingsController {
    private readonly service;
    constructor(service: PlatformSettingsService);
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
