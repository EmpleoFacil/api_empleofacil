import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaveJobDto {
  @ApiProperty({ example: 'uuid-job-id' })
  @IsString()
  jobId: string;
}
