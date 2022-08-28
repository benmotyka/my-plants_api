import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { json } from 'body-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  HttpStatus,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      dismissDefaultMessages: true,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000, // minutes
      max: 100, // limit each IP to requests per windowMs
    }),
  );
  app.use(helmet());
  app.use(json({ limit: '20mb' }));

  const config = new DocumentBuilder().setTitle('My Plants API').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
