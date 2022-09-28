import { Module } from '@nestjs/common';
import { PlantController } from '@modules/plant/plant.controller';
import { InfoService } from './info.service';

@Module({
  controllers: [PlantController],
  providers: [InfoService],
})
export class InfoModule {}
