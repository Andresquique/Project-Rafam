/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { Credencial } from '../../src/credencial/entities/credencial.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Prisma } from '@prisma/client';

describe('Credencial', () => {
  let service: Credencial;
  let prisma: DeepMockProxy<PrismaService>;

  const credencialMock = {
    id: 1,
    email: 'test@test.com',
    password: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Credencial,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    service = module.get<Credencial>(Credencial);
    prisma = module.get(PrismaService);
  });

  describe('update', () => {
    it('debería actualizar una credencial', async () => {
      const id = 1;
      const data: Prisma.CredencialUpdateInput = { email: 'test@test.com' };

      prisma.credencial.update.mockResolvedValueOnce(credencialMock);

      const result = await service.update(id, data);
      expect(result).toEqual(credencialMock);
      expect(prisma.credencial.update).toHaveBeenCalledWith({
        where: { id },
        data,
      });
    });
  });

  describe('create', () => {
    it('debería crear una credencial con perfil', async () => {
      const email = 'test@mail.com';
      const password = 'hashedpass';
      const mockResult = {
        id: 1,
        email,
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
        perfil: { id: 1, nivel_actual_id: 0 },
      };

      prisma.credencial.create.mockResolvedValueOnce(mockResult);

      const result = await service.create(email, password);
      expect(result).toEqual(mockResult);
      expect(prisma.credencial.create).toHaveBeenCalledWith({
        data: {
          email,
          password,
          perfil: { create: { nivel_actual_id: 0 } },
        },
        include: { perfil: true },
      });
    });
  });

  describe('findByEmail', () => {
    it('debería encontrar una credencial por email', async () => {
      const email = 'test@test.com';

      prisma.credencial.findUnique.mockResolvedValueOnce(credencialMock);

      const result = await service.findByEmail(email);
      expect(result).toEqual(credencialMock);
      expect(prisma.credencial.findUnique).toHaveBeenCalledWith({
        where: { email },
        include: { perfil: true },
      });
    });
  });
});
