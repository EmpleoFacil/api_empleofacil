import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import type { AuthUser } from '../common/types/auth-user';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { ApplicationsService } from './applications.service';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles('candidate')
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(user, dto);
  }

  @Get('me')
  @Roles('candidate')
  listForCandidate(@CurrentUser() user: AuthUser) {
    return this.applicationsService.listForCandidate(user);
  }

  @Get('me/summary')
  @Roles('candidate')
  getSummary(@CurrentUser() user: AuthUser) {
    return this.applicationsService.getSummary(user);
  }

  @Get('me/status-summary')
  @Roles('candidate')
  getStatusSummary(@CurrentUser() user: AuthUser) {
    return this.applicationsService.getStatusSummary(user);
  }

  @Get('job/:jobId/me')
  @Roles('candidate')
  getByJobForCandidate(@Param('jobId') jobId: string, @CurrentUser() user: AuthUser) {
    return this.applicationsService.getByJobForCandidate(jobId, user);
  }

  @Get('company/summary')
  @Roles('company_admin', 'super_admin')
  getSummaryForCompany(@CurrentUser() user: AuthUser) {
    return this.applicationsService.getSummaryForCompany(user);
  }

  @Get('company/pipeline')
  @Roles('company_admin', 'super_admin')
  getPipeline(@CurrentUser() user: AuthUser, @Query('jobId') jobId?: string) {
    return this.applicationsService.getPipeline(user, jobId);
  }

  @Get('company/export')
  @Roles('company_admin', 'super_admin')
  exportForCompany(@CurrentUser() user: AuthUser, @Query('jobId') jobId?: string) {
    return this.applicationsService.exportForCompany(user, jobId);
  }

  @Get('company')
  @Roles('company_admin', 'super_admin')
  listForCompany(
    @CurrentUser() user: AuthUser,
    @Query('search') search?: string,
    @Query('jobId') jobId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.applicationsService.listForCompanyPaginated(user, {
      search, jobId, status,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get(':id')
  @Roles('candidate', 'company_admin', 'super_admin')
  getById(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.applicationsService.getById(id, user);
  }

  @Patch(':id/status')
  @Roles('company_admin', 'super_admin')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.applicationsService.updateStatus(id, dto, user);
  }

  @Post(':id/notes')
  @Roles('company_admin', 'super_admin')
  addNote(
    @Param('id') id: string,
    @Body('content') content: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.applicationsService.addNote(id, user, content);
  }
}
