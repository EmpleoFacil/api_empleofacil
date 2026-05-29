import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateInterviewStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}
