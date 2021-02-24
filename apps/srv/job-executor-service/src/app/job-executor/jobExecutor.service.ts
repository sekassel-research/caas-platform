import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { exec } from 'child_process';
import { JobEvent, JobState } from './events/job.event';

@Injectable()
export class JobExecutorService {
  constructor(@Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka) {}

  getData(): { message: string } {
    return { message: 'Welcome to srv/job-executor-service!' };
  }

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
      console.error(`Job Failed`);
      console.error(`stderr: ${data}`);
      jobEvent.jobStatus = JobState.ERROR;
      jobEvent.dockerError += data;
      this.kafkaClient.emit<string>('jobfinished', JSON.stringify(jobEvent));
    });

    execute.on('exit', () => {
      jobEvent.jobStatus = JobState.DONE;
      this.kafkaClient.emit<string>('jobfinished', JSON.stringify(jobEvent));
    });
  }
}
