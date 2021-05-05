import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTestOrchestratorDto {
  @IsNotEmpty()
  @IsString()
  readonly status: string;

  @IsNotEmpty()
  @IsString()
  readonly artifactId: string;

  @IsNotEmpty()
  @IsString()
  readonly certificateId: string;
}
