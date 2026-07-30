import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Perfil as PerfilP, Prisma } from '@prisma/client';

@Injectable()
export class Perfil {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(): Promise<PerfilP[]> {
    return this.prisma.perfil.findMany({
      include: { credencial: true, nivel_actual: true },
    });
  }

  async findOrThrow(id: number): Promise<PerfilP> {
    const perfil = await this.prisma.perfil.findUnique({
      where: { credencialesId: id },
      include: { credencial: true, nivel_actual: true },
    });
    if (!perfil) {
      throw new NotFoundException(`Perfil con id ${id} no encontrado`);
    }
    return perfil;
  }

  async update(id: number, data: Prisma.PerfilUpdateInput): Promise<PerfilP> {
    return this.prisma.perfil.update({
      where: { credencialesId: id },
      data: data,
      include: { credencial: true, nivel_actual: true },
    });
  }

  async updateNivel(id: number, nivelId: number) {
    return this.prisma.perfil.update({
      where: { credencialesId: id },
      data: {
        nivel_actual_id: nivelId,
        fecha_ultima_evaluacion: new Date(),
      },
      include: { credencial: true, nivel_actual: true },
    });
  }

  async delete(id: number): Promise<PerfilP> {
    return this.prisma.perfil.delete({ where: { credencialesId: id } });
  }
}
