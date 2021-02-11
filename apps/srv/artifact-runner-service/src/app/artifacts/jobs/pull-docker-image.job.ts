import { Job } from '@caas/srv/job-executor'

export class PullDockerImageJob extends Job {
    execute(): boolean {
        // TODO implement
        console.log("PullDockerImageJob started");
        return true;
    }
}
