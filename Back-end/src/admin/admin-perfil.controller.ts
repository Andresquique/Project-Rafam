import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../src/auth/jwt/jwt.guard';
import { Permission } from '../../src/casl/decorators/permissions.decorator';
import { Action } from '../casl/enum/action.enum';
import { PoliciesGuard } from '../../src/casl/policies.guard';
import { UpdatePerfilDto } from '../../src/perfil/dto/update-perfil.dto';
import { PerfilService } from '../../src/perfil/perfil.service';
import { Perfil } from '@prisma/client';

@Controller('admin/perfil')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class AdminPerfilController {
  constructor(private readonly perfilService: PerfilService) {}

  @Get()
  @Permission(Action.Read, 'Perfil')
  async findAll(): Promise<Perfil[]> {
    return this.perfilService.findAll();
  }

  @Get(':id')
  @Permission(Action.Read, 'Perfil')
  async findOne(@Param('id') id: number): Promise<Perfil> {
    return this.perfilService.findOne(id);
  }

  @Patch(':id')
  @Permission(Action.Update, 'Perfil')
  async update(
    @Param('id') id: number,
    @Body() updatePerfilDto: UpdatePerfilDto,
  ): Promise<Perfil> {
    return this.perfilService.update(id, updatePerfilDto);
  }

  @Delete(':id')
  @Permission(Action.Delete, 'Perfil')
  async remove(@Param('id') id: number): Promise<Perfil> {
    return this.perfilService.remove(id);
  }
}
