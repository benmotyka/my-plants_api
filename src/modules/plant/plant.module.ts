import { Module } from '@nestjs/common';
import { PlantController } from './plant.controller';
import { PlantService } from './plant.service';

@Module({
  controllers: [PlantController],
  providers: [PlantService],
})
export class PlantModule {}
