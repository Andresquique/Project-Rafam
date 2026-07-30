/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { BadRequestException, Injectable } from '@nestjs/common';
import { ResultadoExamenDto } from './dto/resultado-examen.dto';
import { Perfil } from '@prisma/client';
import { PerfilService } from '../../src/perfil/perfil.service';
import { eNivel } from './enum/eNivel';
import { differenceInDays } from 'date-fns';
import { AuthService } from '../../src/auth/auth.service';

@Injectable()
export class ExamenService {
  constructor(
    private perfil: PerfilService,
    private auth: AuthService,
  ) {}

  async validarNuevoUsuario(id: number): Promise<void> {
    const perfil = await this.perfil.findOne(id);
    if (perfil?.fecha_ultima_evaluacion === null) {
      throw new BadRequestException(`Debes tomar el examen de aptitud fisica`);
    }
  }

  async validarFechaExamen(id: number) {
    const perfil = await this.perfil.findOne(id);

    if (perfil?.fecha_ultima_evaluacion) {
      const dias = differenceInDays(new Date(), perfil.fecha_ultima_evaluacion);

      if (dias < 30) {
        const falta = Math.ceil(30 - dias);
        throw new BadRequestException(
          `El examen se puede tomar cada 30 dias. Faltan ${falta} dia(s) para tu siguiente intento.`,
        );
      }
    }
  }

  async update(
    id: number,
    resultado: ResultadoExamenDto,
  ): Promise<{ perfil: Perfil; access_token: string }> {
    await this.validarFechaExamen(id);
    const puntaje = resultado.puntos;
    let nuevoNivelId: number;

    if (puntaje < eNivel.MINIMO_REQUERIDO_INTERMEDIO) {
      nuevoNivelId = eNivel.PRINCIPIANTE;
    } else if (puntaje < eNivel.MINIMO_REQUERIDO_AVANZADO) {
      nuevoNivelId = eNivel.INTERMEDIO;
    } else {
      nuevoNivelId = eNivel.AVANZADO;
    }

    const perfil = await this.perfil.updateNivel(id, nuevoNivelId);
    const { id: userId, email } = perfil.credencial;
    const { access_token } = this.auth.generateToken(
      userId,
      email,
      perfil.rol,
      perfil.nivel_actual_id,
    );

    return { perfil, access_token };
  }
}
