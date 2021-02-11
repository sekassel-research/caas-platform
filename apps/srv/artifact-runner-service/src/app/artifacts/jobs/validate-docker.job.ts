import { Job } from '@caas/srv/job-executor'

export class ValidateDockerJob extends Job {
  execute(): boolean {
    // TODO implement
    console.log("ValidateDockerJob started");
    return true;
  }
}
