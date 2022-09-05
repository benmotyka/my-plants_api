import { IsArray } from 'class-validator';

import { PlantResponse } from '@shared/interfaces/PlantResponse';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllPlantsResponseDto {
  @IsArray()
  @ApiProperty({
    type: PlantResponse,
  })
  readonly plants: PlantResponse[];

  constructor(plants: PlantResponse[]) {
    this.plants = plants;
  }
}
