import { IsString } from 'class-validator';

export class LoginResponseDto {
  @IsString()
  access_token: string;

  constructor({ access_token }: { access_token: string }) {
    this.access_token = access_token;
  }
}
