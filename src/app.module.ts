import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PlantModule } from '@modules/plant/plant.module';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { UserModule } from '@modules/user/user.module';
import { WateringModule } from '@modules/watering/watering.module';
import { VerificationCodeModule } from '@modules/verificationCode/verificationCode.module';

@Module({
  imports: [
    UserModule,
    VerificationCodeModule,
    PlantModule,
    WateringModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
