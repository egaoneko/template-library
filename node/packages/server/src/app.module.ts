import { CacheModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import helmet from 'helmet';
import morgan from 'morgan';
import { APP_GUARD } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';

import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import defaultOptions from 'src/config/database/default';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SharedModule } from 'src/shared/shared.module';
import configuration from 'src/config/configuration';

import { ProfileModule } from './profile/profile.module';
import { ArticleModule } from './article/article.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
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
    CacheModule.register({
      ttl: 5, // seconds
      max: 10, // maximum number of items in cache
    }),
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
