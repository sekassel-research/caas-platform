import { Controller, Logger } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';

import { KafkaTopic, JobEvent } from '@caas/srv/kafka';

import { JobExecutorService } from './jobExecutor.service';
import { environment as Environment } from '../../environments/environment';

@Controller()
export class JobExecutorController {
  private readonly logger = new Logger(JobExecutorController.name);

  constructor(private readonly jobExecutorService: JobExecutorService) {}

  // -----------KAFKA-----------
  /**
   * TEST_IMPLEMENTATION_FOR_TESTING_ONLY
   */
  @KafkaTopic(Environment.KAFKA_JOB_EXECUTE)
  async onCertificateGranted(@Payload() jobEvent: JobEvent): Promise<void> {
    this.logger.log('Consumed jobexecute-Event.');
    this.jobExecutorService.executeJob(jobEvent);
  }

  @KafkaTopic(Environment.KAFKA_START_PIPELINE)
  async onPipelineStarted(): Promise<void> {
    this.logger.log('Consumed startpipeline-Event.');
  }
}
