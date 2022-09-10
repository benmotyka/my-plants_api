import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BasicAuth } from '@middleware/basic-auth';
import { AuthModule } from '@modules/auth/auth.module';
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
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BasicAuth).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
