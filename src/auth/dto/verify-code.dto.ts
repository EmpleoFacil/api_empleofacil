import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyCodeDto {
  @IsString()
  @IsNotEmpty()
  recoveryId: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
