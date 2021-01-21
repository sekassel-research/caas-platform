import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class Event {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly type: string;

  @IsNumber()
  @IsNotEmpty()
  readonly timestamp: number;
}