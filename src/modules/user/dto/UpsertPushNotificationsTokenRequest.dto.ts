import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpsertPushNotificationsTokenRequestDto {
  @ApiProperty()
  @IsString()
  readonly token: string;
}
