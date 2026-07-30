/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, type TestingModule } from '@nestjs/testing';
import { PoliciesGuard } from '../../src/casl/policies.guard';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../../src/casl/ability.factory';
import { ForbiddenException } from '@nestjs/common';
import { mockDeep, mock } from 'jest-mock-extended';
import type { ExecutionContext } from '@nestjs/common';
import type { Perfil } from '@prisma/client';
import type { MongoAbility } from '@casl/ability';

describe('PoliciesGuard', () => {
  let guard: PoliciesGuard;
  const mockReflector = mockDeep<Reflector>();
  const mockAbilityFactory = mockDeep<AbilityFactory>();

  const createMockAbility = (can: boolean) => {
    return {
      can: jest.fn().mockReturnValue(can),
      cannot: jest.fn(),
      relevantRuleFor: jest.fn(),
      _hasPerFieldRules: false,
      _indexedRules: {},
      rules: [],
      possibleRules: [],
      update: jest.fn(),
      forbid: jest.fn(),
      permit: jest.fn(),
      buildRuleFor: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      toJSON: jest.fn(),
      fromJSON: jest.fn(),
      squash: jest.fn(),
      packRules: jest.fn(),
      unpackRules: jest.fn(),
      detectSubjectType: jest.fn(),
      isPureAbility: jest.fn(),
    } as unknown as MongoAbility<any, any>;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoliciesGuard,
        { provide: Reflector, useValue: mockReflector },
        { provide: AbilityFactory, useValue: mockAbilityFactory },
      ],
    }).compile();

    guard = module.get<PoliciesGuard>(PoliciesGuard);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('Debe devolver true cuando se tienen los permisos', async () => {
      const mockContext = mock<ExecutionContext>();
      const mockUser = mock<Perfil>();
      const mockRequest = { user: mockUser };

      mockContext.switchToHttp.mockReturnValue({
        getRequest: () => mockRequest,
      } as any);

      const requiredPermissions = [
        { action: 'read', subject: 'Post' },
        { action: 'update', subject: 'Profile' },
      ];

      mockReflector.get.mockReturnValue(requiredPermissions);

      const mockAbility = createMockAbility(true);
      mockAbilityFactory.createForUser.mockReturnValue(mockAbility);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockReflector.get).toHaveBeenCalledWith(
        'permissions',
        mockContext.getHandler(),
      );
      expect(mockAbilityFactory.createForUser).toHaveBeenCalledWith(mockUser);
      expect(mockAbility.can).toHaveBeenCalledWith('read', 'Post');
      expect(mockAbility.can).toHaveBeenCalledWith('update', 'Profile');
    });

    it('Debe dar el mensaje de error indicado en ForbiddenException', async () => {
      const mockContext = mock<ExecutionContext>();
      const mockUser = mock<Perfil>();
      const mockRequest = { user: mockUser };

      mockContext.switchToHttp.mockReturnValue({
        getRequest: () => mockRequest,
      } as any);

      const requiredPermissions = [{ action: 'create', subject: 'Comment' }];

      mockReflector.get.mockReturnValue(requiredPermissions);

      const mockAbility = createMockAbility(false);
      mockAbilityFactory.createForUser.mockReturnValue(mockAbility);

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new ForbiddenException('No tienes permiso para create este Comment'),
      );
    });
  });
});
