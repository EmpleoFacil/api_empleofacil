"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformSettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PlatformSettingsService = class PlatformSettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings() {
        let settings = await this.prisma.platformSettings.findUnique({
            where: { id: 'global' },
        });
        if (!settings) {
            settings = await this.prisma.platformSettings.create({
                data: {
                    id: 'global',
                    settings: {
                        planLimits: {},
                        visibility: {},
                        billing: {},
                    },
                },
            });
        }
        return { data: settings };
    }
    async updateSettings(dto) {
        const current = await this.prisma.platformSettings.findUnique({
            where: { id: 'global' },
        });
        const currentSettings = current?.settings ?? {};
        const newSettings = {
            ...currentSettings,
            ...dto.settings,
        };
        const updated = await this.prisma.platformSettings.upsert({
            where: { id: 'global' },
            update: { settings: newSettings },
            create: { id: 'global', settings: newSettings },
        });
        return {
            success: true,
            message: 'Configuración actualizada correctamente',
            data: updated,
        };
    }
};
exports.PlatformSettingsService = PlatformSettingsService;
exports.PlatformSettingsService = PlatformSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlatformSettingsService);
//# sourceMappingURL=platform-settings.service.js.map