import { Job, JobState } from './job.event';
import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';

@Injectable()
export class JobExecutorService {
  async executeJob(job: Job): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const execute = exec(job.arg);

      console.log('Executed new Job with PID: ' + execute.pid);

      job.state = JobState.RUNNING;

      execute.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      execute.stderr.on('data', (data) => {
        job.state = JobState.ERROR;
        job.errorMessage = data;
        const logMessage = 'Execute ' + job.constructor.name + ' with PID: ' + execute.pid + ' failed with: ' + job.errorMessage;
        console.log(logMessage);
        reject(logMessage);
      });

      execute.on('close', (code) => {
        if(job.state == JobState.ERROR){
            resolve(false);
            return;
        }
        job.state = JobState.DONE;
        console.log('JobStatus: ' + JobState[job.state]);
        console.log('Execute ' + job.constructor.name + ' with PID: ' + execute.pid + ' successfully');
        resolve(true);
      });
    });
  }
}
