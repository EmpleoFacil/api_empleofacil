import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RespondMessageDto {
  @IsString()
  @IsNotEmpty()
  responseType: string;

  @IsOptional()
  @IsString()
  body?: string;
}
