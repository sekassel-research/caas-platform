export interface TestEnvironment {
  readonly id?: string;
  readonly artifactId: string;
  artifactName: string;
  readonly certificateId: string;
  certificateName: string;
  readonly status: string;
}

export interface TestEnvironmentDto {
  readonly id?: string;
  readonly artifactId: string;
  readonly certificateId: string;
  readonly status: string;
}
