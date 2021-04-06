import { Injectable } from '@nestjs/common';

import { AuthConfig, Config, KafkaConfig, MongoConfig } from './config.interface';
import { Environment } from './environment.interface';

@Injectable()
export class ConfigService {
  private readonly config: Config;

  constructor(env: Environment = { mongo: {}, auth: {}, kafka: {} }) {
    // create auth config
    const auth: AuthConfig = {};
    auth.algorithms = ['RS256'];
    auth.issuer = process.env.AUTH_ISSUER || env.auth.issuer || 'https://se.uniks.de/auth/realms/InterconnectEU';
    auth.realm = process.env.AUTH_REALM || env.auth.realm || 'InterconnectEU';
    auth.resource = process.env.AUTH_RESOURCE || env.auth.resource || '';
    auth.publicKey =
      process.env.PUBLIC_KEY ||
      env.auth.publicKey ||
      '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAubdShzQB/u2FH4uafpw969VnL5aTBQ13gopiTl3rbsqTGjv/tcQT/oIaGrTMsDvgXQJDihjiUqaEwHJlkSHEQxWkW1ZoSi5S5kospc5sHz2Z41a2cL7godUU5GKdLWXf5/ar2LvRPoU6ElmnY19co9b+uAsbIYGJ+BA+DebxB/qj+6RQrWS6fg1KKIawOIz2OH1idRCXm+Lz8PEOk1cLvj4nLN4OLOPmaSE3Y3rFjfDyB07CgA44jGYAtvO96p3op9D3MQV4bgFUmJIQmjDZRZfZzpaMXXtI+gEge7gBrBFgXvbYsQGuAryutNilCcgphDsIaNzVERwE3799ZVW8FQIDAQAB\n-----END PUBLIC KEY-----';

    // create mongo config
    const mongo: MongoConfig = {};
    const user = process.env.MONGO_USER || env.mongo.user || '';
    const password = process.env.MONGO_PASSWORD || env.mongo.password || '';
    const credentials = user && password ? `${user}:${password}@` : '';
    const mongoHost = process.env.MONGO_HOST || env.mongo.host || 'localhost';
    const mongoPort = process.env.MONGO_PORT || env.mongo.port || '27017';
    const database = process.env.MONGO_DATABASE || env.mongo.database || '';
    mongo.uri = process.env.MONGO_URI || env.mongo.uri || `mongodb://${credentials}${mongoHost}:${mongoPort}/${database}`;

    // create kafka config
    const kafka: KafkaConfig = {};
    kafka.clientId = process.env.KAFKA_CLIENT_ID || env.kafka.clientId || '';
    const kafkaHost = process.env.KAFKA_HOST || env.kafka.host || 'localhost';
    const kafkaPort = process.env.KAFKA_PORT || env.kafka.port || '9092';
    kafka.brokerUris = [`${kafkaHost}:${kafkaPort}`];

    this.config = {
      port: +process.env.PORT || env.port || 3000,
      prefix: process.env.PREFIX || env.prefix || '/api',
      auth,
      mongo,
      kafka,
    };
  }

  public getConfig(): Config {
    return this.config;
  }
}
