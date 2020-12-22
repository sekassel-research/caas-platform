import { Injectable } from '@nestjs/common';
import { AuthConfig, Config, MongoConfig } from './config.interface';

@Injectable()
export class ConfigService {
  private readonly config: Config;

  constructor(env: any = { mongo: {}, auth: {} }) {
    // create auth config
    const auth: AuthConfig = {};
    auth.algorithms = ['RS256'];
    auth.issuer = process.env.AUTH_ISSUER || env.auth.issuer || 'https://avocado.uniks.de/auth/realms/InterconnectEU';
    auth.realm = process.env.AUTH_REALM || env.auth.realm || 'InterconnectEU';
    auth.resource = process.env.AUTH_RESOURCE || env.auth.resource || 'artifact-runner-service';
    auth.publicKey =
      process.env.PUBLIC_KEY || env.auth.publicKey ||
      '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyRyUXMLVQaDfRQrjIJlGs3+KsiOanLTWDhGoQkXO6Q1oumDfulr78NyyK/TC521di5E2qBDXm5V8qhTdxCigArNaDFTc/3HlbQ3NcYDn00Ob3qJmo0eMusLCrrRf0kTJJbZTRNt97DZnn+Ipn54Py30G2lp6gQxeBsiOBrH5fI9eDnyhuBE6hmSXBK9+g3dV+lA1TSfsAGAGPwsV//uw6rXTsCpYEAn+wruP3FwkPVEbpFu5S/dOOE5QJpuaOglDkBO7d0iCgYetMOIhzJEzGfFx127vVrfHN8XhAz6ef79uZYucIdxwKSfjeJOqYtcri0hU8ImoF0R4n26EIz5yiQIDAQAB\n-----END PUBLIC KEY-----';

    // create mongo config
    const mongo: MongoConfig = {};
    const user = process.env.MONGO_USER || env.mongo.user || '';
    const password = process.env.MONGO_PASSWORD || env.mongo.password || '';
    const credentials = user && password ? `${user}:${password}@` : '';
    const mongoHost = process.env.MONGO_HOST || env.mongo.host || 'localhost';
    const mongoPort = process.env.MONGO_PORT || env.mongo.port || '27017';
    const database = process.env.MONGO_DATABASE || env.mongo.database || '';
    mongo.uri = process.env.MONGO_URI || env.mongo.uri || `mongodb://${credentials}${mongoHost}:${mongoPort}/${database}`;

    this.config = {
      port: +process.env.PORT || env.port || 3000,
      prefix: process.env.PREFIX || env.prefix || '/api',
      auth,
      mongo,
    };
  }

  public getConfig(): Config {
    return this.config;
  }
}
