import { IsOptional, IsString } from 'class-validator';

export class UpdateTestsuiteDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly version?: string;

  @IsOptional()
  @IsString()
  readonly dockerImage?: string;
}
