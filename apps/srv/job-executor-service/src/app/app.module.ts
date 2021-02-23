import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthMiddleware } from '@caas/srv/auth';
import { ConfigModule, ConfigService } from '@caas/srv/config';
import { KafkaModule } from '@caas/srv/kafka';

import { JobExecutorModule } from './job-executor';
import { JobExecutorController } from './job-executor/jobExecutor.controller';
import { JobExecutorService } from './job-executor/jobExecutor.service';
import { environment } from '../environments/environment';

@Module({
  imports: [
    JobExecutorModule,
    ConfigModule.forRoot(environment),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        publicKey: configService.getConfig().auth.publicKey,
      }),
    }),
    KafkaModule.forRootAsync(),
  ],
  controllers: [JobExecutorController],
  providers: [JobExecutorService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
