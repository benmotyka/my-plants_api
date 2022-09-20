import { IsString } from 'class-validator';
import { Trim } from '@decorators/transform.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportPlantRequestDto {
  @Trim()
  @IsString()
  @ApiProperty()
  readonly shareId: string;
}
