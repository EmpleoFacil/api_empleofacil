import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

@Module({
  imports: [SupabaseModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
