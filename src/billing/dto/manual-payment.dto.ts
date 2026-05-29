import { IsString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ManualPaymentDto {
  @ApiProperty({ example: 'uuid-company-id' })
  @IsString()
  companyId: string;

  @ApiProperty({ example: 'plan_professional' })
  @IsString()
  planId: string;

  @ApiProperty({ example: 2500 })
  @IsInt()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'NIO', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: '2026-05-28', required: false })
  @IsOptional()
  @IsString()
  paymentDate?: string;

  @ApiProperty({ example: 'REF-001', required: false })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({ example: 'Pago mensual mayo 2026', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
