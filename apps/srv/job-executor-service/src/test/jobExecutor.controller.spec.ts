import { Test, TestingModule } from '@nestjs/testing';

import { JobExecutorController, JobExecutorService } from '../app/job-executor';

describe('JobExecutorController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [JobExecutorController],
      providers: [JobExecutorService],
    }).compile();
  });
});
