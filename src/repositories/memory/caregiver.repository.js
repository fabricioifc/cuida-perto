/**
 * Repositório em memória para Cuidadores.
 * Fornece dados demonstrativos/fictícios para a primeira funcionalidade do CuidaPerto.
 * 
 * Regra de Ética (AGENTS.md): Todos os dados aqui contidos são fictícios e estritamente
 * rotulados como demonstração.
 */

const MOCK_CAREGIVERS = [
  {
    id: 'cuid-001',
    name: 'Maria Helena Silva',
    gender: 'Feminino',
    photoUrl: '/img/caregivers/maria-helena.svg',
    city: 'São Paulo',
    state: 'SP',
    neighborhoods: ['Pinheiros', 'Vila Mariana', 'Perdizes', 'Saúde'],
    modalities: [
      'Plantão 12h (Diurno)',
      'Acompanhamento Hospitalar / Consultas',
      'Cuidador Diarista / Meio Período'
    ],
    pricePerHour: 28,
    pricePerShift: 240,
    pricingDescription: 'R$ 28/h ou R$ 240 por plantão de 12h diurno',
    declaredExperience: 'Atuação declarada há mais de 6 anos no apoio a idosos com mobilidade reduzida, auxílio em medicação de rotina previamente prescrita e estimulação cognitiva leve.',
    declaredCourses: [
      'Curso de Cuidador de Idosos - Carga horária: 80h (Declarado)',
      'Noções Básicas de Primeiros Socorros (Declarado)',
      'Oficina de Estimulação Cognitiva na Terceira Idade (Declarado)'
    ],
    availability: 'Segunda a Sexta (Diurno) e Sábados alternados',
    status: 'APPROVED',
    isDemo: true,
    createdAt: new Date('2026-01-10T10:00:00Z')
  },
  {
    id: 'cuid-002',
    name: 'Carlos Eduardo Ramos',
    gender: 'Masculino',
    photoUrl: '/img/caregivers/carlos-eduardo.svg',
    city: 'São Paulo',
    state: 'SP',
    neighborhoods: ['Santana', 'Tucuruvi', 'Casa Verde', 'Mandaqui'],
    modalities: [
      'Plantão 12h (Noturno)',
      'Plantão 24h',
      'Folguista (Finais de Semana)'
    ],
    pricePerHour: 30,
    pricePerShift: 260,
    pricingDescription: 'R$ 260 por plantão noturno (12h) ou R$ 450 por plantão de 24h',
    declaredExperience: 'Experiência informada no acompanhamento noturno de idosos, suporte na transferência leito-cadeira e vigília atenta contra quedas.',
    declaredCourses: [
      'Curso de Capacitação em Cuidados com Idosos - 60h (Declarado)',
      'Boas Práticas de Prevenção de Quedas Domiciliares (Declarado)'
    ],
    availability: 'Terças, Quintas e Finais de semana (Noturno e 24h)',
    status: 'APPROVED',
    isDemo: true,
    createdAt: new Date('2026-01-15T14:30:00Z')
  },
  {
    id: 'cuid-003',
    name: 'Luciana Ferreira Santos',
    gender: 'Feminino',
    photoUrl: '/img/caregivers/luciana-ferreira.svg',
    city: 'Campinas',
    state: 'SP',
    neighborhoods: ['Cambuí', 'Barão Geraldo', 'Taquaral', 'Guanabara'],
    modalities: [
      'Plantão 12h (Diurno)',
      'Folguista (Finais de Semana)',
      'Cuidador Diarista / Meio Período'
    ],
    pricePerHour: 26,
    pricePerShift: 220,
    pricingDescription: 'R$ 26/h ou R$ 220 por diária de 8h a 12h',
    declaredExperience: 'Atendimento humanizado declarado com foco em companhia, passeios monitorados, controle de horários de alimentação e apoio emocional na melhor idade.',
    declaredCourses: [
      'Cuidador Social de Idosos - 120h (Declarado)',
      'Nutrição e Hidratação na Pessoa Idosa (Declarado)'
    ],
    availability: 'Quarta a Domingo (Período Diurno)',
    status: 'APPROVED',
    isDemo: true,
    createdAt: new Date('2026-02-01T09:00:00Z')
  },
  {
    id: 'cuid-004',
    name: 'Roberto de Almeida',
    gender: 'Masculino',
    photoUrl: '/img/caregivers/roberto-almeida.svg',
    city: 'Campinas',
    state: 'SP',
    neighborhoods: ['Nova Campinas', 'Vila Nova', 'Castelo'],
    modalities: [
      'Plantão 12h (Noturno)',
      'Acompanhamento Hospitalar / Consultas'
    ],
    pricePerHour: 29,
    pricePerShift: 250,
    pricingDescription: 'R$ 250 por plantão noturno ou R$ 32/h para acompanhamento hospitalar',
    declaredExperience: 'Experiência informada em suporte hospitalar em internações temporárias e vigília noturna domiciliar com registro minucioso da rotina para a família.',
    declaredCourses: [
      'Curso de Apoio Domiciliar ao Idoso - 80h (Declarado)'
    ],
    availability: 'Segunda a Quinta (Período Noturno)',
    status: 'APPROVED',
    isDemo: true,
    createdAt: new Date('2026-02-12T16:00:00Z')
  },
  {
    id: 'cuid-005',
    name: 'Ana Paula Mendonça',
    gender: 'Feminino',
    photoUrl: '/img/caregivers/ana-paula.svg',
    city: 'Santos',
    state: 'SP',
    neighborhoods: ['Gonzaga', 'Boqueirão', 'Embaré', 'Ponta da Praia'],
    modalities: [
      'Plantão 12h (Diurno)',
      'Folguista (Finais de Semana)',
      'Acompanhamento Hospitalar / Consultas'
    ],
    pricePerHour: 27,
    pricePerShift: 230,
    pricingDescription: 'R$ 27/h ou R$ 230 por plantão diurno de 12h',
    declaredExperience: 'Atuação declarada em apoio a idosos com Alzheimer em estágio inicial, estímulo a exercícios de memória, leitura conjunta e suporte nas atividades diárias.',
    declaredCourses: [
      'Cuidador de Idosos com Ênfase em Demências - 100h (Declarado)',
      'Comunicação Compassiva e Cuidado Humanizado (Declarado)'
    ],
    availability: 'Segunda a Sábado (Diurno)',
    status: 'APPROVED',
    isDemo: true,
    createdAt: new Date('2026-02-20T11:20:00Z')
  },
  {
    id: 'cuid-006',
    name: 'Patrícia Gomes Souza',
    gender: 'Feminino',
    photoUrl: '/img/caregivers/patricia-gomes.svg',
    city: 'São Paulo',
    state: 'SP',
    neighborhoods: ['Mooca', 'Tatuapé', 'Belém', 'Vila Prudente'],
    modalities: [
      'Plantão 24h',
      'Plantão 12h (Noturno)'
    ],
    pricePerHour: 32,
    pricePerShift: 480,
    pricingDescription: 'R$ 480 por plantão 24h ou R$ 270 por plantão noturno de 12h',
    declaredExperience: 'Atuação declarada em plantões 24h em esquema de revezamento, auxílio na higiene corporal, banho de leito e movimentação articular preventiva.',
    declaredCourses: [
      'Capacitação Profissional para Cuidadores - 160h (Declarado)',
      'Prevenção de Lesões por Pressão (Úlceras de Decúbito) (Declarado)'
    ],
    availability: 'Escala 12x36 ou 24x48',
    status: 'APPROVED',
    isDemo: true,
    createdAt: new Date('2026-02-25T13:45:00Z')
  },
  {
    id: 'cuid-007',
    name: 'Perfil Não Aprovado Teste',
    gender: 'Feminino',
    photoUrl: '/img/caregivers/default.svg',
    city: 'São Paulo',
    state: 'SP',
    neighborhoods: ['Centro'],
    modalities: ['Plantão 12h (Diurno)'],
    pricePerHour: 20,
    pricePerShift: 180,
    pricingDescription: 'R$ 180',
    declaredExperience: 'Perfil para validação de testes.',
    declaredCourses: [],
    availability: 'Qualquer horário',
    status: 'PENDING_REVIEW', // Não deve aparecer na busca pública
    isDemo: true,
    createdAt: new Date('2026-03-01T08:00:00Z')
  }
];

export class InMemoryCaregiverRepository {
  constructor(initialData = MOCK_CAREGIVERS) {
    this.caregivers = [...initialData];
  }

  /**
   * Retorna todos os cuidadores cadastrados.
   */
  async findAll() {
    return [...this.caregivers];
  }

  /**
   * Retorna apenas os cuidadores ativos e aprovados que correspondem aos filtros.
   * @param {Object} filters
   * @param {string} [filters.city] - Nome da cidade (normalizado)
   * @param {string} [filters.modality] - Modalidade de atendimento
   */
  async findByFilters({ city, modality } = {}) {
    return this.caregivers.filter((caregiver) => {
      // Regra: Somente perfis aprovados aparecem na busca pública
      if (caregiver.status !== 'APPROVED') {
        return false;
      }

      if (city) {
        const normalizedCaregiverCity = caregiver.city
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim();
        const normalizedQueryCity = city
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim();

        if (!normalizedCaregiverCity.includes(normalizedQueryCity)) {
          return false;
        }
      }

      if (modality && modality.trim() !== '') {
        const hasModality = caregiver.modalities.some((m) =>
          m.toLowerCase().includes(modality.toLowerCase().trim())
        );
        if (!hasModality) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Busca um cuidador específico pelo identificador.
   * @param {string} id
   */
  async findById(id) {
    const caregiver = this.caregivers.find((c) => c.id === id);
    return caregiver ? { ...caregiver } : null;
  }

  /**
   * Lista todas as cidades com cuidadores disponíveis para preenchimento de filtros.
   */
  async getAvailableCities() {
    const approved = this.caregivers.filter((c) => c.status === 'APPROVED');
    const cities = approved.map((c) => `${c.city} - ${c.state}`);
    return [...new Set(cities)].sort();
  }

  /**
   * Lista todas as modalidades distintas cadastradas no sistema.
   */
  async getAvailableModalities() {
    const approved = this.caregivers.filter((c) => c.status === 'APPROVED');
    const modalities = approved.flatMap((c) => c.modalities);
    return [...new Set(modalities)].sort();
  }
}

// Instância padrão compartilhada
export const caregiverRepository = new InMemoryCaregiverRepository();
