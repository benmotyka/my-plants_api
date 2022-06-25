import { Module } from '@nestjs/common';
import { PlantModule } from './modules/plant/plant.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule, PlantModule],
})
export class AppModule {}
