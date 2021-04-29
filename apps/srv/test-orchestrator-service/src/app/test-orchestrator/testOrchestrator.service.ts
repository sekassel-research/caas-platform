import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CreateTestOrchestratorDto, UpdateTestOrchestratorDto } from './dto';
import { TestOrchestrator } from './testOrchestrator.schema';

@Injectable()
export class TestOrchestratorService {

  constructor(
    @InjectModel('artifacts') private readonly testOrchestratorModel: Model<TestOrchestrator>,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka) { }

  async create(dto: CreateTestOrchestratorDto): Promise<TestOrchestrator> {
    return this.testOrchestratorModel.create(dto);
  }

  async getAll(): Promise<TestOrchestrator[]> {
    return this.testOrchestratorModel.find().exec();
  }

  async getOne(id?: string, populate?: string): Promise<TestOrchestrator> {
    populate = populate || ''
    return this.testOrchestratorModel.findById(id).populate(populate).exec();
  }

  async updateOne(dto: UpdateTestOrchestratorDto, oldTestOrchestrator: TestOrchestrator): Promise<TestOrchestrator> {
    return this.testOrchestratorModel.findOneAndUpdate({ _id: oldTestOrchestrator.id }, { $set: dto }, { new: true }).exec();
  }

  async deleteOne(testOrchestrator: TestOrchestrator): Promise<string> {
    await this.testOrchestratorModel.deleteOne({ _id: testOrchestrator.id }).exec();

    return testOrchestrator.id;
  }
}
