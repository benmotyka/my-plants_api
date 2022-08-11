import { Module } from '@nestjs/common';
import { AttachmentModule } from '../attachment/attachment.module';
import { RemindingModule } from '../reminding/reminding.module';
import { PlantController } from './plant.controller';
import { PlantService } from './plant.service';

@Module({
  imports: [AttachmentModule, RemindingModule],
  controllers: [PlantController],
  providers: [PlantService],
})
export class PlantModule {}
