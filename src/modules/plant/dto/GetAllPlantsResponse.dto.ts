import { IsArray } from "class-validator";
import { PlantResponse } from "src/shared/interfaces/PlantResponse.interface";

export class GetAllPlantsResponseDto {
  @IsArray()
  readonly plants: PlantResponse[];

  constructor(plants: PlantResponse[]) {
    this.plants = plants;
  }
}
