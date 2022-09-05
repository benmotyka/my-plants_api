import { ApiProperty } from '@nestjs/swagger';

export class UserSetting {
  @ApiProperty()
  pushNotificationsEnabled: boolean;
}
