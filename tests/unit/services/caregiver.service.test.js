import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CaregiverService } from '../../../src/services/caregiver.service.js';
import { InMemoryCaregiverRepository } from '../../../src/repositories/memory/caregiver.repository.js';
import { NotFoundError } from '../../../src/utils/custom-errors.js';

describe('CaregiverService (Unit Tests)', () => {
  const mockRepo = new InMemoryCaregiverRepository();
  const service = new CaregiverService(mockRepo);

  it('deve listar apenas cuidadores com status APPROVED na busca geral', async () => {
    const caregivers = await service.searchCaregivers({});
    assert.ok(caregivers.length > 0);
    caregivers.forEach((c) => {
      assert.strictEqual(c.status, 'APPROVED');
    });

    const hasPending = caregivers.some((c) => c.status === 'PENDING_REVIEW');
    assert.strictEqual(hasPending, false);
  });

  it('deve filtrar cuidadores por cidade de forma insensível a maiúsculas e acentos', async () => {
    const comAcento = await service.searchCaregivers({ city: 'São Paulo' });
    const semAcento = await service.searchCaregivers({ city: 'sao paulo' });

    assert.ok(comAcento.length > 0);
    assert.strictEqual(comAcento.length, semAcento.length);
    comAcento.forEach((c) => {
      assert.strictEqual(c.city, 'São Paulo');
    });
  });

  it('deve filtrar cuidadores por modalidade de atendimento', async () => {
    const results = await service.searchCaregivers({
      city: 'São Paulo',
      modality: 'Plantão 24h'
    });

    assert.ok(results.length > 0);
    results.forEach((c) => {
      assert.ok(c.modalities.includes('Plantão 24h'));
    });
  });

  it('deve retornar array vazio quando nenhuma cidade ou modalidade corresponder', async () => {
    const results = await service.searchCaregivers({
      city: 'Cidade Inexistente 12345'
    });

    assert.deepStrictEqual(results, []);
  });

  it('deve retornar os detalhes de um cuidador quando o ID existir', async () => {
    const caregiver = await service.getCaregiverById('cuid-001');

    assert.ok(caregiver);
    assert.strictEqual(caregiver.id, 'cuid-001');
    assert.strictEqual(caregiver.name, 'Maria Helena Silva');
    assert.strictEqual(caregiver.isDemo, true);
  });

  it('deve lançar NotFoundError ao buscar um ID inexistente', async () => {
    await assert.rejects(
      async () => {
        await service.getCaregiverById('id-que-nao-existe');
      },
      (err) => {
        assert.ok(err instanceof NotFoundError);
        assert.strictEqual(err.statusCode, 404);
        return true;
      }
    );
  });

  it('deve retornar opções válidas de cidades e modalidades para preencher seletores', async () => {
    const options = await service.getSearchOptions();

    assert.ok(Array.isArray(options.cities));
    assert.ok(Array.isArray(options.modalities));
    assert.ok(options.cities.includes('São Paulo - SP'));
    assert.ok(options.modalities.length > 0);
  });
});
