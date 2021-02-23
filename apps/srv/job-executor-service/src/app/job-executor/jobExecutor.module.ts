import { Module } from '@nestjs/common';
import { JobExecutorController } from './jobExecutor.controller';
import { JobExecutorService } from './jobExecutor.service';

@Module({
  imports: [],
  controllers: [JobExecutorController],
  providers: [JobExecutorService],
})
export class JobExecutorModule {}
