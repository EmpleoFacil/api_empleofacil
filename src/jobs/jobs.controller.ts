import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import type { AuthUser } from '../common/types/auth-user';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobsService } from './jobs.service';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('categories')
  getCategories() {
    return this.jobsService.getCategories();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('recommended')
  @Roles('candidate', 'company_admin', 'super_admin')
  getRecommended(
    @CurrentUser() user: AuthUser,
    @Query('category') categoryId?: string,
  ) {
    return this.jobsService.getRecommended(user, categoryId);
  }

  @Get('search')
  search(
    @Query('search') query?: string,
    @Query('city') city?: string,
    @Query('category') categoryId?: string,
    @Query('page') page?: string,
  ) {
    return this.jobsService.search(query, city, categoryId, page ? parseInt(page) : 1);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles('candidate', 'company_admin', 'super_admin')
  list(@CurrentUser() user: AuthUser) {
    return this.jobsService.list(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('company/summary')
  @Roles('company_admin')
  getCompanySummary(@CurrentUser() user: AuthUser) {
    return this.jobsService.getCompanySummary(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('company')
  @Roles('company_admin')
  getCompanyJobs(
    @CurrentUser() user: AuthUser,
    @Query('search') query?: string,
    @Query('city') city?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.jobsService.getCompanyJobs(user, query, city, status, page ? parseInt(page) : 1, limit ? parseInt(limit) : 10);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin')
  @Roles('super_admin')
  getAdminJobs(
    @Query('search') query?: string,
    @Query('companyId') companyId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.jobsService.getAdminJobs(query, companyId, status, page ? parseInt(page) : 1, limit ? parseInt(limit) : 10);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/status')
  @Roles('company_admin', 'super_admin')
  updateStatus(@Param('id') id: string, @CurrentUser() user: AuthUser, @Body('status') status: string) {
    return this.jobsService.updateStatus(id, user, status);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles('candidate', 'company_admin', 'super_admin')
  getById(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.jobsService.getById(id, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles('company_admin', 'super_admin')
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateJobDto) {
    return this.jobsService.create(user, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles('company_admin', 'super_admin')
  update(@Param('id') id: string, @CurrentUser() user: AuthUser, @Body() dto: UpdateJobDto) {
    return this.jobsService.update(id, user, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles('company_admin', 'super_admin')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.jobsService.remove(id, user);
  }
}
