import { IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlatformSettingsDto {
  @ApiProperty({
    example: {
      planLimits: { basic: { publications: 10, users: 3 } },
      visibility: { allowAnonymousJobView: true },
      billing: { currency: 'NIO', taxRate: 15 },
    },
  })
  @IsObject()
  settings: Record<string, unknown>;
}
