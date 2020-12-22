import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { RoleGuard, Roles } from '@caas/srv/auth';
import { MongoIdPipe } from '@caas/srv/mongo';

import { TestSuit } from './testSuit.schema';
import { TestSuitsService } from './testSuit.service';
import { CreateTestSuitDto, UpdateTestsuitDto } from './dto';

@Controller('testSuit')
@UseGuards(RoleGuard)
@UsePipes(new ValidationPipe())
export class TestSuitsController {
  constructor(private testSuitsService: TestSuitsService) {}

  @Post()
  async create(@Body() dto: CreateTestSuitDto): Promise<TestSuit> {
    const oldTestSuit = await this.testSuitsService.getOneByName(dto.name);
    if (oldTestSuit) {
      throw new BadRequestException(`TestSuit with name ${dto.name} already exists.`);
    }
    if (!dto.version.match(/\d+\.\d+\.\d+/)) {
      throw new BadRequestException('Invalid format for version, use 1.0.0');
    }
    if (!dto.dockerImage.match(/([\w-]+\/)?([\w-]+:\d+\.\d+\.\d+)/)) {
      throw new BadRequestException('Invalid format for docker tags, use mydock:1.0.0 or test/mydock:1.2.1');
    }

    return this.testSuitsService.create(dto);
  }

  @Get()
  @Roles('r')
  async getAll(): Promise<TestSuit[]> {
    return this.testSuitsService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id', new MongoIdPipe()) id: string, @Query('populate') populate?: string): Promise<TestSuit> {
    const testSuit = await this.testSuitsService.getOne(id, populate);
    if (!testSuit) {
      throw new NotFoundException('Could not find testSuit with given ID.');
    }

    return testSuit;
  }

  @Put(':id')
  async updateOne(@Param('id', new MongoIdPipe()) id: string, @Body() dto: UpdateTestsuitDto): Promise<TestSuit> {
    const testSuit = await this.testSuitsService.getOne(id);
    if (!testSuit) {
      throw new NotFoundException('Could not find testSuit with given ID.');
    }
    if (!dto.version.match(/\d+\.\d+\.\d+/)) {
      throw new BadRequestException('Invalid format for version, use 1.0.0');
    }
    if (dto.version && testSuit.version === dto.version) {
      throw new BadRequestException('Version needs to be increased');
    }
    if (!dto.dockerImage.match(/([\w-]+\/)?([\w-]+:\d\.\d\.\d)/)) {
      throw new BadRequestException('Invalid format for docker tags, use mydock:1.0.0 or test/mydock:1.2.1');
    }

    return this.testSuitsService.updateOne(dto, testSuit);
  }

  @Delete(':id')
  async deleteOne(@Param('id', new MongoIdPipe()) id: string): Promise<TestSuit> {
    const testSuit = await this.testSuitsService.getOne(id);
    if (!testSuit) {
      throw new NotFoundException('Could not find testSuit with given ID.');
    }

    await this.testSuitsService.deleteOne(testSuit);
    return testSuit;
  }
}
