import { Test } from '@nestjs/testing';

import { JobExecutorService } from '../app/job-executor';

describe('JobExecutorService', () => {
  let service: JobExecutorService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [JobExecutorService],
    }).compile();

    service = app.get<JobExecutorService>(JobExecutorService);
  });

  describe('getData', () => {
    it('should return "Welcome to srv/job-executor-service!"', () => {
      expect(service.getData()).toEqual({ message: 'Welcome to srv/job-executor-service!' });
    });
  });
});
