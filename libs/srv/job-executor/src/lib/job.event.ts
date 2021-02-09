export abstract class Job {
    state: JobState
    timestamp: number
    errorMessage?: string

    constructor() {
        this.state = JobState.PENDING;
        this.timestamp = Date.now();
    }

    abstract execute(): boolean;
}

export enum JobState {
    PENDING,
    RUNNING,
    DONE,
    ERROR
}
