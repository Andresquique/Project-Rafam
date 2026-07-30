/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { PerfilService } from '../../src/perfil/perfil.service';
import { Perfil } from '../../src/perfil/entities/perfil.entity';
import { CredencialService } from '../../src/credencial/credencial.service';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { Perfil as PerfilP } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { UpdatePerfilDto } from 'src/perfil/dto/update-perfil.dto';

describe('PerfilService', () => {
  let service: PerfilService;
  let perfilMock: DeepMockProxy<Perfil>;
  let credencialMock: DeepMockProxy<CredencialService>;

  const mockPerfil: PerfilP = {
    id: 1,
    credencialesId: 1,
    nombre: 'Perfil Test',
    rol: 'usuario',
    nivel_actual_id: 1,
    fecha_ultima_evaluacion: new Date('2025-06-12'),
    fecha_nacimiento: new Date('2025-06-12'),
    createdAt: new Date('2025-06-12'),
    updatedAt: new Date('2025-06-12'),
  };

  beforeEach(async () => {
    perfilMock = mockDeep<Perfil>();
    credencialMock = mockDeep<CredencialService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PerfilService,
        { provide: Perfil, useValue: perfilMock },
        { provide: CredencialService, useValue: credencialMock },
      ],
    }).compile();

    service = module.get<PerfilService>(PerfilService);
  });

  afterEach(() => {
    mockReset(perfilMock);
    mockReset(credencialMock);
  });

  describe('findAll', () => {
    it('debería retornar todos los perfiles', async () => {
      const expected = [mockPerfil];
      perfilMock.findMany.mockResolvedValueOnce(expected);

      const result = await service.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('debería retornar un perfil si existe', async () => {
      perfilMock.findOrThrow.mockResolvedValueOnce(mockPerfil);

      const result = await service.findOne(1);
      expect(result).toEqual(mockPerfil);
    });

    it('debería lanzar excepción si no existe el perfil', async () => {
      perfilMock.findOrThrow.mockRejectedValueOnce(new NotFoundException());

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar solo el perfil si no hay credencial', async () => {
      perfilMock.findOrThrow.mockResolvedValueOnce(mockPerfil);
      perfilMock.update.mockResolvedValueOnce(mockPerfil);

      const data: UpdatePerfilDto = {
        nombre: 'Nuevo Nombre',
        fecha_nacimiento: new Date('1990-01-01'),
      };

      const result = await service.update(1, data);
      expect(result).toEqual(mockPerfil);
      expect(credencialMock.update).not.toHaveBeenCalled();
      expect(perfilMock.update).toHaveBeenCalledWith(1, data);
    });

    it('debería actualizar el perfil y la credencial si se proporciona', async () => {
      perfilMock.findOrThrow.mockResolvedValueOnce(mockPerfil);
      perfilMock.update.mockResolvedValueOnce(mockPerfil);

      const data = {
        nombre: 'Nuevo Nombre',
        fecha_nacimiento: new Date('1990-01-01'),
        credencial: { email: 'nuevo@mail.com', password: '123456' },
      };

      const { credencial, ...perfilData } = data;

      const result = await service.update(1, data);
      expect(result).toEqual(mockPerfil);
      expect(credencialMock.update).toHaveBeenCalledWith(1, credencial);
      expect(perfilMock.update).toHaveBeenCalledWith(1, perfilData);
    });
  });

  describe('updateNivel', () => {
    it('debería llamar a updateNivel en la entidad Perfil', async () => {
      const perfilCompleto = {
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
      perfilMock.updateNivel.mockResolvedValueOnce(perfilCompleto);

      const result = await service.updateNivel(1, 2);
      expect(result).toEqual(perfilCompleto);
      expect(perfilMock.updateNivel).toHaveBeenCalledWith(1, 2);
    });
  });

  describe('remove', () => {
    it('debería eliminar un perfil existente', async () => {
      perfilMock.findOrThrow.mockResolvedValueOnce(mockPerfil);
      perfilMock.delete.mockResolvedValueOnce(mockPerfil);

      const result = await service.remove(1);
      expect(result).toEqual(mockPerfil);
      expect(perfilMock.findOrThrow).toHaveBeenCalledWith(1);
      expect(perfilMock.delete).toHaveBeenCalledWith(1);
    });

    it('debería lanzar excepción si el perfil no existe', async () => {
      perfilMock.findOrThrow.mockRejectedValueOnce(new NotFoundException());

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
