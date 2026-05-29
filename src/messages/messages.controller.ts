import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import type { AuthUser } from '../common/types/auth-user';
import { CreateMessageDto } from './dto/create-message.dto';
import { RespondMessageDto } from './dto/respond-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
import { MessagesService } from './messages.service';

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @Roles('company_admin', 'super_admin')
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateMessageDto) {
    return this.messagesService.create(user, dto);
  }

  @Get('me')
  @Roles('candidate')
  listForCandidate(@CurrentUser() user: AuthUser) {
    return this.messagesService.listForCandidate(user);
  }

  @Get('me/unread-count')
  @Roles('candidate')
  getUnreadCount(@CurrentUser() user: AuthUser) {
    return this.messagesService.getUnreadCount(user);
  }

  @Patch(':id/read')
  @Roles('candidate')
  markAsRead(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.messagesService.markAsRead(id, user);
  }

  @Get('company')
  @Roles('company_admin', 'super_admin')
  listForCompany(@CurrentUser() user: AuthUser) {
    return this.messagesService.listForCompany(user);
  }

  @Get(':id')
  @Roles('candidate', 'company_admin', 'super_admin')
  getById(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.messagesService.getById(id, user);
  }

  @Post(':id/respond')
  @Roles('candidate')
  respond(
    @Param('id') id: string,
    @Body() dto: RespondMessageDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.messagesService.respond(id, dto, user);
  }

  @Patch(':id/status')
  @Roles('company_admin', 'super_admin')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateMessageStatusDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.messagesService.updateStatus(id, dto, user);
  }

  @Post(':id/resend')
  @Roles('company_admin', 'super_admin')
  resend(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.messagesService.resend(id, user);
  }

  @Get('templates')
  @Roles('company_admin', 'super_admin')
  getTemplates(@CurrentUser() user: AuthUser) {
    return this.messagesService.getTemplates(user);
  }

  @Post('templates')
  @Roles('company_admin', 'super_admin')
  createTemplate(@CurrentUser() user: AuthUser, @Body() data: { name: string; subject: string; body: string; type?: string }) {
    return this.messagesService.createTemplate(user, data);
  }

  @Patch('templates/:id')
  @Roles('company_admin', 'super_admin')
  updateTemplate(@Param('id') id: string, @CurrentUser() user: AuthUser, @Body() data: { name?: string; subject?: string; body?: string }) {
    return this.messagesService.updateTemplate(id, user, data);
  }

  @Delete('templates/:id')
  @Roles('company_admin', 'super_admin')
  deleteTemplate(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.messagesService.deleteTemplate(id, user);
  }
}
