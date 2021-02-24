import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';

import { JobExecutorService } from './jobExecutor.service';
import { JobEvent } from './events/job.event';
import { Payload } from '@nestjs/microservices';
import { KafkaTopic } from '@caas/srv/kafka';

@Controller()
export class JobExecutorController {
  constructor(private readonly jobExecutorService: JobExecutorService) {}

  @Get()
  getData() {
    return this.jobExecutorService.getData();
  }

  // -----------KAFKA-----------
  /**
   * TEST_IMPLEMENTATION_FOR_TESTING_ONLY
   */
  @KafkaTopic('jobexecute')
  async onCertificateGranted(@Payload() jobEvent: JobEvent): Promise<void> {
    this.jobExecutorService.executeJob(jobEvent);
  }
}
