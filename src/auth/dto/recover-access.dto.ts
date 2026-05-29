import { IsNotEmpty, IsString } from 'class-validator';

export class RecoverAccessDto {
  @IsString()
  @IsNotEmpty()
  identifier: string;
}
