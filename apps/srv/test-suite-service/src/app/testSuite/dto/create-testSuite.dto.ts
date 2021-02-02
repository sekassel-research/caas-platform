import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTestSuiteDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly version: string;

  @IsNotEmpty()
  @IsString()
  readonly dockerImage: string;
}
