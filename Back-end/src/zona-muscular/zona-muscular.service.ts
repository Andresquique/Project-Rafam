import { Injectable } from '@nestjs/common';
import { CreateZonaMuscularDto } from './dto/create-zona-muscular.dto';
import { UpdateZonaMuscularDto } from './dto/update-zona-muscular.dto';
import { ZonaMuscular } from './entities/zona-muscular.entity';
import { ZonaMuscular as ZonaM } from '@prisma/client';

@Injectable()
export class ZonaMuscularService {
  constructor(private zona: ZonaMuscular) {}

  async create(createZonaMuscularDto: CreateZonaMuscularDto) {
    return this.zona.create(createZonaMuscularDto);
  }

  async findAll(): Promise<ZonaM[]> {
    return this.zona.findMany();
  }

  async findOne(id: number): Promise<ZonaM> {
    return this.zona.findOrThrow(id);
  }

  async update(
    id: number,
    updateZonaMuscularDto: UpdateZonaMuscularDto,
  ): Promise<ZonaM> {
    await this.zona.findOrThrow(id);
    return this.zona.update(id, updateZonaMuscularDto);
  }

  async remove(id: number): Promise<ZonaM> {
    await this.zona.findOrThrow(id);
    return this.zona.delete(id);
  }
}
