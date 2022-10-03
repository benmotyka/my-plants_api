import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PlantModule } from '@modules/plant/plant.module';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { UserModule } from '@modules/user/user.module';
import { WateringModule } from '@modules/watering/watering.module';
import { InfoModule } from '@modules/info/info.module';
import { BasicAuth } from '@middleware/basic-auth';
@Module({
  imports: [
    UserModule,
    PlantModule,
    WateringModule,
    PrismaModule,
    InfoModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BasicAuth)
      .exclude({ path: 'info/patch-notes/(.*)', method: RequestMethod.ALL })
      .forRoutes('*');
  }
}
