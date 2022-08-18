import { IsBoolean } from 'class-validator';

export class UpsertSettingsRequestDto {
  @IsBoolean()
  readonly pushNotificationsEnabled: boolean;
}
