import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { VideoService } from '../../src/video/video.service';
import { JwtAuthGuard } from '../../src/auth/jwt/jwt.guard';
import { PoliciesGuard } from '../../src/casl/policies.guard';
import { Permission } from '../../src/casl/decorators/permissions.decorator';
import { Action } from '../casl/enum/action.enum';
import { CreateVideoDto } from '../../src/video/dto/create-video.dto';
import { UpdateVideoDto } from '../../src/video/dto/update-video.dto';
import { Video } from '@prisma/client';

@Controller('admin/video')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class AdminVideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  @Permission(Action.Create, 'Video')
  async create(@Body() createVideoDto: CreateVideoDto): Promise<Video> {
    return this.videoService.create(createVideoDto);
  }

  @Get()
  @Permission(Action.Read, 'Video')
  async findAll(): Promise<Video[]> {
    return this.videoService.findAll();
  }

  @Get(':id')
  @Permission(Action.Read, 'Video')
  async findOne(@Param('id') id: number): Promise<Video> {
    return this.videoService.findOne(id);
  }

  @Patch(':id')
  @Permission(Action.Update, 'Video')
  async update(
    @Param('id') id: number,
    @Body() updateVideoDto: UpdateVideoDto,
  ): Promise<Video> {
    return this.videoService.update(id, updateVideoDto);
  }

  @Delete(':id')
  @Permission(Action.Delete, 'Video')
  async remove(@Param('id') id: number): Promise<Video> {
    return this.videoService.remove(id);
  }
}
