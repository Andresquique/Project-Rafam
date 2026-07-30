import { Module } from '@nestjs/common';
import { PerfilService } from './perfil.service';
import { PerfilController } from './perfil.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { CredencialModule } from 'src/credencial/credencial.module';
import { Perfil } from './entities/perfil.entity';

@Module({
  imports: [PrismaModule, AuthModule, CredencialModule],
  controllers: [PerfilController],
  providers: [PerfilService, Perfil],
})
export class PerfilModule {}
