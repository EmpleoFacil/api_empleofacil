import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateApplicationStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}
