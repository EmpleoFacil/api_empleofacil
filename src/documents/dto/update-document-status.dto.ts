import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDocumentStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}
