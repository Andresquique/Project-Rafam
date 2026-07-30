/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { PerfilController } from '../../src/perfil/perfil.controller';
import { PerfilService } from '../../src/perfil/perfil.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Perfil as PerfilP } from '@prisma/client';
import { JwtPayload } from '../../src/auth/jwt/jwt.payload';
import { UpdatePerfilDto } from '../../src/perfil/dto/update-perfil.dto';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../../src/auth/jwt/jwt.guard';

describe('PerfilController', () => {
  let controller: PerfilController;
  let serviceMock: DeepMockProxy<PerfilService>;

  const mockUser: JwtPayload = {
    userId: 1,
    nivel_actual_id: 1,
    email: 'test@test.com',
    rol: 'usuario',
  };

  const mockJwtAuthGuard = {
    canActivate: (context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest();
      req.user = mockUser;
      return true;
    },
  };

  const mockPerfil: PerfilP = {
    id: 1,
    credencialesId: 1,
    nombre: 'Perfil Test',
    rol: 'usuario',
    nivel_actual_id: 1,
    fecha_nacimiento: new Date('1990-01-01'),
    fecha_ultima_evaluacion: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerfilController],
      providers: [
        { provide: PerfilService, useValue: mockDeep<PerfilService>() },
        {
          provide: Reflector,
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get(PerfilController);
    serviceMock = module.get(PerfilService);
  });

  describe('getProfile', () => {
    it('debería retornar el perfil del usuario', async () => {
      serviceMock.findOne.mockResolvedValueOnce(mockPerfil);

      const result = await controller.getProfile(mockUser);

      expect(result).toEqual(mockPerfil);
      expect(serviceMock.findOne).toHaveBeenCalledWith(mockUser.userId);
    });
  });

  describe('update', () => {
    it('debería actualizar el perfil del usuario', async () => {
      const updateDto: UpdatePerfilDto = {
        nombre: 'Nuevo Nombre',
        fecha_nacimiento: new Date('1995-05-05'),
      };

      serviceMock.update.mockResolvedValueOnce(mockPerfil);

      const result = await controller.update(mockUser, updateDto);

      expect(result).toEqual(mockPerfil);
      expect(serviceMock.update).toHaveBeenCalledWith(
        mockUser.userId,
        updateDto,
      );
    });
  });

  describe('remove', () => {
    it('debería eliminar el perfil del usuario', async () => {
      serviceMock.remove.mockResolvedValueOnce(mockPerfil);

      const result = await controller.remove(mockUser);

      expect(result).toEqual(mockPerfil);
      expect(serviceMock.remove).toHaveBeenCalledWith(mockUser.userId);
    });
  });

  describe('JwtAuthGuard', () => {
    it('debería estar aplicada al controlador', () => {
      const guards = Reflect.getMetadata('__guards__', PerfilController);
      expect(guards[0].name).toBe(JwtAuthGuard.name);
    });

    it('debería inyectar el usuario en la request', () => {
      const reqMock = {} as { user?: any };
      const contextMock = {
        switchToHttp: () => ({
          getRequest: () => reqMock,
        }),
      } as unknown as ExecutionContext;

      mockJwtAuthGuard.canActivate(contextMock);

      expect(reqMock.user).toEqual(mockUser);
    });
  });
});
