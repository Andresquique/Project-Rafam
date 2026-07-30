import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { VideoService } from './video.service';
import { JwtAuthGuard } from '../../src/auth/jwt/jwt.guard';
import { FilterVideoDto } from './dto/filter-video.dto';
import { CurrentUser } from '../../src/auth/jwt/decorator/current-user.decorator';
import { JwtPayload } from '../../src/auth/jwt/jwt.payload';
import { Video } from '@prisma/client';

@Controller('video')
@UseGuards(JwtAuthGuard)
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  async findQuery(
    @CurrentUser() user: JwtPayload,
    @Query() query: FilterVideoDto,
  ): Promise<Video[]> {
    return this.videoService.findQuery(user.nivel_actual_id, query);
  }
}
