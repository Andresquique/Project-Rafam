/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CredencialService } from '../../src/credencial/credencial.service';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from '../../src/auth/dto/auth.dto';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let credencialMock: jest.Mocked<CredencialService>;
  let jwtServiceMock: jest.Mocked<JwtService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: CredencialService,
          useValue: { findByEmail: jest.fn(), create: jest.fn() },
        },
        { provide: JwtService, useValue: { sign: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    credencialMock = module.get(CredencialService);
    jwtServiceMock = module.get(JwtService);
  });

  describe('register', () => {
    it('debería registrar un nuevo usuario y devolver token', async () => {
      const dto: AuthDto = { email: 'test@test.com', password: '123456' };

      credencialMock.findByEmail.mockResolvedValueOnce(null);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedPassword');
      const user = {
        id: 1,
        email: dto.email,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        perfil: {
          id: 1,
          credencialesId: 1,
          nombre: 'Perfil Test',
          rol: 'usuario',
          nivel_actual_id: 1,
          fecha_ultima_evaluacion: new Date(),
          fecha_nacimiento: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      credencialMock.create.mockResolvedValueOnce(user);
      jwtServiceMock.sign.mockReturnValueOnce('token');

      const result = await service.register(dto);

      expect(credencialMock.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(credencialMock.create).toHaveBeenCalledWith(
        dto.email,
        'hashedPassword',
      );
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        userId: user.id,
        email: user.email,
        rol: user.perfil.rol,
        nivel_actual_id: user.perfil.nivel_actual_id,
      });
      expect(result).toEqual({ access_token: 'token' });
    });

    it('debería lanzar ConflictException si el email ya existe', async () => {
      const dto: AuthDto = { email: 'existing@test.com', password: '123456' };
      credencialMock.findByEmail.mockResolvedValueOnce({ id: 1 } as any);

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(credencialMock.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('debería loguear usuario y devolver token', async () => {
      const dto: AuthDto = { email: 'test@test.com', password: '123456' };
      const user = {
        id: 1,
        email: dto.email,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        perfil: {
          id: 1,
          credencialesId: 1,
          nombre: 'Perfil Test',
          rol: 'usuario',
          nivel_actual_id: 1,
          fecha_ultima_evaluacion: new Date(),
          fecha_nacimiento: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      credencialMock.findByEmail.mockResolvedValueOnce(user);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      jwtServiceMock.sign.mockReturnValueOnce('token');

      const result = await service.login(dto);

      expect(credencialMock.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(dto.password, user.password);
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        userId: user.id,
        email: user.email,
        rol: user.perfil.rol,
        nivel_actual_id: user.perfil.nivel_actual_id,
      });
      expect(result).toEqual({ access_token: 'token' });
    });

    it('debería lanzar UnauthorizedException si email o password es incorrecto', async () => {
      const dto: AuthDto = { email: 'test@test.com', password: 'wrong' };
      credencialMock.findByEmail.mockResolvedValueOnce(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('debería lanzar UnauthorizedException si password es incorrecto', async () => {
      const dto: AuthDto = { email: 'test@test.com', password: 'wrong' };
      credencialMock.findByEmail.mockResolvedValueOnce({
        id: 1,
        email: dto.email,
        password: 'hashedPassword',
        perfil: { rol: 'user', nivel_actual_id: 0 },
      } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
