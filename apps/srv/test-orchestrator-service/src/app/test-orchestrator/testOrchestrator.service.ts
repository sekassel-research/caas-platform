import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class TestOrchestratorService {

  constructor(@Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka) {}

  getData(): { message: string } {
    return { message: 'Welcome to srv/test-orchestrator-service!' };
  }
}
