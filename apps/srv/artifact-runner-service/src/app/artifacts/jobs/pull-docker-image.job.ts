import { Job } from '@caas/srv/job-executor';

export class PullDockerImageJob extends Job {
  constructor(dockerTag: string) {
    super();
    this.arg = 'docker pull ' + dockerTag;
  }
}
