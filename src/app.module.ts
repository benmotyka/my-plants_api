import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PlantModule } from './modules/plant/plant.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { WateringModule } from './modules/watering/watering.module';

@Module({
  imports: [
    UserModule,
    PlantModule,
    WateringModule,
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
