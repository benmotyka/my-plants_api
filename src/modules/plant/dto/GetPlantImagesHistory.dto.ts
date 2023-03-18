import { ApiProperty } from '@nestjs/swagger';

interface ImageData {
  id: string;
  url: string;
}
export interface ImagesData {
  [key: string]: ImageData[];
}

export class GetPlantImagesHistoryResponseDto {
  @ApiProperty()
  readonly imagesData: ImagesData;

  constructor(imagesData: ImagesData) {
    this.imagesData = imagesData;
  }
}
