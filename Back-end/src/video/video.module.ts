import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { ZonaMuscularService } from 'src/zona-muscular/zona-muscular.service';
import { ZonaMuscular } from 'src/zona-muscular/entities/zona-muscular.entity';
import { Video } from './entities/video.entity';
import { NivelService } from 'src/nivel/nivel.service';
import { Nivel } from 'src/nivel/entities/nivel.entity';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [VideoController],
  providers: [
    VideoService,
    ZonaMuscularService,
    ZonaMuscular,
    Video,
    NivelService,
    Nivel,
  ],
  exports: [VideoService],
})
export class VideoModule {}
