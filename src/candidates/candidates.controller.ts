import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import type { AuthUser } from '../common/types/auth-user';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { CandidatesService } from './candidates.service';

@ApiTags('candidates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Get('me')
  @Roles('candidate')
  getMe(@CurrentUser() user: AuthUser) {
    return this.candidatesService.getMe(user);
  }

  @Patch('me')
  @Roles('candidate')
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateCandidateDto) {
    return this.candidatesService.updateMe(user, dto);
  }

  @Get('summary')
  @Roles('super_admin')
  getSummary() {
    return this.candidatesService.getSummary();
  }

  @Get('export')
  @Roles('super_admin')
  exportCandidates(@Query('status') status?: string, @Query('city') city?: string) {
    return this.candidatesService.exportCandidates({ status, city });
  }

  @Get()
  @Roles('super_admin')
  list(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('city') city?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.candidatesService.listPaginated({
      search, status, city,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get(':id')
  @Roles('super_admin', 'company_admin')
  getById(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.candidatesService.getById(id, user);
  }

  @Get(':id/applications')
  @Roles('super_admin')
  getApplications(@Param('id') id: string) {
    return this.candidatesService.getApplications(id);
  }

  @Get(':id/documents')
  @Roles('super_admin')
  getDocuments(@Param('id') id: string) {
    return this.candidatesService.getDocuments(id);
  }

  @Patch(':id/status')
  @Roles('super_admin')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.candidatesService.updateStatus(id, status);
  }
}
