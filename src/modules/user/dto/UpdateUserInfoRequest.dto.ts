import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserInfoRequestDto {
  @ApiProperty({
    description: 'Device locale, e.g. en-US',
  })
  @IsString()
  @IsOptional()
  readonly deviceLanguage?: string;

  @ApiProperty({
    description: 'Push notification token',
  })
  @IsString()
  @IsOptional()
  readonly pushNotificationToken?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly deviceInfo?: string;
}
