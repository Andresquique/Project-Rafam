import { Module } from '@nestjs/common';
import { CredencialService } from './credencial.service';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { Credencial } from './entities/credencial.entity';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [CredencialService, Credencial],
  exports: [CredencialService, Credencial],
})
export class CredencialModule {}
