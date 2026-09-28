import { Type } from 'class-transformer';
import { JobCategoryPreferenceDto } from '../../common/job-category-preference.dto';
import { NICARAGUA_DEPARTMENTS } from '../../common/nicaragua-departments';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class UpdateCandidateDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(120)
  age?: number;

  @IsOptional()
  @IsIn(NICARAGUA_DEPARTMENTS)
  department?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  neighborhood?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  secondaryPhone?: string;

  @IsOptional()
  @IsString()
  desiredJobType?: string;

  @IsOptional()
  @IsString()
  availability?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  salaryExpectationMin?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  salaryExpectationMax?: number;

  @IsOptional()
  @IsString()
  experienceLevel?: string;

  @IsOptional()
  @IsString()
  educationLevel?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  profileCompletion?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @ArrayUnique((preference: JobCategoryPreferenceDto) => preference.categoryId)
  @ValidateNested({ each: true })
  @Type(() => JobCategoryPreferenceDto)
  jobPreferences?: JobCategoryPreferenceDto[];
}
