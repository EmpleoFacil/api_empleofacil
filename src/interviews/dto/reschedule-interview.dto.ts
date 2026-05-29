import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RescheduleInterviewDto {
  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  meetingUrl?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
