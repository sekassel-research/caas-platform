import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobExecutorModule } from '@caas/srv/job-executor';

import { ArtifactsController } from './artifacts.controller';
import { ArtifactSchema, HistoryArtifactSchema } from './artifacts.schema';
import { ArtifactsService } from './artifacts.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'artifacts', schema: ArtifactSchema },
      { name: 'historyArtifacts', schema: HistoryArtifactSchema },
    ]),
    JobExecutorModule,
  ],
  controllers: [ArtifactsController],
  providers: [ArtifactsService],
})
export class ArtifactsModule {}
