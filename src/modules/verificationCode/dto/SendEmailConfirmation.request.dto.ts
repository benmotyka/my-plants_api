import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendEmailConfirmationRequestDto {
  @IsEmail()
  @ApiProperty()
  readonly email: string;
}
