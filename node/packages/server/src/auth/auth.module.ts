import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from '@user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '@auth/strategies/jwt-refresh.strategy';
import { JWT_NAME } from '@auth/constants/auth.constant';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: JWT_NAME }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.access-token.secret'),
        signOptions: { expiresIn: `${configService.get('jwt.access-token.expiration-time')}s` },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
