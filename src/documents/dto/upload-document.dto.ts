import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UploadDocumentDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  replace?: boolean;
}
