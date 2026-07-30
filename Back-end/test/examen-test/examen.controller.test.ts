/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ExamenController } from '../../src/examen/examen.controller';
import { ExamenService } from '../../src/examen/examen.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ResultadoExamenDto } from '../../src/examen/dto/resultado-examen.dto';

describe('ExamenController', () => {
  let controller: ExamenController;
  let serviceMock: DeepMockProxy<ExamenService>;

  const userMock = {
    userId: 1,
    nivel_actual_id: 1,
    email: 'test@test.com',
    rol: 'usuario',
  };

  const perfilMock = {
    id: 1,
    nombre: 'Test User',
    rol: 'usuario',
    fecha_nacimiento: new Date('1990-01-01'),
    fecha_ultima_evaluacion: new Date(),
    credencialesId: 1,
    nivel_actual_id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    credencial: {},
    nivel_actual: {},
  };

  beforeEach(async () => {
    serviceMock = mockDeep<ExamenService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamenController],
      providers: [{ provide: ExamenService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ExamenController>(ExamenController);
  });

  describe('validarFecha', () => {
    it('debería llamar al servicio validarFechaExamen', async () => {
      await controller.validarFecha(userMock);
      expect(serviceMock.validarFechaExamen).toHaveBeenCalledWith(
        userMock.userId,
      );
    });
  });

  describe('validarNuevo', () => {
    it('debería llamar al servicio validarNuevoUsuario', async () => {
      await controller.validarNuevo(userMock);
      expect(serviceMock.validarNuevoUsuario).toHaveBeenCalledWith(
        userMock.userId,
      );
    });
  });

  describe('examen', () => {
    it('debería retornar el perfil actualizado y el token al realizar el examen', async () => {
      const resultado: ResultadoExamenDto = { puntos: 80 };
      const mockResponse = {
        perfil: perfilMock,
        access_token: 'token-ejemplo',
      };

      serviceMock.update.mockResolvedValueOnce(mockResponse);

      const result = await controller.examen(resultado, userMock);

      expect(result).toEqual(mockResponse);
      expect(serviceMock.update).toHaveBeenCalledWith(
        userMock.userId,
        resultado,
      );
    });
  });
});
