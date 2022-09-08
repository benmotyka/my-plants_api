import { ResponseType } from '@enums/ResponseType';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendEmailConfirmationResponseDto {
  @IsString()
  @ApiProperty({
    enum: ResponseType,
  })
  readonly status: ResponseType;

  constructor(status: ResponseType) {
    this.status = status;
  }
}
