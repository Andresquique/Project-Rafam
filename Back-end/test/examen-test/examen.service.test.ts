/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ExamenService } from '../../src/examen/examen.service';
import { PerfilService } from '../../src/perfil/perfil.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { BadRequestException } from '@nestjs/common';
import { eNivel } from '../../src/examen/enum/eNivel';
import { ResultadoExamenDto } from '../../src/examen/dto/resultado-examen.dto';
import { AuthService } from '../../src/auth/auth.service';

describe('ExamenService', () => {
  let service: ExamenService;
  let perfilMock: DeepMockProxy<PerfilService>;
  const authMock = mockDeep<AuthService>();

  const perfilConFecha = {
    id: 1,
    nombre: 'Test User',
    rol: 'usuario',
    fecha_nacimiento: new Date('1990-01-01'),
    fecha_ultima_evaluacion: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000), // hace 31 días
    credencialesId: 1,
    nivel_actual_id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    credencial: {},
    nivel_actual: {},
  };

  beforeEach(async () => {
    perfilMock = mockDeep<PerfilService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamenService,
        { provide: PerfilService, useValue: perfilMock },
        { provide: AuthService, useValue: authMock },
      ],
    }).compile();

    service = module.get<ExamenService>(ExamenService);
  });

  describe('validarNuevoUsuario', () => {
    it('debería lanzar error si el usuario no tiene examen previo', async () => {
      perfilMock.findOne.mockResolvedValueOnce({
        ...perfilConFecha,
        fecha_ultima_evaluacion: null,
      });

      await expect(service.validarNuevoUsuario(1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('no debería lanzar error si el usuario ya tiene examen previo', async () => {
      perfilMock.findOne.mockResolvedValueOnce(perfilConFecha);
      await expect(service.validarNuevoUsuario(1)).resolves.toBeUndefined();
    });
  });

  describe('validarFechaExamen', () => {
    it('debería lanzar error si no pasaron 30 días desde el último examen', async () => {
      perfilMock.findOne.mockResolvedValueOnce({
        ...perfilConFecha,
        fecha_ultima_evaluacion: new Date(),
      });

      await expect(service.validarFechaExamen(1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('no debería lanzar error si pasaron más de 30 días', async () => {
      perfilMock.findOne.mockResolvedValueOnce(perfilConFecha);
      await expect(service.validarFechaExamen(1)).resolves.toBeUndefined();
    });
  });

  describe('update', () => {
    const perfilConFecha = {
      id: 1,
      nombre: 'Nombre Ejemplo',
      rol: 'user',
      fecha_nacimiento: new Date(),
      fecha_ultima_evaluacion: new Date(),
      credencialesId: 1,
      nivel_actual_id: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      credencial: {
        id: 1,
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        password: 'hashedpassword',
      },
      nivel_actual: {
        id: 2,
        nombre: 'Intermedio',
        numero_orden: 2,
      },
    };
    beforeEach(() => {
      jest.spyOn(service, 'validarFechaExamen').mockResolvedValue();
    });

    it('debería asignar PRINCIPIANTE si el puntaje es bajo', async () => {
      perfilMock.updateNivel.mockResolvedValueOnce(perfilConFecha);
      authMock.generateToken.mockReturnValueOnce({
        access_token: 'token-principiante',
      });

      const resultado: ResultadoExamenDto = { puntos: 3 };

      const result = await service.update(1, resultado);

      expect(result).toEqual({
        perfil: perfilConFecha,
        access_token: 'token-principiante',
      });

      expect(perfilMock.updateNivel).toHaveBeenCalledWith(
        1,
        eNivel.PRINCIPIANTE,
      );
      expect(authMock.generateToken).toHaveBeenCalledWith(
        perfilConFecha.credencial.id,
        perfilConFecha.credencial.email,
        perfilConFecha.rol,
        perfilConFecha.nivel_actual_id,
      );
    });

    it('debería asignar INTERMEDIO si el puntaje es intermedio', async () => {
      perfilMock.updateNivel.mockResolvedValueOnce(perfilConFecha);
      authMock.generateToken.mockReturnValueOnce({
        access_token: 'token-intermedio',
      });

      const resultado: ResultadoExamenDto = {
        puntos: eNivel.MINIMO_REQUERIDO_INTERMEDIO,
      };

      const result = await service.update(1, resultado);

      expect(result).toEqual({
        perfil: perfilConFecha,
        access_token: 'token-intermedio',
      });

      expect(perfilMock.updateNivel).toHaveBeenCalledWith(1, eNivel.INTERMEDIO);
      expect(authMock.generateToken).toHaveBeenCalledWith(
        perfilConFecha.credencial.id,
        perfilConFecha.credencial.email,
        perfilConFecha.rol,
        perfilConFecha.nivel_actual_id,
      );
    });

    it('debería asignar AVANZADO si el puntaje es alto', async () => {
      perfilMock.updateNivel.mockResolvedValueOnce(perfilConFecha);
      authMock.generateToken.mockReturnValueOnce({
        access_token: 'token-avanzado',
      });

      const resultado: ResultadoExamenDto = {
        puntos: eNivel.MINIMO_REQUERIDO_AVANZADO,
      };

      const result = await service.update(1, resultado);

      expect(result).toEqual({
        perfil: perfilConFecha,
        access_token: 'token-avanzado',
      });

      expect(perfilMock.updateNivel).toHaveBeenCalledWith(1, eNivel.AVANZADO);
      expect(authMock.generateToken).toHaveBeenCalledWith(
        perfilConFecha.credencial.id,
        perfilConFecha.credencial.email,
        perfilConFecha.rol,
        perfilConFecha.nivel_actual_id,
      );
    });
  });
});
