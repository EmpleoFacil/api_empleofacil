import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterCandidateDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  secondaryPhone?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  desiredJobType?: string;
}
