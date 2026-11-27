import { Module } from '@nestjs/common';
import { PasswordResetTokenService } from './password-reset-token.service';
import { PrismaModule } from 'prisma/prisma.module';
import { PasswordResetToken } from './entities/password-reset-token.entity';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [PasswordResetTokenService, PasswordResetToken],
  exports: [PasswordResetTokenService],
})
export class PasswordResetTokenModule {}
