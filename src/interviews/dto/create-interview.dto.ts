import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInterviewDto {
  @IsString()
  @IsNotEmpty()
  applicationId: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  meetingUrl?: string;

  @IsOptional()
  @IsString()
  status?: string;

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
  notesForCandidate?: string;
}
