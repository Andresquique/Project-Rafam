/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ZonaMuscularService } from '../../src/zona-muscular/zona-muscular.service';
import { ZonaMuscular } from '../../src/zona-muscular/entities/zona-muscular.entity';
import { CreateZonaMuscularDto } from '../../src/zona-muscular/dto/create-zona-muscular.dto';
import { UpdateZonaMuscularDto } from '../../src/zona-muscular/dto/update-zona-muscular.dto';
import { ZonaMuscular as ZonaM } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('ZonaMuscularService', () => {
  let service: ZonaMuscularService;
  let zonaMock: DeepMockProxy<ZonaMuscular>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZonaMuscularService,
        {
          provide: ZonaMuscular,
          useValue: mockDeep<ZonaMuscular>(),
        },
      ],
    }).compile();

    service = module.get<ZonaMuscularService>(ZonaMuscularService);
    zonaMock = module.get(ZonaMuscular);
  });

  it('debería crear una zona muscular con el DTO correcto', async () => {
    const dto: CreateZonaMuscularDto = {
      nombre: 'Pecho',
      descripcion: 'Ejercicios para pecho',
    };
    const esperado = {
      id: 1,
      nombre: 'Pecho',
      descripcion: 'Ejercicios para pecho',
    } as ZonaM;

    zonaMock.create.mockResolvedValue(esperado);

    const resultado = await service.create(dto);
    expect(zonaMock.create).toHaveBeenCalledWith(dto);
    expect(resultado).toEqual(esperado);
  });

  it('debería devolver todas las zonas musculares', async () => {
    const zonas = [
      { id: 1, nombre: 'Espalda', descripcion: 'Ejercicios para espalda' },
    ] as ZonaM[];

    zonaMock.findMany.mockResolvedValue(zonas);

    const resultado = await service.findAll();
    expect(zonaMock.findMany).toHaveBeenCalled();
    expect(resultado).toEqual(zonas);
  });

  it('debería devolver una zona muscular por id', async () => {
    const zona = { id: 1, nombre: 'Piernas' } as ZonaM;

    zonaMock.findOrThrow.mockResolvedValue(zona);

    const resultado = await service.findOne(1);
    expect(zonaMock.findOrThrow).toHaveBeenCalledWith(1);
    expect(resultado).toEqual(zona);
  });

  it('debería actualizar una zona muscular', async () => {
    const dto: UpdateZonaMuscularDto = {
      nombre: 'Hombros',
      descripcion: 'Ejercicios para hombros',
    };
    const actualizado = {
      id: 1,
      nombre: 'Pecho',
      descripcion: 'Ejercicios para hombros',
    } as ZonaM;

    zonaMock.update.mockResolvedValue(actualizado);

    const resultado = await service.update(1, dto);
    expect(zonaMock.update).toHaveBeenCalledWith(1, dto);
    expect(resultado).toEqual(actualizado);
  });

  it('debería eliminar una zona muscular', async () => {
    const eliminado = { id: 1, nombre: 'Cuádriceps' } as ZonaM;

    zonaMock.delete.mockResolvedValue(eliminado);

    const resultado = await service.remove(1);
    expect(zonaMock.delete).toHaveBeenCalledWith(1);
    expect(resultado).toEqual(eliminado);
  });
});
