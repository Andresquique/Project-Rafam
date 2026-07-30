import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { FilterVideoDto } from './dto/filter-video.dto';
import { Video } from './entities/video.entity';
import { Prisma, Video as VideoP } from '@prisma/client';
import { ZonaMuscularService } from '../../src/zona-muscular/zona-muscular.service';
import { NivelService } from '../../src/nivel/nivel.service';

@Injectable()
export class VideoService {
  constructor(
    private video: Video,
    private zona: ZonaMuscularService,
    private nivel: NivelService,
  ) {}

  async create(createVideoDto: CreateVideoDto): Promise<VideoP> {
    const { zona_muscular_id, nivel_id } = createVideoDto;
    await Promise.all([
      this.zona.findOne(zona_muscular_id),
      this.nivel.findOne(nivel_id),
    ]);
    return this.video.create(createVideoDto);
  }

  async findQuery(
    nivelUsuario: number,
    query: FilterVideoDto,
  ): Promise<VideoP[]> {
    const { nivel_id, zona_muscular_id, nombre, descripcion } = query;

    let nivelFilter: Prisma.IntFilter;

    if (nivel_id !== undefined) {
      if (nivel_id > nivelUsuario) {
        throw new BadRequestException('No alcanzaste esta dificultad.');
      }
      nivelFilter = { equals: nivel_id };
    } else {
      nivelFilter = { lte: nivelUsuario };
    }

    const where = {
      nivel_id: nivelFilter,
      ...(zona_muscular_id && { zona_muscular_id }),
      ...(nombre && {
        nombre: {
          contains: nombre,
          mode: 'insensitive' as const,
        },
      }),
      ...(descripcion && {
        descripcion: {
          contains: descripcion,
          mode: 'insensitive' as const,
        },
      }),
    };
    return this.video.findQuery(where);
  }

  async findAll(): Promise<VideoP[]> {
    return this.video.findMany();
  }

  async findOne(id: number): Promise<VideoP> {
    return this.video.findOrThrow(id);
  }

  async update(id: number, updateVideoDto: UpdateVideoDto): Promise<VideoP> {
    await this.video.findOrThrow(id);

    const { nivel_id, zona_muscular_id } = updateVideoDto;

    if (nivel_id !== undefined) {
      await this.nivel.findOne(nivel_id);
    }
    if (zona_muscular_id !== undefined) {
      await this.zona.findOne(zona_muscular_id);
    }

    return this.video.update(id, updateVideoDto);
  }

  async remove(id: number): Promise<VideoP> {
    await this.video.findOrThrow(id);
    return this.video.delete(id);
  }
}
