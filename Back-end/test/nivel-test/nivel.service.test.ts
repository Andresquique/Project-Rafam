/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NivelService } from '../../src/nivel/nivel.service';
import { Nivel } from '../../src/nivel/entities/nivel.entity';
import { CreateNivelDto } from '../../src/nivel/dto/create-nivel.dto';
import { UpdateNivelDto } from '../../src/nivel/dto/update-nivel.dto';
import { Nivel as NivelP } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('NivelService', () => {
  let service: NivelService;
  let nivelMock: DeepMockProxy<Nivel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NivelService,
        {
          provide: Nivel,
          useValue: mockDeep<Nivel>(),
        },
      ],
    }).compile();

    service = module.get<NivelService>(NivelService);
    nivelMock = module.get(Nivel);
  });

  it('debería crear un nivel con el DTO correcto', async () => {
    const dto: CreateNivelDto = {
      nombre: 'Principiante',
      numero_orden: 1,
    };
    const esperado = {
      id: 1,
      nombre: 'Principiante',
      numero_orden: 1,
    } as NivelP;

    nivelMock.create.mockResolvedValue(esperado);

    const resultado = await service.create(dto);
    expect(nivelMock.create).toHaveBeenCalledWith(dto);
    expect(resultado).toEqual(esperado);
  });

  it('debería devolver todos los niveles', async () => {
    const niveles = [
      { id: 1, nombre: 'Principiante', numero_orden: 1 },
    ] as NivelP[];

    nivelMock.findMany.mockResolvedValue(niveles);

    const resultado = await service.findAll();
    expect(nivelMock.findMany).toHaveBeenCalled();
    expect(resultado).toEqual(niveles);
  });

  it('debería devolver un nivel por ID', async () => {
    const nivel = { id: 1, nombre: 'Principiante', numero_orden: 1 } as NivelP;

    nivelMock.findOrThrow.mockResolvedValue(nivel);

    const resultado = await service.findOne(1);
    expect(nivelMock.findOrThrow).toHaveBeenCalledWith(1);
    expect(resultado).toEqual(nivel);
  });

  it('debería actualizar un nivel', async () => {
    const dto: UpdateNivelDto = {
      nombre: 'Intermedio',
      numero_orden: 2,
    };
    const actualizado = {
      id: 1,
      nombre: 'Intermedio',
      numero_orden: 2,
    } as NivelP;

    nivelMock.update.mockResolvedValue(actualizado);

    const resultado = await service.update(1, dto);
    expect(nivelMock.update).toHaveBeenCalledWith(1, dto);
    expect(resultado).toEqual(actualizado);
  });

  it('debería eliminar un nivel', async () => {
    const eliminado = {
      id: 1,
      nombre: 'Principiante',
      numero_orden: 1,
    } as NivelP;

    nivelMock.delete.mockResolvedValue(eliminado);

    const resultado = await service.remove(1);
    expect(nivelMock.delete).toHaveBeenCalledWith(1);
    expect(resultado).toEqual(eliminado);
  });
});
