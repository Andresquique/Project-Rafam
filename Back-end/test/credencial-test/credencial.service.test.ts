/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CredencialService } from '../../src/credencial/credencial.service';
import { Credencial } from '../../src/credencial/entities/credencial.entity';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import * as bcrypt from 'bcrypt';
import { UpdateCredencialDto } from '../../src/credencial/dto/update-credencial.dto';

jest.mock('bcrypt');

describe('CredencialService', () => {
  let service: CredencialService;
  let credencialMock: DeepMockProxy<Credencial>;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CredencialService,
        {
          provide: Credencial,
          useValue: mockDeep<Credencial>(),
        },
      ],
    }).compile();

    service = module.get<CredencialService>(CredencialService);
    credencialMock = module.get(Credencial);
  });

  describe('update', () => {
    it('debería actualizar credencial con password hasheado', async () => {
      const id = 1;
      const dto: UpdateCredencialDto = {
        email: 'nuevo@mail.com',
        password: 'plainPassword',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValueOnce(dto.password);

      const mockResult = {
        id: 1,
        email: 'test@test.com',
        password: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      credencialMock.update.mockResolvedValueOnce(mockResult);

      const result = await service.update(id, dto);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(credencialMock.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(mockResult);
    });

    it('debería actualizar credencial sin password si no se envía', async () => {
      const id = 1;
      const dto: UpdateCredencialDto = {
        email: 'nuevo@mail.com',
      };

      const mockResult = { id, email: dto.email, password: 'hash' };
      credencialMock.update.mockResolvedValueOnce(mockResult as any);

      const result = await service.update(id, dto);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(credencialMock.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findByEmail', () => {
    it('debería retornar credencial por email', async () => {
      const email = 'test@mail.com';
      const mockResult = { id: 1, email, password: 'hash' };

      credencialMock.findByEmail.mockResolvedValueOnce(mockResult as any);

      const result = await service.findByEmail(email);

      expect(credencialMock.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockResult);
    });
  });

  describe('create', () => {
    it('debería crear credencial', async () => {
      const email = 'create@mail.com';
      const password = 'hashed';
      const mockResult = { id: 1, email, password };

      credencialMock.create.mockResolvedValueOnce(mockResult as any);

      const result = await service.create(email, password);

      expect(credencialMock.create).toHaveBeenCalledWith(email, password);
      expect(result).toEqual(mockResult);
    });
  });
});
