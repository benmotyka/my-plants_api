import { IsString } from 'class-validator';

export class LoginResponseDto {
  @IsString()
  readonly accessToken: string;

  constructor({ accessToken }: { accessToken: string }) {
    this.accessToken = accessToken;
  }
}
