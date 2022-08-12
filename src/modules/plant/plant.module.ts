import { Module } from '@nestjs/common';
import { AttachmentModule } from '@modules/attachment/attachment.module';
import { RemindingModule } from '@modules/reminding/reminding.module';
import { PlantController } from '@modules/plant/plant.controller';
import { PlantService } from '@modules/plant/plant.service';

@Module({
  imports: [AttachmentModule, RemindingModule],
  controllers: [PlantController],
  providers: [PlantService],
})
export class PlantModule {}
