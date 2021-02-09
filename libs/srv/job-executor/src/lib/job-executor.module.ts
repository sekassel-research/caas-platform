import { Module } from '@nestjs/common';
import { JobExecutorService } from './job-executor.service';

@Module({
  controllers: [],
  providers: [JobExecutorService],
  exports: [JobExecutorService],
})
export class JobExecutorModule { }
