import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';

import { RoleGuard, Roles } from '@caas/srv/auth';
import { MongoIdPipe } from '@caas/srv/mongo';

import { TestSuite } from './testSuite.schema';
import { TestSuitesService } from './testSuite.service';
import { CreateTestSuiteDto, UpdateTestsuiteDto } from './dto';
import { Constants } from 'tools/util/constants'

@Controller('testSuites')
@UseGuards(RoleGuard)
export class TestSuitesController {
  constructor(private testSuitesService: TestSuitesService) {}

  @Post()
  async create(@Body() dto: CreateTestSuiteDto): Promise<TestSuite> {
    const oldTestSuite = await this.testSuitesService.getOneByName(dto.name);
    if (oldTestSuite) {
      throw new BadRequestException(`TestSuite with name ${dto.name} already exists.`);
    }
    if (!dto.version.match(Constants.REGEX_VERSION_FORMAT)) {
      throw new BadRequestException('Invalid format for version, use 1.0.0');
    }
    if (!dto.dockerImage.match(Constants.REGEX_DOCKER_TAG)) {
      throw new BadRequestException('Invalid format for docker tags, use mydock:1.0.0 or test/mydock:1.2.1');
    }

    return this.testSuitesService.create(dto);
  }

  @Get()
  @Roles('r')
  async getAll(): Promise<TestSuite[]> {
    return this.testSuitesService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id', new MongoIdPipe()) id: string, @Query('populate') populate?: string): Promise<TestSuite> {
    const testSuite = await this.testSuitesService.getOne(id, populate);
    if (!testSuite) {
      throw new NotFoundException('Could not find testSuite with given ID.');
    }

    return testSuite;
  }

  @Put(':id')
  async updateOne(@Param('id', new MongoIdPipe()) id: string, @Body() dto: UpdateTestsuiteDto): Promise<TestSuite> {
    const testSuite = await this.testSuitesService.getOne(id);
    if (!testSuite) {
      throw new NotFoundException('Could not find testSuite with given ID.');
    }
    if (!dto.version.match(Constants.REGEX_VERSION_FORMAT)) {
      throw new BadRequestException('Invalid format for version, use 1.0.0');
    }
    if (dto.version && testSuite.version === dto.version) {
      throw new BadRequestException('Version needs to be increased');
    }
    if (!dto.dockerImage.match(Constants.REGEX_DOCKER_TAG)) {
      throw new BadRequestException('Invalid format for docker tags, use mydock:1.0.0 or test/mydock:1.2.1');
    }

    return this.testSuitesService.updateOne(dto, testSuite);
  }

  @Delete(':id')
  async deleteOne(@Param('id', new MongoIdPipe()) id: string): Promise<TestSuite> {
    const testSuite = await this.testSuitesService.getOne(id);
    if (!testSuite) {
      throw new NotFoundException('Could not find testSuite with given ID.');
    }

    await this.testSuitesService.deleteOne(testSuite);
    return testSuite;
  }
}
