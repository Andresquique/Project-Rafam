/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ZonaMuscularController } from '../../src/zona-muscular/zona-muscular.controller';
import { ZonaMuscularService } from '../../src/zona-muscular/zona-muscular.service';
import { CreateZonaMuscularDto } from '../../src/zona-muscular/dto/create-zona-muscular.dto';
import { UpdateZonaMuscularDto } from '../../src/zona-muscular/dto/update-zona-muscular.dto';
import { ZonaMuscular } from '@prisma/client';
import { CanActivate } from '@nestjs/common';
import { PoliciesGuard } from '../../src/casl/policies.guard';
import MockDate from 'mockdate';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

class MockPoliciesGuard implements CanActivate {
  canActivate() {
    return true;
  }
}

MockDate.set('2025-06-13');

describe('ZonaMuscularController', () => {
  let controller: ZonaMuscularController;
  let service: DeepMockProxy<ZonaMuscularService>;

  const zonaMock: ZonaMuscular = {
    id: 1,
    nombre: 'Pecho',
    descripcion: 'Trabaja los pectorales',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZonaMuscularController],
      providers: [
        {
          provide: ZonaMuscularService,
          useValue: mockDeep<ZonaMuscularService>(),
        },
      ],
    })
      .overrideGuard(PoliciesGuard)
      .useClass(MockPoliciesGuard)
      .compile();

    controller = module.get<ZonaMuscularController>(ZonaMuscularController);
    service = module.get(ZonaMuscularService);
    service.create.mockResolvedValue(zonaMock);
    service.findAll.mockResolvedValue([zonaMock]);
    service.findOne.mockResolvedValue(zonaMock);
    service.update.mockResolvedValue(zonaMock);
    service.remove.mockResolvedValue(zonaMock);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una zona muscular y devolverla', async () => {
      const dto: CreateZonaMuscularDto = {
        nombre: 'Espalda',
        descripcion: 'trabaja espalda',
      };
      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(zonaMock);
    });
  });

  describe('findAll', () => {
    it('debería devolver un arreglo de zonas musculares', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([zonaMock]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería devolver una zona muscular', async () => {
      const result = await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(zonaMock);
    });
  });

  describe('update', () => {
    it('debería actualizar una zona muscular y devolverla', async () => {
      const dto: UpdateZonaMuscularDto = {
        nombre: 'Hombros',
        descripcion: 'Trabaja hombros',
      };
      const result = await controller.update(1, dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(zonaMock);
    });
  });

  describe('remove', () => {
    it('debería eliminar una zona muscular y devolverla', async () => {
      const result = await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(zonaMock);
    });
  });
});
