import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateArtifactDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly version?: string;

  @IsOptional()
  @IsString()
  readonly dockerImage?: string;

  @IsOptional()
  @IsString()
  readonly certificate: string;

  @IsOptional()
  @IsArray()
  readonly testSuit: string[];
}
