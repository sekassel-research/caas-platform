import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { exec } from 'child_process';
import { JobEvent, JobState } from '@caas/srv/kafka';
import { environment as Environment } from '../../environments/environment';

@Injectable()
export class JobExecutorService {
  private readonly logger = new Logger(JobExecutorService.name);

  constructor(@Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka) {}

  async executeJob(jobEvent: JobEvent) {
    const jobEventJson = JSON.parse(JSON.stringify(jobEvent));

    const jobExecuteString = `${jobEventJson.value.dockerJob} ${jobEventJson.value.dockerOptions} ${jobEventJson.value.dockerTag} ${jobEventJson.value.dockerArgs}`;
    jobEvent.jobStatus = JobState.RUNNING;

    const execute = exec(jobExecuteString);

    execute.stdout.on('data', (data) => {
      jobEvent.dockerOut += data;
      // console.log(`stdout: ${data}`);
    });

    execute.stderr.on('data', (data) => {
      this.logger.error(`Job Failed. stderr: ${data}`);
      jobEvent.jobStatus = JobState.ERROR;
      jobEvent.dockerError += data;
      this.logger.log('Emitted jobfinished-Event.');
      this.kafkaClient.emit<string>(Environment.KAFKA_JOB_FINISHED, JSON.stringify(jobEvent));
    });

    execute.on('exit', () => {
      jobEvent.jobStatus = JobState.DONE;
      this.logger.log('Emitted jobfinished-Event.');
      this.kafkaClient.emit<string>(Environment.KAFKA_JOB_FINISHED, JSON.stringify(jobEvent));
    });
  }
}
