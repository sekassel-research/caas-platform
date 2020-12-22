/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';

import { Config, ConfigService } from '@caas/srv/config';

import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config: Config = app.get(ConfigService).getConfig();

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(config.prefix);
  
  await app.listen(config.port);
}

bootstrap();
