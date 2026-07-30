/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { Perfil } from '../../src/perfil/entities/perfil.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { Perfil as PerfilP } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('Perfil', () => {
  let perfil: Perfil;
  let prismaMock: DeepMockProxy<PrismaService>;
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
    prismaMock = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [Perfil, { provide: PrismaService, useValue: prismaMock }],
    }).compile();

    perfil = module.get<Perfil>(Perfil);
  });

  afterEach(() => {
    mockReset(prismaMock);
  });

  describe('findMany', () => {
    it('debería retornar todos los perfiles', async () => {
      const expectedPerfiles = [mockPerfil];
      prismaMock.perfil.findMany.mockResolvedValueOnce(expectedPerfiles);

      const result = await perfil.findMany();
      expect(result).toEqual(expectedPerfiles);
    });
  });

  describe('findOrThrow', () => {
    it('debería retornar perfil si existe', async () => {
      prismaMock.perfil.findUnique.mockResolvedValueOnce(mockPerfil);

      const result = await perfil.findOrThrow(1);
      expect(result).toEqual(mockPerfil);
    });

    it('debería lanzar excepción si perfil no existe', async () => {
      prismaMock.perfil.findUnique.mockResolvedValueOnce(null);

      await expect(perfil.findOrThrow(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      prismaMock.perfil.findUnique.mockResolvedValueOnce(mockPerfil);
    });

    it('debería actualizar perfil exitosamente', async () => {
      const updateDto = { nombre: 'Nuevo Nombre' };
      const updatedPerfil = { ...mockPerfil, ...updateDto };

      prismaMock.perfil.update.mockResolvedValueOnce(updatedPerfil);

      const result = await perfil.update(1, updateDto);
      expect(result).toEqual(updatedPerfil);
      expect(prismaMock.perfil.update).toHaveBeenCalledWith({
        where: { credencialesId: 1 },
        data: updateDto,
        include: { credencial: true, nivel_actual: true },
      });
    });
  });

  describe('updateNivel', () => {
    it('debería actualizar el nivel_actual_id y fecha_ultima_evaluacion', async () => {
      prismaMock.perfil.update.mockResolvedValueOnce(mockPerfil);

      const result = await perfil.updateNivel(1, 5);

      expect(result).toEqual(mockPerfil);
      expect(prismaMock.perfil.update).toHaveBeenCalledWith({
        where: { credencialesId: 1 },
        data: {
          nivel_actual_id: 5,
          fecha_ultima_evaluacion: expect.any(Date),
        },
        include: { credencial: true, nivel_actual: true },
      });
    });
  });

  describe('delete', () => {
    it('debería eliminar perfil exitosamente', async () => {
      prismaMock.perfil.delete.mockResolvedValueOnce(mockPerfil);

      const result = await perfil.delete(1);
      expect(result).toEqual(mockPerfil);
    });
  });
});
