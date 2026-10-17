import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { AuthService } from '../../../src/services/auth.service.js';
import { InMemoryUserRepository, USER_ROLES } from '../../../src/repositories/memory/user.repository.js';
import { ValidationError } from '../../../src/utils/custom-errors.js';

describe('AuthService (Unit Tests)', () => {
  let mockRepo;
  let service;

  beforeEach(() => {
    mockRepo = new InMemoryUserRepository([]);
    service = new AuthService(mockRepo);
  });

  it('deve registrar uma família com sucesso e senha hasheada', async () => {
    const user = await service.register({
      name: 'Família Silva',
      email: 'familia.silva@exemplo.com',
      password: 'SenhaForte@123',
      role: USER_ROLES.FAMILY
    });

    assert.ok(user.id);
    assert.strictEqual(user.name, 'Família Silva');
    assert.strictEqual(user.email, 'familia.silva@exemplo.com');
    assert.strictEqual(user.role, USER_ROLES.FAMILY);
    // Não pode expor passwordHash
    assert.strictEqual(user.passwordHash, undefined);

    // Verifica que foi salvo com hash seguro no repositório
    const saved = await mockRepo.findByEmail('familia.silva@exemplo.com');
    assert.ok(saved.passwordHash.startsWith('$2'));
  });

  it('deve registrar um cuidador com sucesso', async () => {
    const user = await service.register({
      name: 'João Cuidador',
      email: 'joao@exemplo.com',
      password: 'SenhaForte@123',
      role: USER_ROLES.CAREGIVER
    });

    assert.strictEqual(user.role, USER_ROLES.CAREGIVER);
  });

  it('deve rejeitar cadastro com e-mail duplicado', async () => {
    await service.register({
      name: 'Primeiro Usuário',
      email: 'duplicado@exemplo.com',
      password: 'SenhaForte@123',
      role: USER_ROLES.FAMILY
    });

    await assert.rejects(
      async () => {
        await service.register({
          name: 'Segundo Usuário',
          email: 'duplicado@exemplo.com',
          password: 'OutraSenha@123',
          role: USER_ROLES.CAREGIVER
        });
      },
      (err) => {
        assert.ok(err instanceof ValidationError);
        assert.strictEqual(err.message, 'Este endereço de e-mail já está em uso na plataforma.');
        return true;
      }
    );
  });

  it('deve rejeitar senha com menos de 8 caracteres', async () => {
    await assert.rejects(
      async () => {
        await service.register({
          name: 'Senha Curta',
          email: 'curta@exemplo.com',
          password: '12345',
          role: USER_ROLES.FAMILY
        });
      },
      (err) => {
        assert.ok(err instanceof ValidationError);
        assert.ok(err.message.includes('mínimo 8 caracteres'));
        return true;
      }
    );
  });

  it('deve autenticar usuário com credenciais corretas', async () => {
    await service.register({
      name: 'Usuário Login',
      email: 'login@exemplo.com',
      password: 'MinhaSenha@123',
      role: USER_ROLES.FAMILY
    });

    const user = await service.authenticate({
      email: 'login@exemplo.com',
      password: 'MinhaSenha@123'
    });

    assert.ok(user);
    assert.strictEqual(user.email, 'login@exemplo.com');
    assert.strictEqual(user.passwordHash, undefined);
  });

  it('deve falhar autenticação com senha incorreta e mensagem genérica', async () => {
    await service.register({
      name: 'Usuário Login',
      email: 'login2@exemplo.com',
      password: 'MinhaSenha@123',
      role: USER_ROLES.FAMILY
    });

    await assert.rejects(
      async () => {
        await service.authenticate({
          email: 'login2@exemplo.com',
          password: 'SenhaErrada@999'
        });
      },
      (err) => {
        assert.ok(err instanceof ValidationError);
        assert.strictEqual(err.message, 'E-mail ou senha incorretos.');
        return true;
      }
    );
  });

  it('deve falhar autenticação para e-mail inexistente com mensagem genérica (anti-enumeração)', async () => {
    await assert.rejects(
      async () => {
        await service.authenticate({
          email: 'inexistente@exemplo.com',
          password: 'SenhaQualquer@123'
        });
      },
      (err) => {
        assert.ok(err instanceof ValidationError);
        assert.strictEqual(err.message, 'E-mail ou senha incorretos.');
        return true;
      }
    );
  });
});
