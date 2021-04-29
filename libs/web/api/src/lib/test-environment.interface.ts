export interface TestEnvironment {
  readonly id?: string;
  readonly artifactID: string;
  readonly certificateID: string;
  readonly status: string;
}
