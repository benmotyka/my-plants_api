import { PlantResponse } from "src/shared/interfaces/PlantResponse.interface";

export class CreatePlantResponseResponseDto {
  readonly plant: PlantResponse;

  constructor(plant: PlantResponse) {
    this.plant = plant;
  }
}
