import { IsArray } from 'class-validator';

import { PlantResponse } from '@shared/interfaces/PlantResponse';

export class GetAllPlantsResponseDto {
  @IsArray()
  readonly plants: PlantResponse[];

  constructor(plants: PlantResponse[]) {
    this.plants = plants;
  }
}
