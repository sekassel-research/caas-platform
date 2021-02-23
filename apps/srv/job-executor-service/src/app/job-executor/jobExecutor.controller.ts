import { Controller, Get } from '@nestjs/common';

import { JobExecutorService } from './jobExecutor.service';
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
  @KafkaTopic('jobexec')
  async onCertificateGranted(): Promise<void> {
    console.log('Hey, it worked. Congratulation!');
  }
}
