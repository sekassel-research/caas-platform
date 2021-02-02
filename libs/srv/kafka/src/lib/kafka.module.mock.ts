import { DynamicModule, Global, Module } from '@nestjs/common';
import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';

class KafkaProxyMock extends ClientProxy {
  connect(): Promise<any> {
    return;
  }
  close(): any {
    return;
  }
  publish(packet: ReadPacket, callback: (packet: WritePacket) => void): any {
    return;
  }
  dispatchEvent<T = any>(packet: ReadPacket): Promise<T> {
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
