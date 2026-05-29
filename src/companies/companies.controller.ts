import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import type { AuthUser } from '../common/types/auth-user';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompaniesService } from './companies.service';

@ApiTags('companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @Roles('super_admin')
  list(@CurrentUser() user: AuthUser) {
    return this.companiesService.list(user);
  }

  @Get('me/plan-limits')
  @Roles('company_admin')
  getPlanLimits(@CurrentUser() user: AuthUser) {
    return this.companiesService.getPlanLimits(user);
  }

  @Get(':id')
  @Roles('super_admin', 'company_admin')
  getById(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.companiesService.getById(id, user);
  }

  @Post()
  @Roles('super_admin')
  create(@Body() dto: CreateCompanyDto) {
    return this.companiesService.create(dto);
  }

  @Patch(':id')
  @Roles('super_admin', 'company_admin')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.companiesService.update(id, dto, user);
  }

  @Get('me')
  @Roles('company_admin')
  getMe(@CurrentUser() user: AuthUser) {
    return this.companiesService.getMe(user);
  }

  @Patch('me')
  @Roles('company_admin')
  updateMe(@CurrentUser() user: AuthUser, @Body() data: { name?: string; email?: string; phone?: string; city?: string; address?: string; website?: string; logo?: string }) {
    return this.companiesService.updateMe(user, data);
  }

  @Get('me/users')
  @Roles('company_admin')
  getUsers(@CurrentUser() user: AuthUser) {
    return this.companiesService.getUsers(user);
  }

  @Post('me/users')
  @Roles('company_admin')
  createUser(@CurrentUser() user: AuthUser, @Body() data: { email: string; name: string; role: string; password: string }) {
    return this.companiesService.createUser(user, data);
  }

  @Patch('me/users/:userId')
  @Roles('company_admin')
  updateUser(@CurrentUser() user: AuthUser, @Param('userId') userId: string, @Body() data: { name?: string; role?: string; status?: string }) {
    return this.companiesService.updateUser(user, userId, data);
  }

  @Delete('me/users/:userId')
  @Roles('company_admin')
  deleteUser(@CurrentUser() user: AuthUser, @Param('userId') userId: string) {
    return this.companiesService.deleteUser(user, userId);
  }

  @Get('billing/company-plan')
  @Roles('company_admin')
  getCompanyPlan(@CurrentUser() user: AuthUser) {
    return this.companiesService.getCompanyPlan(user);
  }

  @Get('plans')
  @Roles('company_admin', 'super_admin')
  getPlans() {
    return this.companiesService.getPlans();
  }

  @Patch('me/plan')
  @Roles('company_admin')
  updatePlan(@CurrentUser() user: AuthUser, @Body('planId') planId: string) {
    return this.companiesService.updatePlan(user, planId);
  }

  // ========== SA-04: Admin Company Management ==========

  @Get('admin/list')
  @Roles('super_admin')
  adminListCompanies(
    @Query('status') status?: string,
    @Query('planId') planId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.companiesService.adminListCompanies({ status, planId, search, page: page ? +page : 1, limit: limit ? +limit : 10 });
  }

  @Get('admin/summary')
  @Roles('super_admin')
  adminGetSummary() {
    return this.companiesService.adminGetSummary();
  }

  @Patch('admin/:id/status')
  @Roles('super_admin')
  adminUpdateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.companiesService.adminUpdateStatus(id, status);
  }

  @Delete('admin/:id')
  @Roles('super_admin')
  adminDeleteCompany(@Param('id') id: string) {
    return this.companiesService.adminDeleteCompany(id);
  }

  // ========== SA-05: Company Detail for Admin ==========

  @Get('admin/:id')
  @Roles('super_admin')
  adminGetCompanyDetail(@Param('id') id: string) {
    return this.companiesService.adminGetCompanyDetail(id);
  }

  @Get('admin/:id/users')
  @Roles('super_admin')
  adminGetCompanyUsers(@Param('id') id: string) {
    return this.companiesService.adminGetCompanyUsers(id);
  }

  @Get('admin/:id/jobs')
  @Roles('super_admin')
  adminGetCompanyJobs(@Param('id') id: string, @Query('status') status?: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.companiesService.adminGetCompanyJobs(id, { status, page: page ? +page : 1, limit: limit ? +limit : 5 });
  }

  @Get('admin/:id/applications')
  @Roles('super_admin')
  adminGetCompanyApplications(@Param('id') id: string, @Query('status') status?: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.companiesService.adminGetCompanyApplications(id, { status, page: page ? +page : 1, limit: limit ? +limit : 10 });
  }

  @Get('admin/:id/metrics')
  @Roles('super_admin')
  adminGetCompanyMetrics(@Param('id') id: string) {
    return this.companiesService.adminGetCompanyMetrics(id);
  }

  @Patch('admin/:id/plan')
  @Roles('super_admin')
  adminUpdateCompanyPlan(@Param('id') id: string, @Body('planId') planId: string) {
    return this.companiesService.adminUpdateCompanyPlan(id, planId);
  }

  @Post('admin/:id/users')
  @Roles('super_admin')
  adminCreateCompanyUser(@Param('id') id: string, @Body() data: { email: string; role: string; password: string }) {
    return this.companiesService.adminCreateCompanyUser(id, data);
  }

  @Patch('admin/:companyId/users/:userId')
  @Roles('super_admin')
  adminUpdateCompanyUser(@Param('companyId') companyId: string, @Param('userId') userId: string, @Body() data: { role?: string; status?: string }) {
    return this.companiesService.adminUpdateCompanyUser(companyId, userId, data);
  }

  @Patch('admin/:id')
  @Roles('super_admin')
  adminUpdateCompany(@Param('id') id: string, @Body() data: { name?: string; email?: string; phone?: string; city?: string; address?: string; website?: string; planId?: string }) {
    return this.companiesService.adminUpdateCompany(id, data);
  }
}
