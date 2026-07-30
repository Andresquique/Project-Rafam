import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ExamenService } from './examen.service';
import { ResultadoExamenDto } from './dto/resultado-examen.dto';
import { CurrentUser } from '../../src/auth/jwt/decorator/current-user.decorator';
import { JwtPayload } from '../../src/auth/jwt/jwt.payload';
import { JwtAuthGuard } from '../../src/auth/jwt/jwt.guard';
import { Perfil } from '@prisma/client';

@Controller('examen')
@UseGuards(JwtAuthGuard)
export class ExamenController {
  constructor(private readonly examenService: ExamenService) {}

  @Get()
  async validarFecha(@CurrentUser() user: JwtPayload): Promise<void> {
    await this.examenService.validarFechaExamen(user.userId);
  }

  @Get('nuevo')
  async validarNuevo(@CurrentUser() user: JwtPayload): Promise<void> {
    await this.examenService.validarNuevoUsuario(user.userId);
  }

  @Post()
  async examen(
    @Body() resultado: ResultadoExamenDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ perfil: Perfil; access_token: string }> {
    return this.examenService.update(user.userId, resultado);
  }
}
