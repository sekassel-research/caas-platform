/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { Config, ConfigService } from '@caas/srv/config';

import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config: Config = app.get(ConfigService).getConfig();

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(config.prefix);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: config.kafka.clientId,
        brokers: config.kafka.brokerUris,
      },
      consumer: {
        groupId: `${config.kafka.clientId}-consumer`,
      }
    },
  });

  await app.startAllMicroservicesAsync();
  await app.listen(config.port);
}

bootstrap();
