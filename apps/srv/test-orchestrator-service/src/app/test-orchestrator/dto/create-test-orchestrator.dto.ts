import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTestOrchestratorDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;
  
    @IsNotEmpty()
    @IsString()
    readonly artifactId: string;
  
    @IsNotEmpty()
    @IsString()
    readonly certificateId: string;
}
