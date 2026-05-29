import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageTemplateDto {
  @ApiProperty({ example: 'Invitación a entrevista' })
  @IsString()
  name: string;

  @ApiProperty({
    enum: ['interview_invitation', 'document_request', 'status_update', 'general_message', 'reminder'],
  })
  @IsEnum(['interview_invitation', 'document_request', 'status_update', 'general_message', 'reminder'])
  type: string;

  @ApiProperty({ example: 'Te invitamos a una entrevista', required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ example: 'Hola {{candidateName}}, te invitamos...' })
  @IsString()
  body: string;

  @ApiProperty({ example: 'uuid-company-id', required: false })
  @IsOptional()
  @IsString()
  companyId?: string;
}
