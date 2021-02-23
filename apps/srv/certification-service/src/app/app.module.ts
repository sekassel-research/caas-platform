import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthMiddleware } from '@caas/srv/auth';
import { ConfigModule, ConfigService } from '@caas/srv/config';

import { CertificateModule } from './certificate';
import { environment } from '../environments/environment';

@Module({
  imports: [
    CertificateModule,
    ConfigModule.forRoot(environment),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        publicKey: configService.getConfig().auth.publicKey,
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getConfig().mongo.uri,
        useCreateIndex: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
