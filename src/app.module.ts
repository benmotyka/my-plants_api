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
import { LoggerMiddleware } from '@middleware/logger';
import { UtilModule } from '@modules/util/util.module';
// import { WinstonModule } from 'nest-winston';
// import * as winston from 'winston';

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
    // WinstonModule.forRoot({
    //   transports: [new winston.transports.Console()],
    // }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    // .apply(BasicAuth)
    // .exclude({ path: 'info/patch-notes/(.*)', method: RequestMethod.ALL })
    // .forRoutes('*');
  }
}
