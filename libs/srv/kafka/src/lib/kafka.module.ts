import { DynamicModule, Global, Module } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

import { ConfigService } from '@caas/srv/config';

@Global()
@Module({})
export class KafkaModule {
  static forRootAsync(): DynamicModule {
    const kafkaProvider = {
      provide: 'KAFKA_SERVICE',
      useFactory: async (configService: ConfigService) => {
        const kafkaConfig = configService.getConfig().kafka;
        const clientProxy: ClientProxy = ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: kafkaConfig.clientId,
              brokers: kafkaConfig.brokerUris,
            },
            consumer: {
              groupId: `${kafkaConfig.clientId}-consumer`,
            },
          },
        });
        await clientProxy.connect();
        return clientProxy;
      },
      inject: [ConfigService],
    };

    return {
      module: KafkaModule,
      providers: [kafkaProvider],
      exports: [kafkaProvider],
    };
  }
}
