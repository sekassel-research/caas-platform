import { Transport } from '@nestjs/microservices';

const PATTERN_METADATA = 'microservices:pattern';
const TRANSPORT_METADATA = 'microservices:transport';
const PATTERN_HANDLER_METADATA = 'microservices:handler_type';

export const KafkaTopic = (topicName?: string): MethodDecorator => {
  // eslint-disable-next-line
  return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(PATTERN_METADATA, topicName, descriptor.value);
    Reflect.defineMetadata(PATTERN_HANDLER_METADATA, 2, descriptor.value);
    Reflect.defineMetadata(TRANSPORT_METADATA, Transport.KAFKA, descriptor.value);
    return descriptor;
  };
};
