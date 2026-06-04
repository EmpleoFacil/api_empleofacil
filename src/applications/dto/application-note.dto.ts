import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ApplicationNoteDto {
  @ApiProperty({ example: 'Nota interna sobre el candidato.' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
