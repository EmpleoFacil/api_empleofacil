import { BadRequestException, Body, Controller, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import type { AuthUser } from '../common/types/auth-user';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { UpdateDocumentStatusDto } from './dto/update-document-status.dto';
import { DocumentsService } from './documents.service';

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get('types')
  getDocumentTypes() {
    return this.documentsService.getDocumentTypes();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('upload')
  @Roles('candidate')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_request, file, callback) => {
        const extension = file.originalname.split('.').pop()?.toLowerCase();
        if (!extension || !['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'].includes(extension)) {
          callback(new BadRequestException('Formato no permitido.'), false);
          return;
        }
        callback(null, true);
      },
    }),
  )
  upload(
    @CurrentUser() user: AuthUser,
    @Body() dto: UploadDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.documentsService.upload(user, dto, file);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('me')
  @Roles('candidate')
  listForCandidate(@CurrentUser() user: AuthUser) {
    return this.documentsService.listForCandidate(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('pending')
  @Roles('super_admin')
  listPending() {
    return this.documentsService.listPending();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/status')
  @Roles('super_admin')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateDocumentStatusDto) {
    return this.documentsService.updateStatus(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('candidate/:candidateId')
  @Roles('company_admin', 'super_admin')
  listByCandidateId(@Param('candidateId') candidateId: string, @CurrentUser() user: AuthUser) {
    return this.documentsService.listByCandidateId(candidateId, user);
  }
}
