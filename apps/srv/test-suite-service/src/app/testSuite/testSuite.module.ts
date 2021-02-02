import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestSuitesController } from './testSuite.controller';
import { TestSuiteSchema } from './testSuite.schema';
import { TestSuitesService } from './testSuite.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'testsuites', schema: TestSuiteSchema }])],
  controllers: [TestSuitesController],
  providers: [TestSuitesService],
})
export class TestSuitesModule {}
