import { Module } from '@nestjs/common';
import { ZonaMuscularService } from './zona-muscular.service';
import { ZonaMuscularController } from './zona-muscular.controller';
import { CaslModule } from 'src/casl/casl.module';
import { AuthModule } from 'src/auth/auth.module';
import { ZonaMuscular } from './entities/zona-muscular.entity';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [CaslModule, AuthModule, PrismaModule],
  controllers: [ZonaMuscularController],
  providers: [ZonaMuscularService, ZonaMuscular],
})
export class ZonaMuscularModule {}
