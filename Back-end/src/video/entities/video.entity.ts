import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateVideoDto } from '../dto/update-video.dto';
import { CreateVideoDto } from '../dto/create-video.dto';
import { Prisma, Video as VideoP } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class Video {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVideoDto: CreateVideoDto): Promise<VideoP> {
    return this.prisma.video.create({
      data: createVideoDto,
    });
  }

  async findQuery(where: Prisma.VideoWhereInput): Promise<VideoP[]> {
    return this.prisma.video.findMany({ where });
  }

  async findMany(): Promise<VideoP[]> {
    return this.prisma.video.findMany();
  }

  async findOrThrow(id: number): Promise<VideoP> {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });
    if (!video) {
      throw new NotFoundException(`Video con id ${id} no encontrado`);
    }
    return video;
  }

  async update(id: number, updateVideoDto: UpdateVideoDto): Promise<VideoP> {
    return this.prisma.video.update({
      where: { id },
      data: updateVideoDto,
    });
  }

  async delete(id: number): Promise<VideoP> {
    return this.prisma.video.delete({ where: { id } });
  }
}
