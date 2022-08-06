import { Module } from '@nestjs/common';
import { AttachmentModule } from '../attachment/attachment.module';
import { AttachmentService } from '../attachment/attachment.service';
import { RemindingModule } from '../reminding/reminding.module';
import { RemindingService } from '../reminding/reminding.service';
import { PlantController } from './plant.controller';
import { PlantService } from './plant.service';

@Module({
  imports: [AttachmentModule, RemindingModule],
  controllers: [PlantController],
  providers: [PlantService, AttachmentService, RemindingService],
})
export class PlantModule {}
