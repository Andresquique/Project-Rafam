/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Nivel as NivelP } from '@prisma/client';
import { Nivel } from '../../src/nivel/entities/nivel.entity';

const mockNivel: NivelP = {
  id: 1,
  nombre: 'Principiante',
  numero_orden: 1,
};

const mockCreateDto = {
  nombre: 'Intermedio',
  numero_orden: 2,
};

const mockUpdateDto = {
  nombre: 'Avanzado',
  numero_orden: 3,
};

describe('Nivel Entity', () => {
  let entity: Nivel;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [Nivel, { provide: PrismaService, useValue: prisma }],
    }).compile();

    entity = module.get<Nivel>(Nivel);
  });

  describe('create()', () => {
    it('debería crear una nuevo nivel', async () => {
      prisma.nivel.create.mockResolvedValue(mockNivel);

      const result = await entity.create(mockCreateDto);

      expect(prisma.nivel.create).toHaveBeenCalledWith({
        data: mockCreateDto,
      });
      expect(result).toEqual(mockNivel);
    });
  });

  describe('findOrThrow()', () => {
    it('debería retornar el nivel cuando existe', async () => {
      prisma.nivel.findUnique.mockResolvedValue(mockNivel);

      const result = await entity.findOrThrow(1);

      expect(prisma.nivel.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockNivel);
    });

    it('debería lanzar NotFoundException cuando no existe', async () => {
      prisma.nivel.findUnique.mockResolvedValue(null);

      await expect(entity.findOrThrow(2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findMany()', () => {
    it('debería retornar todas los niveles', async () => {
      const zonas = [mockNivel];
      prisma.nivel.findMany.mockResolvedValue(zonas);

      const result = await entity.findMany();

      expect(prisma.nivel.findMany).toHaveBeenCalled();
      expect(result).toEqual(zonas);
    });
  });

  describe('update()', () => {
    it('debería actualizar un nivel cuando existe', async () => {
      const updatedZona = { ...mockNivel, ...mockUpdateDto };
      prisma.nivel.findUnique.mockResolvedValue(mockNivel);
      prisma.nivel.update.mockResolvedValue(updatedZona);

      const result = await entity.update(1, mockUpdateDto);

      expect(prisma.nivel.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: mockUpdateDto,
      });
      expect(result).toEqual(updatedZona);
    });
  });

  describe('delete()', () => {
    it('debería eliminar un nivel existente', async () => {
      prisma.nivel.findUnique.mockResolvedValue(mockNivel);
      prisma.nivel.delete.mockResolvedValue(mockNivel);

      const result = await entity.delete(1);

      expect(prisma.nivel.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockNivel);
    });
  });
});
