export interface WateringData {
  [key: string]: Date[];
}

export class GetAllWateringsForPlantResponseDto {
  readonly waterings: WateringData;

  constructor(waterings: WateringData) {
    this.waterings = waterings;
  }
}
