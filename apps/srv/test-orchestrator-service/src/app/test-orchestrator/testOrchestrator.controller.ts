import { Controller, Get } from '@nestjs/common';

import { TestOrchestratorService } from './testOrchestrator.service';

@Controller()
export class TestOrchestratorController {
  constructor(private readonly testOrchestratorService: TestOrchestratorService) {}

  @Get()
  getData() {
    return this.testOrchestratorService.getData();
  }
}
