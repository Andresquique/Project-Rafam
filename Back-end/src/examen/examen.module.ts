import { Module } from '@nestjs/common';
import { ExamenService } from './examen.service';
import { ExamenController } from './examen.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { PerfilService } from 'src/perfil/perfil.service';
import { Perfil } from 'src/perfil/entities/perfil.entity';
import { CredencialService } from 'src/credencial/credencial.service';
import { Credencial } from 'src/credencial/entities/credencial.entity';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ExamenController],
  providers: [
    ExamenService,
    PerfilService,
    Perfil,
    CredencialService,
    Credencial,
  ],
})
export class ExamenModule {}
