import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { TestSuite } from './testSuite.schema';
import { CreateTestSuiteDto, UpdateTestsuiteDto } from './dto';

@Injectable()
export class TestSuitesService {
  constructor(
    @InjectModel('testsuites') private readonly testSuitesModel: Model<TestSuite>,
  ) {}

  async create(dto: CreateTestSuiteDto): Promise<TestSuite> {
    return this.testSuitesModel.create(dto);
  }

  async getAll(): Promise<TestSuite[]> {
    return this.testSuitesModel.find().exec();
  }

  async getOne(id?: string, populate?: string): Promise<TestSuite> {
    populate = populate || '';
    return this.testSuitesModel.findById(id).populate(populate).exec();
  }

  async getOneByName(name: string): Promise<TestSuite> {
    return this.testSuitesModel.findOne({ name }).exec();
  }

  async updateOne(dto: UpdateTestsuiteDto, oldTestSuite: TestSuite): Promise<TestSuite> {
    const updateId = oldTestSuite.id;

    return this.testSuitesModel.findOneAndUpdate({ _id: updateId }, { $set: dto }, { new: true }).exec();
  }

  async deleteOne(testSuite: TestSuite): Promise<string> {
    await this.testSuitesModel.deleteOne({ _id: testSuite.id }).exec();

    return testSuite.id;
  }
}
