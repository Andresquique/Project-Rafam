/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { AuthDto } from '../../src/auth/dto/auth.dto';
import { JwtAuthGuard } from '../../src/auth/jwt/jwt.guard';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

class MockJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    req.user = { userId: 1, email: 'test@test.com', rol: 'user' };
    return true;
  }
}

describe('AuthController', () => {
  let controller: AuthController;
  let authServiceMock: DeepMockProxy<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockDeep<AuthService>() }],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
    authServiceMock = module.get(AuthService);
  });

  describe('register', () => {
    it('debería registrar un usuario y devolver el access_token', async () => {
      const dto: AuthDto = { email: 'test@test.com', password: '123456' };
      const esperado = { access_token: 'token' };

      authServiceMock.register.mockResolvedValue(esperado);

      const resultado = await controller.register(dto);

      expect(authServiceMock.register).toHaveBeenCalledWith(dto);
      expect(resultado).toEqual(esperado);
    });
  });

  describe('login', () => {
    it('debería loguear un usuario y devolver el access_token', async () => {
      const dto: AuthDto = { email: 'test@test.com', password: '123456' };
      const esperado = { access_token: 'token' };

      authServiceMock.login.mockResolvedValue(esperado);

      const resultado = await controller.login(dto);

      expect(authServiceMock.login).toHaveBeenCalledWith(dto);
      expect(resultado).toEqual(esperado);
    });
  });

  describe('getProfile', () => {
    it('debería devolver el perfil del usuario autenticado', () => {
      const mockRequest = {
        user: {
          userId: 1,
          email: 'test@test.com',
          rol: 'user',
        },
      } as unknown as Request;

      const resultado = controller.getProfile(mockRequest);

      expect(resultado).toEqual(mockRequest.user);
    });
  });
});
