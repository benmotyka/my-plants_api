import { PlantResponse } from '@shared/interfaces/PlantResponse';

export class CreatePlantResponseResponseDto {
  readonly plant: PlantResponse;

  constructor(plant: PlantResponse) {
    this.plant = plant;
  }
}
