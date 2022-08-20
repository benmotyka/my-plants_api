import { IsString } from 'class-validator';
import { UserSetting } from '@shared/interfaces/UserSetting';
export class LoginResponseDto {
  @IsString()
  readonly accessToken: string;

  readonly userSettings: UserSetting;

  constructor({
    accessToken,
    userSettings,
  }: {
    accessToken: string;
    userSettings: UserSetting;
  }) {
    this.accessToken = accessToken;
    this.userSettings = userSettings;
  }
}
