import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { JobEvent } from './events/job.event';

@Injectable()
export class JobExecutorService {
  getData(): { message: string } {
    return { message: 'Welcome to srv/job-executor-service!' };
  }

  async executeJob(jobEvent: JobEvent) {
    const jobEventJson = JSON.parse(JSON.stringify(jobEvent));

    const jobExecuteString = `${jobEventJson.value.dockerJob} ${jobEventJson.value.dockerOptions} ${jobEventJson.value.dockerTag} ${jobEventJson.value.dockerArgs}`;

    const execute = exec(jobExecuteString);
    execute.stdout.on('data', (data) => {
      console.error(`Job Succeded`);
      console.log(`stdout: ${data}`);
    });

    execute.stderr.on('data', (data) => {
      console.error(`Job Failed`);
      console.error(`stderr: ${data}`);
    });
  }
}
