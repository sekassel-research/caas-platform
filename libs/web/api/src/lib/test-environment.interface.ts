export interface TestEnvironment {
  readonly id?: string;
  readonly artifactId: string;
  artifactName: string;
  readonly certificateId: string;
  certificateName: string;
  readonly status: string;
}
