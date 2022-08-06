import { PlantResponse } from 'src/shared/interfaces/PlantResponse';

export class EditPlantResponseResponseDto {
  readonly plant: PlantResponse;

  constructor(plant: PlantResponse) {
    this.plant = plant;
  }
}
