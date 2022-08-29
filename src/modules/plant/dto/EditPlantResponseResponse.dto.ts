import { ApiProperty } from '@nestjs/swagger';
import { PlantResponse } from '@shared/interfaces/PlantResponse';

export class EditPlantResponseResponseDto {
  @ApiProperty()
  readonly plant: PlantResponse;

  constructor(plant: PlantResponse) {
    this.plant = plant;
  }
}
