import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PlantModule } from '@modules/plant/plant.module';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { UserModule } from '@modules/user/user.module';
import { WateringModule } from '@modules/watering/watering.module';
import { InfoModule } from '@modules/info/info.module';
import { LoggerMiddleware } from '@middleware/logger';
import { UtilModule } from '@modules/util/util.module';
import { NotifyModule } from '@modules/notify/notify.module'
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
    UtilModule,
    NotifyModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
