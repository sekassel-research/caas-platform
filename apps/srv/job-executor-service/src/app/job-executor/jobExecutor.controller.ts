import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';

import { KafkaTopic, JobEvent } from '@caas/srv/kafka';

import { JobExecutorService } from './jobExecutor.service';
import { Constants } from 'tools/util/constants';

@Controller()
export class JobExecutorController {
  constructor(private readonly jobExecutorService: JobExecutorService) {}

  // -----------KAFKA-----------
  /**
   * TEST_IMPLEMENTATION_FOR_TESTING_ONLY
   */
  @KafkaTopic(Constants.KAFKA_JOB_EXECUTE)
  async onCertificateGranted(@Payload() jobEvent: JobEvent): Promise<void> {
    this.jobExecutorService.executeJob(jobEvent);
  }
}
