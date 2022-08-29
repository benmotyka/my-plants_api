import { ApiProperty } from '@nestjs/swagger';
import { PlantResponse } from '@shared/interfaces/PlantResponse';

export class CreatePlantResponseResponseDto {
  @ApiProperty()
  readonly plant: PlantResponse;

  constructor(plant: PlantResponse) {
    this.plant = plant;
  }
}
