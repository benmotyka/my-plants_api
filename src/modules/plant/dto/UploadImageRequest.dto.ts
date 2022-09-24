import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class UploadImageRequestDto {
  @IsUUID()
  @ApiProperty()
  readonly plantId: string;

  @IsString()
  @ApiProperty()
  readonly image: string;
}
