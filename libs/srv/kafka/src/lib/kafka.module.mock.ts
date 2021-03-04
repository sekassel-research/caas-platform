import { DynamicModule, Global, Module } from '@nestjs/common';
import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';

class KafkaProxyMock extends ClientProxy {
  connect(): Promise<void> {
    return;
  }
  close(): void {
    return;
  }
  publish(packet: ReadPacket, callback: (packet: WritePacket) => void): () => void {
    callback({});
    return;
  }
  dispatchEvent<T = unknown>(): Promise<T> {
    return;
  }
}

@Global()
@Module({})
export class KafkaModuleMock {
  static forRootAsync(): DynamicModule {
    const kafkaMockProvider = {
      provide: 'KAFKA_SERVICE',
      useFactory: async () => {
        return new KafkaProxyMock();
      },
    };

    return {
      module: KafkaModuleMock,
      providers: [kafkaMockProvider],
      exports: [kafkaMockProvider],
    };
  }
}
