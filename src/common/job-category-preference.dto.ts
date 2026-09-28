import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class JobCategoryPreferenceDto {
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  specialtyIds: string[];
}
