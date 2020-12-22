import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { TestSuit } from './testSuit.schema';
import { CreateTestSuitDto, UpdateTestsuitDto } from './dto';

@Injectable()
export class TestSuitsService {
  constructor(
    @InjectModel('testsuits') private readonly testSuitsModel: Model<TestSuit>,
  ) {}

  async create(dto: CreateTestSuitDto): Promise<TestSuit> {
    return this.testSuitsModel.create(dto);
  }

  async getAll(): Promise<TestSuit[]> {
    return this.testSuitsModel.find().exec();
  }

  async getOne(id?: string, populate?: string): Promise<TestSuit> {
    populate = populate || '';
    return this.testSuitsModel.findById(id).populate(populate).exec();
  }

  async getOneByName(name: string): Promise<TestSuit> {
    return this.testSuitsModel.findOne({ name }).exec();
  }

  async updateOne(dto: UpdateTestsuitDto, oldTestSuit: TestSuit): Promise<TestSuit> {
    const updateId = oldTestSuit.id;

    return this.testSuitsModel.findOneAndUpdate({ _id: updateId }, { $set: dto }, { new: true }).exec();
  }

  async deleteOne(testSuit: TestSuit): Promise<string> {
    await this.testSuitsModel.deleteOne({ _id: testSuit.id }).exec();

    return testSuit.id;
  }
}
