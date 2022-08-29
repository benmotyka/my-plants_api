import { ResponseType } from '@enums/ResponseType';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpsertSettingsResponseDto {
  @IsString()
  @ApiProperty({
    enum: ResponseType,
  })
  readonly status: string;

  constructor(status: string) {
    this.status = status;
  }
}
