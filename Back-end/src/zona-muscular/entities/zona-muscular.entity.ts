import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateZonaMuscularDto } from '../dto/create-zona-muscular.dto';
import { UpdateZonaMuscularDto } from '../dto/update-zona-muscular.dto';
import { ZonaMuscular as ZonaM } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
@Injectable()
export class ZonaMuscular {
  constructor(private readonly prisma: PrismaService) {}

  async create(createZonaMuscularDto: CreateZonaMuscularDto): Promise<ZonaM> {
    return this.prisma.zonaMuscular.create({ data: createZonaMuscularDto });
  }

  async findOrThrow(id: number): Promise<ZonaM> {
    const zona = await this.prisma.zonaMuscular.findUnique({
      where: { id },
    });

    if (!zona) {
      throw new NotFoundException(`La Zona Muscular con Id ${id} no existe`);
    }

    return zona;
  }

  async findMany(): Promise<ZonaM[]> {
    return this.prisma.zonaMuscular.findMany();
  }

  async update(
    id: number,
    updateZonaMuscularDto: UpdateZonaMuscularDto,
  ): Promise<ZonaM> {
    return this.prisma.zonaMuscular.update({
      where: { id },
      data: updateZonaMuscularDto,
    });
  }

  async delete(id: number): Promise<ZonaM> {
    return this.prisma.zonaMuscular.delete({
      where: { id },
    });
  }
}
