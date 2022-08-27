import { Trim } from '@decorators/transform.decorator';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordRequestDto {
  @IsString()
  @MinLength(6)
  @Trim()
  readonly oldPassword: string;

  @IsString()
  @MinLength(6)
  @Trim()
  readonly newPassword: string;
}
