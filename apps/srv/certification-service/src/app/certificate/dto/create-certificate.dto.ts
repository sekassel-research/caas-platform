import {IsArray, IsNotEmpty, IsString} from 'class-validator';
import {Type} from "class-transformer";

export class CreateCertificateDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly version: string;

  @IsNotEmpty()
  @IsString()
  readonly signature: string;

  @IsNotEmpty()
  @IsArray()
  @Type(() => String)
  readonly confirmanceTests: string[];
}
