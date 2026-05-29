import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PlatformSettingsService } from './platform-settings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdatePlatformSettingsDto } from './dto/update-platform-settings.dto';

@ApiTags('Platform Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('platform-settings')
export class PlatformSettingsController {
  constructor(private readonly service: PlatformSettingsService) {}

  @Get()
  @Roles('super_admin')
  @ApiOperation({ summary: 'Obtener configuración de plataforma' })
  getSettings() {
    return this.service.getSettings();
  }

  @Patch()
  @Roles('super_admin')
  @ApiOperation({ summary: 'Actualizar configuración de plataforma' })
  updateSettings(@Body() dto: UpdatePlatformSettingsDto) {
    return this.service.updateSettings(dto);
  }
}
