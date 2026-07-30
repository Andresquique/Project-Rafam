/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AdminVideoController } from '../../src/admin/admin-video.controller';
import { VideoService } from '../../src/video/video.service';
import { JwtAuthGuard } from '../../src/auth/jwt/jwt.guard';
import { PoliciesGuard } from '../../src/casl/policies.guard';
import { Action } from '../../src/casl/enum/action.enum';
import { CreateVideoDto } from '../../src/video/dto/create-video.dto';
import { UpdateVideoDto } from '../../src/video/dto/update-video.dto';
import { Video } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Reflector } from '@nestjs/core';
import { NotFoundException } from '@nestjs/common';

jest.mock('../../src/casl/decorators/permissions.decorator', () => ({
  __esModule: true,
  Permission: jest
    .fn()
    .mockImplementation((action: Action, subject: string) => {
      return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
        if (descriptor) {
          Reflect.defineMetadata(
            'permission',
            { action, subject },
            descriptor.value,
          );
        }
      };
    }),
}));

const createMockVideo = (overrides: Partial<Video> = {}): Video => ({
  id: 1,
  nombre: 'Video de prueba',
  descripcion: 'Descripción de prueba',
  url_video: 'https://example.com/video.mp4',
  url_miniatura: 'https://example.com/video.mp4',
  nivel_id: 1,
  zona_muscular_id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('AdminVideoController', () => {
  let controller: AdminVideoController;
  let videoService: DeepMockProxy<VideoService>;

  const mockJwtAuthGuard = {
    canActivate: jest.fn().mockImplementation(() => {
      return true;
    }),
  };

  const mockPoliciesGuard = {
    canActivate: jest.fn().mockImplementation(() => {
      return true;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminVideoController],
      providers: [
        {
          provide: VideoService,
          useValue: mockDeep<VideoService>(),
        },
        {
          provide: Reflector,
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(PoliciesGuard)
      .useValue(mockPoliciesGuard)
      .compile();

    controller = module.get<AdminVideoController>(AdminVideoController);
    videoService = module.get(VideoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería tener JwtAuthGuard aplicado', () => {
    const guards =
      Reflect.getMetadata('__guards__', AdminVideoController) || [];
    const guardTypes = guards.map((guard) => guard.name);
    expect(guardTypes).toContain(JwtAuthGuard.name);
  });

  it('debería tener PoliciesGuard aplicado', () => {
    const guards =
      Reflect.getMetadata('__guards__', AdminVideoController) || [];
    const guardTypes = guards.map((guard) => guard.name);
    expect(guardTypes).toContain(PoliciesGuard.name);
  });

  describe('create', () => {
    it('debería crear un nuevo video', async () => {
      const dto: CreateVideoDto = {
        nombre: 'Nuevo Video',
        descripcion: 'Descripción del video',
        url_video: 'https://nuevo-video.com',
        url_miniatura: 'https://nuevo-video.com',
        nivel_id: 2,
        zona_muscular_id: 3,
      };

      const expectedVideo = createMockVideo(dto);

      videoService.create.mockResolvedValue(expectedVideo);

      const result = await controller.create(dto);

      expect(result).toEqual(expectedVideo);
      expect(videoService.create).toHaveBeenCalledWith(dto);
    });

    it('debería tener el decorador Permission con Create y Video', () => {
      const metadata = Reflect.getMetadata('permission', controller.create);
      expect(metadata).toEqual({ action: Action.Create, subject: 'Video' });
    });
  });

  describe('findAll', () => {
    it('debería retornar todos los videos', async () => {
      const expectedVideos = [
        createMockVideo({ id: 1 }),
        createMockVideo({ id: 2 }),
      ];

      videoService.findAll.mockResolvedValue(expectedVideos);

      const result = await controller.findAll();

      expect(result).toEqual(expectedVideos);
      expect(videoService.findAll).toHaveBeenCalled();
    });

    it('debería tener el decorador Permission con Read y Video', () => {
      const metadata = Reflect.getMetadata('permission', controller.findAll);
      expect(metadata).toEqual({ action: Action.Read, subject: 'Video' });
    });
  });

  describe('findOne', () => {
    it('debería retornar un video por ID', async () => {
      const videoId = 1;
      const expectedVideo = createMockVideo({ id: videoId });

      videoService.findOne.mockResolvedValue(expectedVideo);

      const result = await controller.findOne(videoId);

      expect(result).toEqual(expectedVideo);
      expect(videoService.findOne).toHaveBeenCalledWith(videoId);
    });

    it('debería lanzar NotFoundException si el video no existe', async () => {
      const videoId = 999;

      videoService.findOne.mockRejectedValue(
        new NotFoundException(`Video con id ${videoId} no encontrado`),
      );

      await expect(controller.findOne(videoId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('debería tener el decorador Permission con Read y Video', () => {
      const metadata = Reflect.getMetadata('permission', controller.findOne);
      expect(metadata).toEqual({ action: Action.Read, subject: 'Video' });
    });
  });

  describe('update', () => {
    it('debería actualizar un video existente', async () => {
      const videoId = 1;
      const updateDto: UpdateVideoDto = { nombre: 'Video Actualizado' };
      const updatedVideo = createMockVideo({
        id: videoId,
        nombre: 'Video Actualizado',
      });

      videoService.update.mockResolvedValue(updatedVideo);

      const result = await controller.update(videoId, updateDto);

      expect(result).toEqual(updatedVideo);
      expect(videoService.update).toHaveBeenCalledWith(videoId, updateDto);
    });

    it('debería manejar actualización con nuevos IDs', async () => {
      const videoId = 1;
      const updateDto: UpdateVideoDto = {
        nivel_id: 3,
        zona_muscular_id: 4,
      };
      const updatedVideo = createMockVideo(updateDto);

      videoService.update.mockResolvedValue(updatedVideo);

      const result = await controller.update(videoId, updateDto);

      expect(result).toEqual(updatedVideo);
      expect(videoService.update).toHaveBeenCalledWith(videoId, updateDto);
    });

    it('debería tener el decorador Permission con Update y Video', () => {
      const metadata = Reflect.getMetadata('permission', controller.update);
      expect(metadata).toEqual({ action: Action.Update, subject: 'Video' });
    });
  });

  describe('remove', () => {
    it('debería eliminar un video existente', async () => {
      const videoId = 1;
      const deletedVideo = createMockVideo({ id: videoId });

      videoService.remove.mockResolvedValue(deletedVideo);

      const result = await controller.remove(videoId);

      expect(result).toEqual(deletedVideo);
      expect(videoService.remove).toHaveBeenCalledWith(videoId);
    });

    it('debería lanzar NotFoundException al intentar eliminar video inexistente', async () => {
      const videoId = 999;

      videoService.remove.mockRejectedValue(
        new NotFoundException(`Video con id ${videoId} no encontrado`),
      );

      await expect(controller.remove(videoId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('debería tener el decorador Permission con Delete y Video', () => {
      const metadata = Reflect.getMetadata('permission', controller.remove);
      expect(metadata).toEqual({ action: Action.Delete, subject: 'Video' });
    });
  });

  describe('Guardias de seguridad', () => {
    it('debería aplicar JwtAuthGuard a todos los endpoints', () => {
      const classGuards =
        Reflect.getMetadata('__guards__', controller.constructor) || [];
      const guardNames = classGuards.map((guard) => guard.name);
      expect(guardNames).toContain(JwtAuthGuard.name);
    });

    it('debería aplicar PoliciesGuard a todos los endpoints', () => {
      const classGuards =
        Reflect.getMetadata('__guards__', controller.constructor) || [];
      const guardNames = classGuards.map((guard) => guard.name);
      expect(guardNames).toContain(PoliciesGuard.name);
    });
  });
});
