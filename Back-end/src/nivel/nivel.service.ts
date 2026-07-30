import { Injectable } from '@nestjs/common';
import { CreateNivelDto } from './dto/create-nivel.dto';
import { UpdateNivelDto } from './dto/update-nivel.dto';
import { Nivel } from './entities/nivel.entity';
import { Nivel as NivelP } from '@prisma/client';

@Injectable()
export class NivelService {
  constructor(private nivel: Nivel) {}

  async create(createNivelDto: CreateNivelDto): Promise<NivelP> {
    return this.nivel.create(createNivelDto);
  }

  async findAll(): Promise<NivelP[]> {
    return this.nivel.findMany();
  }

  async findOne(id: number): Promise<NivelP> {
    return this.nivel.findOrThrow(id);
  }

  async update(id: number, updateNivelDto: UpdateNivelDto): Promise<NivelP> {
    await this.nivel.findOrThrow(id);
    return this.nivel.update(id, updateNivelDto);
  }

  async remove(id: number): Promise<NivelP> {
    await this.nivel.findOrThrow(id);
    return this.nivel.delete(id);
  }
}
