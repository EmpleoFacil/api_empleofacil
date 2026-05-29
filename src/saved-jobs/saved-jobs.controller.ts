import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SavedJobsService } from './saved-jobs.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SaveJobDto } from './dto/save-job.dto';
import type { AuthUser } from '../common/types/auth-user';

@ApiTags('Saved Jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('candidate')
@Controller('saved-jobs')
export class SavedJobsController {
  constructor(private readonly savedJobsService: SavedJobsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Vacantes guardadas del candidato' })
  findMySavedJobs(@CurrentUser() user: AuthUser) {
    return this.savedJobsService.findByCandidate(user);
  }

  @Post()
  @ApiOperation({ summary: 'Guardar vacante' })
  saveJob(@CurrentUser() user: AuthUser, @Body() dto: SaveJobDto) {
    return this.savedJobsService.save(user, dto.jobId);
  }

  @Delete(':jobId')
  @ApiOperation({ summary: 'Quitar vacante guardada' })
  unsaveJob(@CurrentUser() user: AuthUser, @Param('jobId') jobId: string) {
    return this.savedJobsService.unsave(user, jobId);
  }
}
