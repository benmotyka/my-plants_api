import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class WaterPlantResponseDto {
  @IsString()
  @ApiProperty()
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
