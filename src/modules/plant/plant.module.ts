import { Module } from '@nestjs/common';
import { AttachmentModule } from '@modules/attachment/attachment.module';
import { RemindingModule } from '@modules/reminding/reminding.module';
import { PlantController } from '@modules/plant/plant.controller';
import { PlantService } from '@modules/plant/plant.service';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [AttachmentModule, RemindingModule, UserModule],
  controllers: [PlantController],
  providers: [PlantService],
})
export class PlantModule {}
