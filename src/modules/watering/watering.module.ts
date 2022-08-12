import { Module } from '@nestjs/common';

import { WateringController } from '@modules/watering/watering.controller';
import { WateringService } from '@modules/watering/watering.service';

@Module({
  controllers: [WateringController],
  providers: [WateringService],
})
export class WateringModule {}
