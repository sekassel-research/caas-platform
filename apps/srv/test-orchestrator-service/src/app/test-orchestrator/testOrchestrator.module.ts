import { Module } from '@nestjs/common';

import { TestOrchestratorController } from './testOrchestrator.controller';
import { TestOrchestratorService } from './testOrchestrator.service';

@Module({
  imports: [],
  controllers: [TestOrchestratorController],
  providers: [TestOrchestratorService],
})
export class TestOrchestratorModule {}
