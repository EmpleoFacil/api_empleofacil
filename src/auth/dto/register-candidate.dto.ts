import { Type } from 'class-transformer';
import { JobCategoryPreferenceDto } from '../../common/job-category-preference.dto';
import { NICARAGUA_DEPARTMENTS } from '../../common/nicaragua-departments';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

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

  @IsInt()
  @Min(1)
  @Max(120)
  age: number;

  @IsIn(NICARAGUA_DEPARTMENTS)
  department: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  neighborhood?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  desiredJobType?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => JobCategoryPreferenceDto)
  jobPreferences: JobCategoryPreferenceDto[];
}
