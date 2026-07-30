import { PrismaService } from '../../../prisma/prisma.service';
import { CreateNivelDto } from '../dto/create-nivel.dto';
import { UpdateNivelDto } from '../dto/update-nivel.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Nivel as NivelP } from '@prisma/client';

@Injectable()
export class Nivel {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNivelDto: CreateNivelDto): Promise<NivelP> {
    return this.prisma.nivel.create({
      data: createNivelDto,
    });
  }

  async findMany(): Promise<NivelP[]> {
    return this.prisma.nivel.findMany();
  }

  async findOrThrow(id: number): Promise<NivelP> {
    const nivel = await this.prisma.nivel.findUnique({
      where: { id },
    });
    if (!nivel) {
      throw new NotFoundException(`Nivel con id ${id} no encontrada`);
    }
    return nivel;
  }

  async update(id: number, updateNivelDto: UpdateNivelDto): Promise<NivelP> {
    return this.prisma.nivel.update({
      where: { id },
      data: updateNivelDto,
    });
  }

  async delete(id: number): Promise<NivelP> {
    return this.prisma.nivel.delete({
      where: { id },
    });
  }
}
