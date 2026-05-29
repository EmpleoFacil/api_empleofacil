import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  candidateId: string;

  @IsOptional()
  @IsString()
  applicationId?: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsOptional()
  channelApp?: boolean;

  @IsOptional()
  channelSms?: boolean;

  @IsOptional()
  channelEmail?: boolean;

  @IsOptional()
  @IsString()
  companyId?: string;
}
