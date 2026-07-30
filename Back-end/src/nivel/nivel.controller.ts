import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NivelService } from './nivel.service';
import { CreateNivelDto } from './dto/create-nivel.dto';
import { UpdateNivelDto } from './dto/update-nivel.dto';
import { JwtAuthGuard } from '../../src/auth/jwt/jwt.guard';
import { PoliciesGuard } from '../../src/casl/policies.guard';
import { Permission } from '../../src/casl/decorators/permissions.decorator';
import { Action } from '../casl/enum/action.enum';
import { Nivel } from '@prisma/client';

@Controller('nivel')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class NivelController {
  constructor(private readonly nivelService: NivelService) {}

  @Post()
  @Permission(Action.Create, 'Nivel')
  async create(@Body() createNivelDto: CreateNivelDto): Promise<Nivel> {
    return this.nivelService.create(createNivelDto);
  }

  @Get()
  @Permission(Action.Read, 'Nivel')
  async findAll(): Promise<Nivel[]> {
    return this.nivelService.findAll();
  }

  @Get(':id')
  @Permission(Action.Read, 'Nivel')
  async findOne(@Param('id') id: number): Promise<Nivel> {
    return this.nivelService.findOne(id);
  }

  @Patch(':id')
  @Permission(Action.Update, 'Nivel')
  async update(
    @Param('id') id: number,
    @Body() updateNivelDto: UpdateNivelDto,
  ): Promise<Nivel> {
    return this.nivelService.update(id, updateNivelDto);
  }

  @Delete(':id')
  @Permission(Action.Delete, 'Nivel')
  async remove(@Param('id') id: number): Promise<Nivel> {
    return this.nivelService.remove(id);
  }
}
