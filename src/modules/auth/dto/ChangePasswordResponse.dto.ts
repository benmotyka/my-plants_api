import { IsString } from 'class-validator';

export class ChangePasswordResponseDto {
  @IsString()
  readonly status: string;

  constructor(status: string) {
    this.status = status;
  }
}
