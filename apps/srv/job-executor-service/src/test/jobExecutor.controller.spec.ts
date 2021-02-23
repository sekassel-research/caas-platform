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

  describe('getData', () => {
    it('should return "Welcome to srv/job-executor-service!"', () => {
      const jobExecutorController = app.get<JobExecutorController>(JobExecutorController);
      expect(jobExecutorController.getData()).toEqual({ message: 'Welcome to srv/job-executor-service!' });
    });
  });
});
