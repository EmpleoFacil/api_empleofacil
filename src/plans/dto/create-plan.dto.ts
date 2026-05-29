import { IsString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanDto {
  @ApiProperty({ example: 'plan_custom' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'Plan Personalizado' })
  @IsString()
  name: string;

  @ApiProperty({ example: 3000 })
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'NIO', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: 20, required: false })
  @IsOptional()
  @IsInt()
  publicationLimit?: number;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsInt()
  userLimit?: number;

  @ApiProperty({ example: 300, required: false })
  @IsOptional()
  @IsInt()
  visibleCandidatesLimit?: number;
}
