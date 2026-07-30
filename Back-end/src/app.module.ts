import { Module } from '@nestjs/common';
import { PerfilModule } from './perfil/perfil.module';
import { CredencialModule } from './credencial/credencial.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { NivelModule } from './nivel/nivel.module';
import { ZonaMuscularModule } from './zona-muscular/zona-muscular.module';
import { VideoModule } from './video/video.module';
import { ExamenModule } from './examen/examen.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    AuthModule,
    PerfilModule,
    CredencialModule,
    NivelModule,
    ZonaMuscularModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    VideoModule,
    ExamenModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
