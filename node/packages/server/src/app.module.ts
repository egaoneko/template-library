import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import helmet from 'helmet';
import morgan from 'morgan';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import postgresOptions from '@config/database/postgres';

@Module({
  imports: [ConfigModule.forRoot(), SequelizeModule.forRoot(postgresOptions), UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(helmet(), morgan('tiny')).forRoutes('*');
  }
}
