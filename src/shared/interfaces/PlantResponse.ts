import { Watering } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class PlantResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  imgSrc?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  shareId: string;

  @ApiProperty()
  latestWatering?: Watering;

  @ApiProperty()
  wateringReminderFrequency?: number;
}
