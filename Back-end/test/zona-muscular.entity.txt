import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ZonaMuscular } from '../src/zona-muscular/entities/zona-muscular.entity';
import { PrismaService } from '../prisma/prisma.service';
import { ZonaMuscular as ZonaM } from '@prisma/client';

describe('ZonaMuscular', () => {
  let service: ZonaMuscular;
  let prisma: {
    zonaMuscular: {
      create: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      zonaMuscular: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZonaMuscular,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<ZonaMuscular>(ZonaMuscular);
  });

  describe('create', () => {
    it('debería crear una zona muscular', async () => {
      const dto = { nombre: 'Pecho', descripcion: 'Ejercicios para pecho' };
      const zona: ZonaM = {
        id: 1,
        nombre: 'Pecho',
        descripcion: 'Parte frontal superior del torso',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prisma.zonaMuscular.create.mockResolvedValue(zona);

      const result = await service.create(dto);
      expect(result).toEqual(zona);
      expect(prisma.zonaMuscular.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('findOrThrow', () => {
    it('debería devolver la zona muscular si existe', async () => {
      const zona: ZonaM = {
        id: 1,
        nombre: 'Pecho',
        descripcion: 'Parte frontal superior del torso',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prisma.zonaMuscular.findUnique.mockResolvedValue(zona);

      const result = await service.findOrThrow(1);
      expect(result).toEqual(zona);
      expect(prisma.zonaMuscular.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      prisma.zonaMuscular.findUnique.mockResolvedValue(null);

      await expect(service.findOrThrow(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findMany', () => {
    it('debería devolver un array de zonas musculares', async () => {
      const zonas: ZonaM[] = [
        {
          id: 1,
          nombre: 'Pecho',
          descripcion: 'Parte frontal superior del torso',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      prisma.zonaMuscular.findMany.mockResolvedValue(zonas);

      const result = await service.findMany();
      expect(result).toEqual(zonas);
      expect(prisma.zonaMuscular.findMany).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('debería actualizar una zona muscular existente', async () => {
      const id = 1;
      const dto = { nombre: 'Espalda', descripcion: 'Ejercicios para pecho' };
      const zonaActual: ZonaM = {
        id: 1,
        nombre: 'Pecho',
        descripcion: 'Parte frontal superior del torso',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const zonaActualizada: ZonaM = {
        id: 1,
        nombre: 'Espalda',
        descripcion: 'Parte frontal superior del torso',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.zonaMuscular.findUnique.mockResolvedValue(zonaActual);
      prisma.zonaMuscular.update.mockResolvedValue(zonaActualizada);

      const result = await service.update(id, dto);
      expect(result).toEqual(zonaActualizada);
      expect(prisma.zonaMuscular.update).toHaveBeenCalledWith({
        where: { id },
        data: dto,
      });
    });
  });

  describe('delete', () => {
    it('debería eliminar una zona muscular existente', async () => {
      const id = 1;
      const zona: ZonaM = {
        id: 1,
        nombre: 'Pecho',
        descripcion: 'Parte frontal superior del torso',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.zonaMuscular.findUnique.mockResolvedValue(zona);
      prisma.zonaMuscular.delete.mockResolvedValue(zona);

      const result = await service.delete(id);
      expect(result).toEqual(zona);
      expect(prisma.zonaMuscular.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
