/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AbilityFactory } from './ability.factory';
import { Reflector } from '@nestjs/core';
import { RequiredPermission } from './decorators/permissions.decorator';
import { Perfil } from '@prisma/client';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.get<RequiredPermission[]>(
        'permissions',
        context.getHandler(),
      ) || [];

    const request = context.switchToHttp().getRequest();
    const perfil: Perfil = request.user;
    const ability = this.abilityFactory.createForUser(perfil);

    for (const permission of requiredPermissions) {
      if (!ability.can(permission.action, permission.subject)) {
        throw new ForbiddenException(
          `No tienes permiso para ${permission.action} este ${permission.subject}`,
        );
      }
    }

    return true;
  }
}
