import { ApiProperty } from '@nestjs/swagger';

export interface ImagesData {
  [key: string]: string[];
}

export class GetPlantImagesHistoryResponseDto {
  @ApiProperty()
  readonly imagesData: ImagesData;

  constructor(imagesData: ImagesData) {
    this.imagesData = imagesData;
  }
}
