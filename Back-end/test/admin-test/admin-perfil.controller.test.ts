/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AdminPerfilController } from '../../src/admin/admin-perfil.controller';
import { PerfilService } from '../../src/perfil/perfil.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Perfil as PerfilP } from '@prisma/client';
import { UpdatePerfilDto } from '../../src/perfil/dto/update-perfil.dto';
import { JwtAuthGuard } from '../../src/auth/jwt/jwt.guard';
import { PoliciesGuard } from '../../src/casl/policies.guard';

describe('AdminPerfilController', () => {
  let controller: AdminPerfilController;
  let serviceMock: DeepMockProxy<PerfilService>;

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
      controllers: [AdminPerfilController],
      providers: [
        { provide: PerfilService, useValue: mockDeep<PerfilService>() },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(PoliciesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get(AdminPerfilController);
    serviceMock = module.get(PerfilService);
  });

  describe('findAll', () => {
    it('debería retornar todos los perfiles', async () => {
      serviceMock.findAll.mockResolvedValueOnce([mockPerfil]);

      const result = await controller.findAll();

      expect(result).toEqual([mockPerfil]);
      expect(serviceMock.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería retornar el perfil por id', async () => {
      serviceMock.findOne.mockResolvedValueOnce(mockPerfil);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockPerfil);
      expect(serviceMock.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('debería actualizar el perfil por id', async () => {
      const updateDto: UpdatePerfilDto = {
        nombre: 'Nuevo Nombre',
        fecha_nacimiento: new Date('1995-05-05'),
      };

      serviceMock.update.mockResolvedValueOnce(mockPerfil);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockPerfil);
      expect(serviceMock.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('debería eliminar el perfil por id', async () => {
      serviceMock.remove.mockResolvedValueOnce(mockPerfil);

      const result = await controller.remove(1);

      expect(result).toEqual(mockPerfil);
      expect(serviceMock.remove).toHaveBeenCalledWith(1);
    });
  });
});
