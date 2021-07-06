import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import helmet from 'helmet';
import morgan from 'morgan';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import defaultOptions from '@config/database/default';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { ProfileModule } from './profile/profile.module';
import { SharedModule } from '@shared/shared.module';
import { ArticleModule } from './article/article.module';
import configuration from '@config/configuration';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [configuration],
    }),
    TerminusModule,
    SequelizeModule.forRoot(defaultOptions),
    SharedModule,
    UserModule,
    AuthModule,
    ProfileModule,
    ArticleModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        helmet({
          hsts: false,
          contentSecurityPolicy: false,
        }),
        helmet.hidePoweredBy(),
        morgan('tiny'),
      )
      .forRoutes('*');
  }
}
