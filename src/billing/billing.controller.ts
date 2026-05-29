import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ManualPaymentDto } from './dto/manual-payment.dto';
import type { AuthUser } from '../common/types/auth-user';

@ApiTags('Billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('company-plan')
  @Roles('company_admin', 'company_recruiter')
  @ApiOperation({ summary: 'Obtener plan actual de la empresa' })
  getCompanyPlan(@CurrentUser() user: AuthUser) {
    return this.billingService.getCompanyPlan(user);
  }

  @Get('company-history')
  @Roles('company_admin')
  @ApiOperation({ summary: 'Historial de facturación de la empresa' })
  getCompanyHistory(@CurrentUser() user: AuthUser) {
    return this.billingService.getCompanyHistory(user);
  }

  @Get('admin')
  @Roles('super_admin')
  @ApiOperation({ summary: 'Pagos y facturación global (admin)' })
  getAdminBilling() {
    return this.billingService.getAdminBilling();
  }

  @Post('manual-payment')
  @Roles('super_admin')
  @ApiOperation({ summary: 'Registrar cobro manual' })
  createManualPayment(@Body() dto: ManualPaymentDto) {
    return this.billingService.createManualPayment(dto);
  }

  @Get('plans')
  @Roles('super_admin')
  getPlans() {
    return this.billingService.getPlans();
  }

  @Post('plans')
  @Roles('super_admin')
  createPlan(@Body() data: { id: string; name: string; price: number; publicationLimit?: number; userLimit?: number; visibleCandidatesLimit?: number }) {
    return this.billingService.createPlan(data);
  }

  @Patch('plans/:id')
  @Roles('super_admin')
  updatePlan(@Param('id') id: string, @Body() data: { name?: string; price?: number; publicationLimit?: number; userLimit?: number; visibleCandidatesLimit?: number; isActive?: boolean }) {
    return this.billingService.updatePlan(id, data);
  }

  @Delete('plans/:id')
  @Roles('super_admin')
  deletePlan(@Param('id') id: string) {
    return this.billingService.deletePlan(id);
  }

  @Get('payments')
  @Roles('super_admin')
  getAdminPayments(@Query('status') status?: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.billingService.getAdminPayments({ status, page: page ? +page : 1, limit: limit ? +limit : 10 });
  }

  @Patch('assign-plan')
  @Roles('super_admin')
  assignPlanToCompany(@Body() data: { companyId: string; planId: string }) {
    return this.billingService.assignPlanToCompany(data.companyId, data.planId);
  }

  @Get('platform-settings')
  @Roles('super_admin')
  getPlatformSettings() {
    return this.billingService.getPlatformSettings();
  }

  @Patch('platform-settings')
  @Roles('super_admin')
  updatePlatformSettings(@Body() settings: Record<string, any>) {
    return this.billingService.updatePlatformSettings(settings);
  }
}
