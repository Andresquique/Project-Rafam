/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { Video } from '../../src/video/entities/video.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { Prisma, Video as VideoP } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('Video', () => {
  let video: Video;
  let prismaMock: DeepMockProxy<PrismaService>;
  const mockVideo: VideoP = {
    id: 1,
    nombre: 'Video Test',
    descripcion: 'Descripción',
    url_video: 'http://test.com',
    url_miniatura: 'http://test.com',
    zona_muscular_id: 1,
    nivel_id: 1,
    createdAt: new Date('2025-06-12'),
    updatedAt: new Date('2025-06-12'),
  };

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [Video, { provide: PrismaService, useValue: prismaMock }],
    }).compile();

    video = module.get<Video>(Video);
  });

  afterEach(() => {
    mockReset(prismaMock);
  });

  describe('create', () => {
    it('debería crear un video exitosamente', async () => {
      prismaMock.video.create.mockResolvedValueOnce(mockVideo);
      const result = await video.create(mockVideo);
      expect(result).toEqual(mockVideo);
    });
  });

  describe('findQuery', () => {
    it('debería aplicar múltiples filtros correctamente', async () => {
      const expectedWhere: Prisma.VideoWhereInput = {
        nivel_id: { equals: 2 },
        zona_muscular_id: 5,
        nombre: { contains: 'test', mode: 'insensitive' },
        descripcion: {
          contains: 'desc',
          mode: 'insensitive',
        },
      };

      prismaMock.video.findMany.mockResolvedValue([mockVideo]);

      const result = await video.findQuery(expectedWhere);
      expect(result).toEqual([mockVideo]);
      expect(prismaMock.video.findMany).toHaveBeenCalledWith({
        where: expectedWhere,
      });
    });
  });

  describe('findMany', () => {
    it('debería retornar todos los videos', async () => {
      const expectedVideos = [mockVideo];
      prismaMock.video.findMany.mockResolvedValueOnce(expectedVideos);

      const result = await video.findMany();
      expect(result).toEqual(expectedVideos);
    });
  });

  describe('findOrThrow', () => {
    it('debería retornar video si existe', async () => {
      prismaMock.video.findUnique.mockResolvedValueOnce(mockVideo);

      const result = await video.findOrThrow(1);
      expect(result).toEqual(mockVideo);
    });

    it('debería lanzar excepción si video no existe', async () => {
      prismaMock.video.findUnique.mockResolvedValueOnce(null);

      await expect(video.findOrThrow(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      prismaMock.video.findUnique.mockResolvedValueOnce(mockVideo);
    });

    it('debería actualizar video exitosamente', async () => {
      const updateDto = { nombre: 'Nuevo Nombre' };
      const updatedVideo = { ...mockVideo, ...updateDto };

      prismaMock.video.update.mockResolvedValueOnce(updatedVideo);

      const result = await video.update(1, updateDto);
      expect(result).toEqual(updatedVideo);
      expect(prismaMock.video.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
    });
  });

  describe('delete', () => {
    it('debería eliminar video exitosamente', async () => {
      prismaMock.video.delete.mockResolvedValueOnce(mockVideo);

      const result = await video.delete(1);
      expect(result).toEqual(mockVideo);
    });
  });
});
