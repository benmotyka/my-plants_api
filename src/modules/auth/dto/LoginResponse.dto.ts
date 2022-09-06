import { IsString } from 'class-validator';
import { UserSetting } from '@shared/interfaces/UserSetting';
import { ApiProperty } from '@nestjs/swagger';
export class LoginResponseDto {
  @IsString()
  @ApiProperty()
  readonly accessToken: string;

  @ApiProperty()
  readonly userSettings: UserSetting;

  @ApiProperty()
  readonly confirmedEmail: boolean;

  constructor({
    accessToken,
    userSettings,
    confirmedEmail,
  }: {
    accessToken: string;
    userSettings: UserSetting;
    confirmedEmail: boolean;
  }) {
    this.accessToken = accessToken;
    this.userSettings = userSettings;
    this.confirmedEmail = confirmedEmail;
  }
}
