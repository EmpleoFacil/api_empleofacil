import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';

@ApiTags('Search')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('company')
  @Roles('company_admin', 'company_recruiter')
  @ApiOperation({ summary: 'Búsqueda global para empresa' })
  @ApiQuery({ name: 'q', required: true })
  @ApiQuery({ name: 'type', required: false, enum: ['jobs', 'candidates', 'messages', 'all'] })
  searchCompany(
    @CurrentUser() user: AuthUser,
    @Query('q') query: string,
    @Query('type') type?: string,
    @Query('categoryId') categoryId?: string,
    @Query('specialtyId') specialtyId?: string,
  ) {
    return this.searchService.searchForCompany(
      user,
      query,
      type ?? 'all',
      categoryId,
      specialtyId,
    );
  }
}
