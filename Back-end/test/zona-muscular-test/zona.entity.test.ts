/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ZonaMuscular } from '../../src/zona-muscular/entities/zona-muscular.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { ZonaMuscular as ZonaM } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

const mockZona: ZonaM = {
  id: 1,
  nombre: 'Pecho',
  descripcion: 'Ejercicios para pecho',
  createdAt: new Date('2025-06-12'),
  updatedAt: new Date('2025-06-12'),
};

const mockCreateDto = {
  nombre: 'Pecho',
  descripcion: 'Ejercicios para pecho',
};

const mockUpdateDto = {
  nombre: 'Espalda',
  descripcion: 'Ejercicios para espalda',
};

describe('ZonaMuscular Entity', () => {
  let entity: ZonaMuscular;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ZonaMuscular, { provide: PrismaService, useValue: prisma }],
    }).compile();

    entity = module.get<ZonaMuscular>(ZonaMuscular);
  });

  describe('create()', () => {
    it('debería crear una nueva zona muscular', async () => {
      prisma.zonaMuscular.create.mockResolvedValue(mockZona);

      const result = await entity.create(mockCreateDto);

      expect(prisma.zonaMuscular.create).toHaveBeenCalledWith({
        data: mockCreateDto,
      });
      expect(result).toEqual(mockZona);
    });
  });

  describe('findOrThrow()', () => {
    it('debería retornar la zona muscular cuando existe', async () => {
      prisma.zonaMuscular.findUnique.mockResolvedValue(mockZona);

      const result = await entity.findOrThrow(1);

      expect(prisma.zonaMuscular.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockZona);
    });

    it('debería lanzar NotFoundException cuando no existe', async () => {
      prisma.zonaMuscular.findUnique.mockResolvedValue(null);

      await expect(entity.findOrThrow(2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findMany()', () => {
    it('debería retornar todas las zonas musculares', async () => {
      const zonas = [mockZona];
      prisma.zonaMuscular.findMany.mockResolvedValue(zonas);

      const result = await entity.findMany();

      expect(prisma.zonaMuscular.findMany).toHaveBeenCalled();
      expect(result).toEqual(zonas);
    });
  });

  describe('update()', () => {
    it('debería actualizar una zona muscular existente', async () => {
      const updatedZona = { ...mockZona, ...mockUpdateDto };
      prisma.zonaMuscular.findUnique.mockResolvedValue(mockZona);
      prisma.zonaMuscular.update.mockResolvedValue(updatedZona);

      const result = await entity.update(1, mockUpdateDto);

      expect(prisma.zonaMuscular.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: mockUpdateDto,
      });
      expect(result).toEqual(updatedZona);
    });
  });

  describe('delete()', () => {
    it('debería eliminar una zona muscular existente', async () => {
      prisma.zonaMuscular.findUnique.mockResolvedValue(mockZona);
      prisma.zonaMuscular.delete.mockResolvedValue(mockZona);

      const result = await entity.delete(1);

      expect(prisma.zonaMuscular.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockZona);
    });
  });
});
