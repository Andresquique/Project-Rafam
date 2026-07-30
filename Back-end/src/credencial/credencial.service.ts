import { Injectable } from '@nestjs/common';
import { UpdateCredencialDto } from './dto/update-credencial.dto';
import { Credencial } from './entities/credencial.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CredencialService {
  constructor(private credencial: Credencial) {}

  async update(id: number, dto: UpdateCredencialDto) {
    const data = dto;
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }
    return this.credencial.update(id, data);
  }

  async findByEmail(email: string) {
    return this.credencial.findByEmail(email);
  }

  async create(email: string, password: string) {
    return this.credencial.create(email, password);
  }
}
