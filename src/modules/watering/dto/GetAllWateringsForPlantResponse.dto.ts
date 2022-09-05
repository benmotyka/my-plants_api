import { ApiProperty } from '@nestjs/swagger';

export interface WateringData {
  [key: string]: Date[];
}

export class GetAllWateringsForPlantResponseDto {
  @ApiProperty()
  readonly waterings: WateringData;

  constructor(waterings: WateringData) {
    this.waterings = waterings;
  }
}
