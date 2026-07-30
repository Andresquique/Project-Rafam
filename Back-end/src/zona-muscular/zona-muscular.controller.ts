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
import { ZonaMuscularService } from './zona-muscular.service';
import { CreateZonaMuscularDto } from './dto/create-zona-muscular.dto';
import { UpdateZonaMuscularDto } from './dto/update-zona-muscular.dto';
import { JwtAuthGuard } from '../../src/auth/jwt/jwt.guard';
import { PoliciesGuard } from '../../src/casl/policies.guard';
import { Permission } from '../../src/casl/decorators/permissions.decorator';
import { Action } from '../casl/enum/action.enum';
import { ZonaMuscular } from '@prisma/client';

@Controller('zona-muscular')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class ZonaMuscularController {
  constructor(private readonly zonaMuscularService: ZonaMuscularService) {}

  @Post()
  @Permission(Action.Create, 'Zona_Muscular')
  async create(@Body() createZonaMuscularDto: CreateZonaMuscularDto) {
    return this.zonaMuscularService.create(createZonaMuscularDto);
  }

  @Get()
  @Permission(Action.Read, 'Zona_Muscular')
  async findAll(): Promise<ZonaMuscular[]> {
    return this.zonaMuscularService.findAll();
  }

  @Get(':id')
  @Permission(Action.Read, 'Zona_Muscular')
  async findOne(@Param('id') id: number): Promise<ZonaMuscular> {
    return this.zonaMuscularService.findOne(id);
  }

  @Patch(':id')
  @Permission(Action.Update, 'Zona_Muscular')
  async update(
    @Param('id') id: number,
    @Body() updateZonaMuscularDto: UpdateZonaMuscularDto,
  ): Promise<ZonaMuscular> {
    return this.zonaMuscularService.update(id, updateZonaMuscularDto);
  }

  @Delete(':id')
  @Permission(Action.Delete, 'Zona_Muscular')
  async remove(@Param('id') id: number): Promise<ZonaMuscular> {
    return this.zonaMuscularService.remove(id);
  }
}
