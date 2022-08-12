import { IsString, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

import { Trim } from '@decorators/transform.decorator';

export class RegisterRequestDto {
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  @Trim()
  @Transform((name) => name.value.toLowerCase())
  readonly username: string;

  @IsString()
  @MinLength(6)
  @Trim()
  readonly password: string;
}
