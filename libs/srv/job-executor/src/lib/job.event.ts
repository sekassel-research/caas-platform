export abstract class Job {
  state: JobState;
  timestamp: number;
  errorMessage?: string;
  arg: string;

  constructor() {
    this.state = JobState.PENDING;
    this.timestamp = Date.now();
  }
}

export enum JobState {
  PENDING,
  RUNNING,
  DONE,
  ERROR,
}
