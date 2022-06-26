import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PlantModule } from './modules/plant/plant.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule, PlantModule, AuthModule],
})
export class AppModule {}
