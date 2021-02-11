import { Job, JobState } from './job.event'
import { Injectable } from '@nestjs/common'
import { fork } from 'child_process'

@Injectable()
export class JobExecutorService {

    async executeJob(job: Job): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const child = fork('libs/srv/job-executor/src/lib/child.ts');

            job.state = JobState.RUNNING;
            child.send(job);

            child.on('message', (message: String) => {
                console.log(message);
            });

            child.on('disconnect', () => {
                job.state = JobState.DONE;
                console.log("JobStatus:" + job.state);
                resolve(true);
            })

            child.on('error', () => {
                job.state = JobState.ERROR;
                console.log("JobStatus:" + job.state);
                reject("Execute " + job.constructor.name + "failed with: " + job.errorMessage);
            })
        });
    }
}
