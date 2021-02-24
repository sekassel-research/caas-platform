export class JobEvent {
  readonly id: string;
  readonly dockerJob: string;
  readonly dockerTag: string;
  readonly dockerOptions: string;
  readonly dockerArgs: string;
  jobStatus: JobState;
  dockerOut: string;
  dockerError: string;

  constructor(dockerJob: string, dockerTag: string, dockerOptions: string, dockerArgs: string) {
    this.id = '1'; // TODO generate UUID
    this.jobStatus = JobState.PENDING;
    this.dockerJob = dockerJob;
    this.dockerTag = dockerTag;
    this.dockerOptions = dockerOptions;
    this.dockerArgs = dockerArgs;
    this.dockerOut = '';
    this.dockerError = '';
  }
}

export enum JobState {
  PENDING,
  RUNNING,
  DONE,
  ERROR,
}
