import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt/jwt.strategy';
import { Credencial } from 'src/credencial/entities/credencial.entity';
import { CredencialService } from 'src/credencial/credencial.service';
import { PrismaModule } from 'prisma/prisma.module';
import { MailModule } from 'src/mail/mail.module';
import { PasswordResetToken } from 'src/password-reset-token/entities/password-reset-token.entity';
import { PasswordResetTokenService } from 'src/password-reset-token/password-reset-token.service';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    PassportModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    Credencial,
    CredencialService,
    AuthService,
    JwtStrategy,
    PasswordResetToken,
    PasswordResetTokenService,
  ],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
