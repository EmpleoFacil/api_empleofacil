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
  interviewerName?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  mapUrl?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
