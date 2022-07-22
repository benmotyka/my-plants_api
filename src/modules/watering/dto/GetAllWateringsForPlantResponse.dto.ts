import { IsArray } from "class-validator";

export interface WateringData {
    [key: string]: string[]
}

export class GetAllWateringsForPlantResponseDto {
  @IsArray()
  readonly waterings: WateringData;

  constructor(waterings: WateringData) {
    this.waterings = waterings;
  }
}
