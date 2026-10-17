import { caregiverRepository } from '../repositories/memory/caregiver.repository.js';
import { NotFoundError } from '../utils/custom-errors.js';

export class CaregiverService {
  constructor(repository = caregiverRepository) {
    this.repository = repository;
  }

  /**
   * Busca cuidadores com base na cidade e modalidade informadas.
   * Aplica normalização e sanitização básica nos filtros.
   * 
   * @param {Object} filters
   * @param {string} [filters.city]
   * @param {string} [filters.modality]
   */
  async searchCaregivers({ city, modality } = {}) {
    // Hardening: Limite de 100 caracteres para evitar sobrecarga de processamento / ReDoS
    const cleanCity = typeof city === 'string' ? city.trim().substring(0, 100) : '';
    const cleanModality = typeof modality === 'string' ? modality.trim().substring(0, 100) : '';

    const results = await this.repository.findByFilters({
      city: cleanCity,
      modality: cleanModality
    });

    return results;
  }

  /**
   * Obtém os detalhes completos de um cuidador pelo seu ID.
   * Lança NotFoundError se o cuidador não existir.
   * 
   * @param {string} id
   */
  async getCaregiverById(id) {
    if (!id || typeof id !== 'string') {
      throw new NotFoundError('Identificador de cuidador inválido.');
    }

    const caregiver = await this.repository.findById(id.trim());

    if (!caregiver) {
      throw new NotFoundError('Cuidador não encontrado.');
    }

    return caregiver;
  }

  /**
   * Retorna os dados auxiliares para preencher os seletores de busca (cidades e modalidades disponíveis).
   */
  async getSearchOptions() {
    const [cities, modalities] = await Promise.all([
      this.repository.getAvailableCities(),
      this.repository.getAvailableModalities()
    ]);

    return { cities, modalities };
  }
}

export const caregiverService = new CaregiverService();
