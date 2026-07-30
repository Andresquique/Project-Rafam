import { Module } from '@nestjs/common';
import { NivelService } from './nivel.service';
import { NivelController } from './nivel.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { CaslModule } from 'src/casl/casl.module';
import { Nivel } from './entities/nivel.entity';

@Module({
  imports: [PrismaModule, AuthModule, CaslModule],
  controllers: [NivelController],
  providers: [NivelService, Nivel],
})
export class NivelModule {}
