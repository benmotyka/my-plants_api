import { Trim } from '@decorators/transform.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordRequestDto {
  @IsString()
  @MinLength(6)
  @Trim()
  @ApiProperty({
    example: 'oldPassword',
    minLength: 6,
  })
  readonly oldPassword: string;

  @IsString()
  @MinLength(6)
  @Trim()
  @ApiProperty({
    example: 'newPassword',
    minLength: 6,
  })
  readonly newPassword: string;
}
