import {
  ArrayMinSize,
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
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsString({ each: true })
  specialtyIds: string[];
}
