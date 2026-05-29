import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePlatformSettingsDto } from './dto/update-platform-settings.dto';

@Injectable()
export class PlatformSettingsService {
  constructor(private readonly prisma: PrismaService) {}

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

  async updateSettings(dto: UpdatePlatformSettingsDto) {
    const current = await this.prisma.platformSettings.findUnique({
      where: { id: 'global' },
    });

    const currentSettings = (current?.settings as Record<string, unknown>) ?? {};
    const newSettings = {
      ...currentSettings,
      ...dto.settings,
    };

    const updated = await this.prisma.platformSettings.upsert({
      where: { id: 'global' },
      update: { settings: newSettings as any },
      create: { id: 'global', settings: newSettings as any },
    });

    return {
      success: true,
      message: 'Configuración actualizada correctamente',
      data: updated,
    };
  }
}
