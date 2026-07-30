/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CanActivate } from '@nestjs/common';
import { PoliciesGuard } from '../../src/casl/policies.guard';
import MockDate from 'mockdate';
import { NivelController } from '../../src/nivel/nivel.controller';
import { NivelService } from '../../src/nivel/nivel.service';
import { CreateNivelDto } from '../../src/nivel/dto/create-nivel.dto';
import { UpdateNivelDto } from '../../src/nivel/dto/update-nivel.dto';
import { Nivel } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

class MockPoliciesGuard implements CanActivate {
  canActivate() {
    return true;
  }
}

MockDate.set('2025-06-13');

describe('NivelController', () => {
  let controller: NivelController;
  let service: DeepMockProxy<NivelService>;

  const nivelMock: Nivel = {
    id: 1,
    nombre: 'Principiante',
    numero_orden: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NivelController],
      providers: [
        { provide: NivelService, useValue: mockDeep<NivelService>() },
      ],
    })
      .overrideGuard(PoliciesGuard)
      .useClass(MockPoliciesGuard)
      .compile();

    controller = module.get<NivelController>(NivelController);
    service = module.get(NivelService);

    service.create.mockResolvedValue(nivelMock);
    service.findAll.mockResolvedValue([nivelMock]);
    service.findOne.mockResolvedValue(nivelMock);
    service.update.mockResolvedValue(nivelMock);
    service.remove.mockResolvedValue(nivelMock);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un nivel y devolverlo', async () => {
      const dto: CreateNivelDto = {
        nombre: 'Principiante',
        numero_orden: 1,
      };
      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(nivelMock);
    });
  });

  describe('findAll', () => {
    it('debería devolver un arreglo de niveles', async () => {
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([nivelMock]);
    });
  });

  describe('findOne', () => {
    it('debería devolver un nivel por ID', async () => {
      const result = await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(nivelMock);
    });
  });

  describe('update', () => {
    it('debería actualizar un nivel y devolverlo', async () => {
      const dto: UpdateNivelDto = {
        nombre: 'Intermedio',
        numero_orden: 2,
      };
      const result = await controller.update(1, dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(nivelMock);
    });
  });

  describe('remove', () => {
    it('debería eliminar un nivel y devolverlo', async () => {
      const result = await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(nivelMock);
    });
  });
});
