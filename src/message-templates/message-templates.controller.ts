import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MessageTemplatesService } from './message-templates.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateMessageTemplateDto } from './dto/create-message-template.dto';
import { UpdateMessageTemplateDto } from './dto/update-message-template.dto';
import type { AuthUser } from '../common/types/auth-user';

@ApiTags('Message Templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('message-templates')
export class MessageTemplatesController {
  constructor(private readonly service: MessageTemplatesService) {}

  @Get()
  @Roles('company_admin', 'company_recruiter', 'super_admin')
  @ApiOperation({ summary: 'Listar plantillas de mensajes' })
  findAll(@CurrentUser() user: AuthUser) {
    return this.service.findAll(user);
  }

  @Post()
  @Roles('company_admin', 'super_admin')
  @ApiOperation({ summary: 'Crear plantilla de mensaje' })
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateMessageTemplateDto) {
    return this.service.create(user, dto);
  }

  @Patch(':id')
  @Roles('company_admin', 'super_admin')
  @ApiOperation({ summary: 'Actualizar plantilla de mensaje' })
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateMessageTemplateDto,
  ) {
    return this.service.update(user, id, dto);
  }
}
