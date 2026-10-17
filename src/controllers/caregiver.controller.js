import { caregiverService } from '../services/caregiver.service.js';
import { NotFoundError } from '../utils/custom-errors.js';

export class CaregiverController {
  constructor(service = caregiverService) {
    this.service = service;
  }

  /**
   * Renderiza a página inicial (Home) com campo de busca e cuidadores em destaque.
   */
  renderHome = async (req, res, next) => {
    try {
      const { modalities } = await this.service.getSearchOptions();
      const allApproved = await this.service.searchCaregivers({});
      // Destaque para os primeiros 3 cuidadores
      const featuredCaregivers = allApproved.slice(0, 3);

      return res.renderWithLayout('pages/home', {
        title: 'Cuidado humanizado e transparente para idosos',
        modalities,
        featuredCaregivers
      });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Processa a busca e filtros por localidade e modalidade.
   */
  renderSearch = async (req, res, next) => {
    try {
      const { city, modality } = req.query;
      const { modalities } = await this.service.getSearchOptions();

      const caregivers = await this.service.searchCaregivers({
        city: city || '',
        modality: modality || ''
      });

      return res.renderWithLayout('pages/search', {
        title: 'Buscar Cuidadores de Idosos',
        caregivers,
        modalities,
        query: { city, modality }
      });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Renderiza a página de detalhes do perfil público do cuidador.
   */
  renderDetail = async (req, res, next) => {
    try {
      const { id } = req.params;
      const caregiver = await this.service.getCaregiverById(id);

      return res.renderWithLayout('pages/caregiver-detail', {
        title: `${caregiver.name} — Cuidador(a) de Idosos`,
        caregiver
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(404).renderWithLayout('pages/errors/404', {
          title: 'Cuidador não encontrado'
        });
      }
      return next(error);
    }
  };
}

export const caregiverController = new CaregiverController();
