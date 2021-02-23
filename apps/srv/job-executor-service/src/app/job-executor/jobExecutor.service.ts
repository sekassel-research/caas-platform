import { Injectable } from '@nestjs/common';

@Injectable()
export class JobExecutorService {
  getData(): { message: string } {
    return { message: 'Welcome to srv/job-executor-service!' };
  }
}
