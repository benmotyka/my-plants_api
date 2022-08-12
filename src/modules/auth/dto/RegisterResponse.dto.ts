import { IsString } from 'class-validator';

export class RegisterResponseDto {
  @IsString()
  readonly status: string;

  constructor(status: string) {
    this.status = status;
  }
}
