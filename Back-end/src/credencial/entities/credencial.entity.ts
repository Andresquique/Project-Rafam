import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Credencial {
  constructor(private readonly prisma: PrismaService) {}

  async update(id: number, data: Prisma.CredencialUpdateInput) {
    return this.prisma.credencial.update({
      where: { id },
      data,
    });
  }

  async create(email: string, password: string) {
    return this.prisma.credencial.create({
      data: {
        email,
        password,
        perfil: {
          create: {
            nivel_actual_id: 0,
          },
        },
      },
      include: { perfil: true },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.credencial.findUnique({
      where: { email },
      include: { perfil: true },
    });
  }
}
