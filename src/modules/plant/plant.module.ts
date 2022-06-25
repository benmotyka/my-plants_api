import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlantController } from './plant.controller';
import { PlantService } from './plant.service';

@Module({
  controllers: [PlantController],
  providers: [PlantService, PrismaService],
})
export class PlantModule {}
