import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpsertSettingsRequestDto {
  @IsBoolean()
  @ApiProperty()
  readonly pushNotificationsEnabled: boolean;
}
