import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TestOrchestratorController } from './testOrchestrator.controller';
import { TestOrchestratorSchema } from './testOrchestrator.schema';
import { TestOrchestratorService } from './testOrchestrator.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'testOrchestrators', schema: TestOrchestratorSchema }])],
  controllers: [TestOrchestratorController],
  providers: [TestOrchestratorService],
})
export class TestOrchestratorModule {}
