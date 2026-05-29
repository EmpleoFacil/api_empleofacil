import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMessageStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}
