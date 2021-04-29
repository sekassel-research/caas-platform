import { IsOptional, IsString } from 'class-validator';

export class UpdateTestOrchestratorDto {
    @IsOptional()
    @IsString()
    readonly name?: string;
  
    @IsOptional()
    @IsString()
    readonly artifactId?: string;
  
    @IsOptional()
    @IsString()
    readonly certificateId?: string;
}
