/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../../src/auth/jwt/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { mock } from 'jest-mock-extended';
import { JwtPayload } from '../../src/auth/jwt/jwt.payload';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  const configServiceMock = mock<ConfigService>();

  beforeEach(async () => {
    configServiceMock.get.mockReturnValue('test-secret');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('debería configurar correctamente la estrategia JWT', () => {
    expect(configServiceMock.get).toHaveBeenCalledWith('JWT_SECRET');
  });

  it('validate debería retornar el mismo payload', () => {
    const payload: JwtPayload = {
      userId: 1,
      email: 'test@test.com',
      rol: 'admin',
      nivel_actual_id: 2,
    };

    const result = strategy.validate(payload);

    expect(result).toEqual(payload);
  });
});
