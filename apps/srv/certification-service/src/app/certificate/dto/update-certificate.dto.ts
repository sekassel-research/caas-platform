import { IsOptional, IsString } from 'class-validator';

export class UpdateCertificateDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly version?: string;

  @IsOptional()
  @IsString()
  readonly signatur?: string;
}
