import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthMiddleware } from '@caas/srv/auth';
import { ConfigModule, ConfigService } from '@caas/srv/config';
import { KafkaModule } from '@caas/srv/kafka';

import { TestOrchestratorController, TestOrchestratorModule, TestOrchestratorService } from './test-orchestrator';
import { environment } from '../environments/environment';

@Module({
  imports: [
    TestOrchestratorModule,
    ConfigModule.forRoot(environment),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        publicKey: configService.getConfig().auth.publicKey,
      }),
    }),
    KafkaModule.forRootAsync(),
  ],
  controllers: [TestOrchestratorController],
  providers: [TestOrchestratorService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
