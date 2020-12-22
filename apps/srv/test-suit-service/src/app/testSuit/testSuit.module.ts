import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestSuitsController } from './testSuit.controller';
import { TestSuitSchema } from './testSuit.schema';
import { TestSuitsService } from './testSuit.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'testsuits', schema: TestSuitSchema },
    ]),
  ],
  controllers: [TestSuitsController],
  providers: [TestSuitsService],
})
export class TestSuitsModule {}
