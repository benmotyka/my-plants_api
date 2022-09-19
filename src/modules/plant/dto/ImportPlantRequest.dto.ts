import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '@decorators/transform.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportPlantRequestDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly shareId: string;
}
