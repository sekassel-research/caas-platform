import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCertificateDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly version: string;

  @IsNotEmpty()
  @IsString()
  readonly signatur: string;
}
