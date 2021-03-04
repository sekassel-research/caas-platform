import { DynamicModule, Global, Module } from '@nestjs/common';

import { ConfigService } from './config.service';
import { Environment } from './environment.interface';

@Global()
@Module({})
export class ConfigModule {
  static forRoot(env: Environment = { mongo: {}, auth: {}, kafka: {} }): DynamicModule {
    const configService = new ConfigService(env);
    const configProviders = [
      {
        provide: 'CONFIG',
        useValue: configService.getConfig(),
      },
      {
        provide: ConfigService,
        useValue: configService,
      },
    ];
    return {
      module: ConfigModule,
      providers: configProviders,
      exports: configProviders,
    };
  }
}
