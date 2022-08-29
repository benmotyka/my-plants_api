import { IsString } from 'class-validator';
import { UserSetting } from '@shared/interfaces/UserSetting';
import { ApiProperty } from '@nestjs/swagger';
export class LoginResponseDto {
  @IsString()
  @ApiProperty()
  readonly accessToken: string;

  @ApiProperty()
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
