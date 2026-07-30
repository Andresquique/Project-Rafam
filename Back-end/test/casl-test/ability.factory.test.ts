import { AbilityFactory } from '../../src/casl/ability.factory';
import { Action } from '../../src/casl/enum/action.enum';
import { mock } from 'jest-mock-extended';
import { Perfil } from '@prisma/client';

describe('AbilityFactory', () => {
  let factory: AbilityFactory;

  beforeEach(() => {
    factory = new AbilityFactory();
  });

  it('debería permitir "manage all" si el perfil es admin', () => {
    const perfil = mock<Perfil>({
      rol: 'admin',
    });

    const ability = factory.createForUser(perfil);

    expect(ability.can(Action.Manage, 'all')).toBe(true);
  });

  it('no debería permitir "manage all" si el perfil no es admin', () => {
    const perfil = mock<Perfil>({
      rol: 'user',
    });

    const ability = factory.createForUser(perfil);

    expect(ability.can(Action.Manage, 'all')).toBe(false);
  });
});
