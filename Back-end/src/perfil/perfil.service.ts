import { Injectable } from '@nestjs/common';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { Perfil } from './entities/perfil.entity';
import { Perfil as PerfilP } from '@prisma/client';
import { CredencialService } from '../../src/credencial/credencial.service';

@Injectable()
export class PerfilService {
  constructor(
    private perfil: Perfil,
    private credencial: CredencialService,
  ) {}

  async findAll(): Promise<PerfilP[]> {
    return this.perfil.findMany();
  }

  async findOne(id: number): Promise<PerfilP> {
    return this.perfil.findOrThrow(id);
  }

  async update(id: number, data: UpdatePerfilDto): Promise<PerfilP> {
    await this.perfil.findOrThrow(id);
    const { credencial, ...perfilData } = data;

    if (credencial) {
      await this.credencial.update(id, credencial);
    }
    return this.perfil.update(id, perfilData);
  }

  async updateNivel(id: number, nivelId: number) {
    return this.perfil.updateNivel(id, nivelId);
  }

  async remove(id: number): Promise<PerfilP> {
    await this.perfil.findOrThrow(id);
    return this.perfil.delete(id);
  }
}
