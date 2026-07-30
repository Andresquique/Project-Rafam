import { Injectable } from '@nestjs/common';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Action } from './enum/action.enum';
import { Perfil } from '@prisma/client';

@Injectable()
export class AbilityFactory {
  createForUser(perfil: Perfil) {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    if (perfil.rol === 'admin') {
      can(Action.Manage, 'all');
    }
    return build();
  }
}
