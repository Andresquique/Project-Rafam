/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { VideoController } from '../../src/video/video.controller';
import { VideoService } from '../../src/video/video.service';
import { JwtAuthGuard } from '../../src/auth/jwt/jwt.guard';
import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FilterVideoDto } from '../../src/video/dto/filter-video.dto';
import { Video } from '@prisma/client';

const mockUser = {
  userId: 1,
  email: 'test@example.com',
  nivel_actual_id: 3,
  rol: 'usuario',
};

const mockJwtAuthGuard = {
  canActivate: (context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    req.user = mockUser;
    return true;
  },
};

const mockVideo = {
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

describe('VideoController', () => {
  let controller: VideoController;
  let videoService: jest.Mocked<VideoService>;

  beforeEach(async () => {
    const videoServiceMock = {
      findQuery: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [
        {
          provide: VideoService,
          useValue: videoServiceMock,
        },
        {
          provide: Reflector,
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<VideoController>(VideoController);
    videoService = module.get(VideoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findQuery', () => {
    it('debería retornar videos filtrados correctamente', async () => {
      const query: FilterVideoDto = { nivel_id: 2, zona_muscular_id: 5 };
      const expectedVideos: Video[] = [mockVideo];

      videoService.findQuery.mockResolvedValue(expectedVideos);

      const result = await controller.findQuery(mockUser, query);

      expect(result).toEqual(expectedVideos);
      expect(videoService.findQuery).toHaveBeenCalledWith(
        mockUser.nivel_actual_id,
        query,
      );
    });

    it('debería propagar errores del servicio', async () => {
      const query: FilterVideoDto = { nivel_id: 4 };
      const error = new BadRequestException('No alcanzaste esta dificultad.');

      videoService.findQuery.mockRejectedValue(error);

      await expect(controller.findQuery(mockUser, query)).rejects.toThrow(
        error,
      );
    });

    it('debería manejar llamadas sin parámetros de query', async () => {
      const query = {} as FilterVideoDto;
      const expectedVideos: Video[] = [mockVideo];

      videoService.findQuery.mockResolvedValue(expectedVideos);

      const result = await controller.findQuery(mockUser, query);

      expect(result).toEqual(expectedVideos);
      expect(videoService.findQuery).toHaveBeenCalledWith(
        mockUser.nivel_actual_id,
        {},
      );
    });
  });

  describe('JwtAuthGuard', () => {
    it('debería estar aplicada al controlador', () => {
      const guards = Reflect.getMetadata('__guards__', VideoController);
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
