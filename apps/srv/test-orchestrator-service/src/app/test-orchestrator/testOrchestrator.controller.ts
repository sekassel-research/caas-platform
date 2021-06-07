import { Body, Controller, Delete, Get, Inject, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { RoleGuard, Roles } from '@caas/srv/auth';
import { MongoIdPipe } from '@caas/srv/mongo';

import { TestOrchestratorService } from './testOrchestrator.service';
import { CreateTestOrchestratorDto, UpdateTestOrchestratorDto } from './dto';
import { TestOrchestrator } from './testOrchestrator.schema';
import { environment as Environment } from '../../environments/environment';

@Controller('test-orchestrator')
@UseGuards(RoleGuard)
export class TestOrchestratorController {
  constructor(@Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka, private testOrchestratorService: TestOrchestratorService) {}

  // -----------REST-----------
  @Post()
  async create(@Body() dto: CreateTestOrchestratorDto): Promise<TestOrchestrator> {
    // artifact exists
    // certificate exists

    return this.testOrchestratorService.create(dto);
  }

  @Post('start/:id')
  async startTestEnvironment(@Body() dto: UpdateTestOrchestratorDto): Promise<void> {
    this.executePipeline(dto);
  }

  @Get()
  @Roles('r')
  async getAll(): Promise<TestOrchestrator[]> {
    return this.testOrchestratorService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id', new MongoIdPipe()) id: string, @Query('populate') populate?: string): Promise<TestOrchestrator> {
    const testOrchestrator = await this.testOrchestratorService.getOne(id, populate);
    if (!testOrchestrator) {
      throw new NotFoundException('Could not find testOrchestrator with given ID.');
    }

    return testOrchestrator;
  }

  @Put(':id')
  async updateOne(@Param('id', new MongoIdPipe()) id: string, @Body() dto: UpdateTestOrchestratorDto): Promise<TestOrchestrator> {
    const testOrchestrator = await this.testOrchestratorService.getOne(id);
    if (!testOrchestrator) {
      throw new NotFoundException('Could not find testOrchestrator with given ID.');
    }
    // artifact exists
    // certificate exists

    return this.testOrchestratorService.updateOne(dto, testOrchestrator);
  }

  @Delete(':id')
  async deleteOne(@Param('id', new MongoIdPipe()) id: string): Promise<TestOrchestrator> {
    const testOrchestrator = await this.testOrchestratorService.getOne(id);
    if (!testOrchestrator) {
      throw new NotFoundException('Could not find testOrchestrator with given ID.');
    }
    await this.testOrchestratorService.deleteOne(testOrchestrator);
    return testOrchestrator;
  }

  // -----------KAFKA-----------
  executePipeline(dto: UpdateTestOrchestratorDto) {
    this.kafkaClient.emit<string>(Environment.KAFKA_START_PIPELINE, JSON.stringify(dto));
  }
}
