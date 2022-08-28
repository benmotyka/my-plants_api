import { IsString, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

import { Trim } from '@decorators/transform.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDto {
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  @Trim()
  @Transform((name) => name.value.toLowerCase())
  @ApiProperty({ example: 'username' })
  readonly username: string;

  @IsString()
  @MinLength(6)
  @Trim()
  @ApiProperty({ example: 'password' })
  readonly password: string;
}
