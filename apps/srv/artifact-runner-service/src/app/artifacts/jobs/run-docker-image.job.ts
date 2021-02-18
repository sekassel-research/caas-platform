import { Job } from '@caas/srv/job-executor';

export class RunDockerImage extends Job {
  constructor(dockerTag: string, name: string) {
    super();
    this.arg = 'docker run --name ' + name + ' ' + dockerTag;
  }
}
