import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import type { AuthUser } from '../common/types/auth-user';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewStatusDto } from './dto/update-interview-status.dto';
import { RescheduleInterviewDto } from './dto/reschedule-interview.dto';
import { InterviewsService } from './interviews.service';

@ApiTags('interviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  // ========== Literal routes first ==========

  @Post()
  @Roles('company_admin', 'super_admin')
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateInterviewDto) {
    return this.interviewsService.create(user, dto);
  }

  @Get('me')
  @Roles('candidate')
  listForCandidate(@CurrentUser() user: AuthUser) {
    return this.interviewsService.listForCandidate(user);
  }

  @Get('company')
  @Roles('company_admin', 'super_admin')
  listForCompany(@CurrentUser() user: AuthUser) {
    return this.interviewsService.listForCompany(user);
  }

  @Get('company/upcoming')
  @Roles('company_admin', 'super_admin')
  getUpcoming(@CurrentUser() user: AuthUser, @Query('limit') limit?: string) {
    return this.interviewsService.getUpcoming(user, limit ? parseInt(limit) : 5);
  }

  @Get('company/summary')
  @Roles('company_admin', 'super_admin')
  getSummary(@CurrentUser() user: AuthUser) {
    return this.interviewsService.getSummary(user);
  }

  // ========== Param routes ==========

  @Get(':id')
  @Roles('candidate', 'company_admin', 'super_admin')
  getById(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.interviewsService.getById(id, user);
  }

  @Patch(':id/confirm')
  @Roles('candidate')
  confirm(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.interviewsService.confirm(id, user);
  }

  @Patch(':id/reschedule-request')
  @Roles('candidate')
  requestReschedule(
    @Param('id') id: string,
    @Body() dto: RescheduleInterviewDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.interviewsService.requestReschedule(id, dto, user);
  }

  @Patch(':id/status')
  @Roles('company_admin', 'super_admin', 'candidate')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateInterviewStatusDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.interviewsService.updateStatus(id, dto, user);
  }

  @Patch(':id/reschedule')
  @Roles('company_admin', 'super_admin')
  reschedule(
    @Param('id') id: string,
    @Body() dto: RescheduleInterviewDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.interviewsService.reschedule(id, dto, user);
  }

  @Patch(':id')
  @Roles('company_admin', 'super_admin')
  update(@Param('id') id: string, @CurrentUser() user: AuthUser, @Body() data: { date?: string; modality?: string; location?: string; meetingUrl?: string; notesForCandidate?: string }) {
    return this.interviewsService.update(id, user, data);
  }

  @Post(':id/reminder')
  @Roles('company_admin', 'super_admin')
  sendReminder(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.interviewsService.sendReminder(id, user);
  }

  @Post(':id/result')
  @Roles('company_admin', 'super_admin')
  recordResult(@Param('id') id: string, @CurrentUser() user: AuthUser, @Body() data: { result: string; notes?: string; moveApplicationStatus?: string }) {
    return this.interviewsService.recordResult(id, user, data);
  }
}
