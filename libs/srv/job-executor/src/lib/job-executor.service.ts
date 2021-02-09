import { Job, JobState } from './job.event'
import { Injectable } from '@nestjs/common'

@Injectable()
export class JobExecutorService {
    async executeJob(job: Job): Promise<boolean> {
        // TODO implement real async
        job.state = JobState.RUNNING;

        if (job.execute()) {
            job.state = JobState.DONE;
            return true;
        } else {
            job.state = JobState.ERROR;
            console.error("Execute " + job.constructor.name + "failed with: " + job.errorMessage);
            return false;
        }
    }
}
