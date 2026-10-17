import bcrypt from 'bcryptjs';

/**
 * Papéis de Usuário (RBAC) do CuidaPerto
 */
export const USER_ROLES = {
  FAMILY: 'ROLE_FAMILY',
  CAREGIVER: 'ROLE_CAREGIVER',
  ADMIN: 'ROLE_ADMIN'
};

// Hash síncrono para seed de demonstração inicial
const defaultHash = (password) => bcrypt.hashSync(password, 10);

const SEED_USERS = [
  {
    id: 'usr-admin-01',
    name: 'Administrador CuidaPerto',
    email: 'admin@cuidaperto.com',
    passwordHash: defaultHash('Admin@12345'),
    role: USER_ROLES.ADMIN,
    createdAt: new Date('2026-01-01T00:00:00Z')
  },
  {
    id: 'usr-cuidador-01',
    name: 'Maria Helena Silva',
    email: 'maria@cuidaperto.com',
    passwordHash: defaultHash('Cuidador@123'),
    role: USER_ROLES.CAREGIVER,
    caregiverProfileId: 'cuid-001',
    createdAt: new Date('2026-01-10T10:00:00Z')
  },
  {
    id: 'usr-familia-01',
    name: 'Fernanda Oliveira',
    email: 'familia@cuidaperto.com',
    passwordHash: defaultHash('Familia@123'),
    role: USER_ROLES.FAMILY,
    createdAt: new Date('2026-02-01T15:00:00Z')
  }
];

export class InMemoryUserRepository {
  constructor(initialUsers = SEED_USERS) {
    this.users = [...initialUsers];
  }

  /**
   * Salva um novo usuário no repositório em memória.
   * @param {Object} userData
   */
  async create({ name, email, passwordHash, role, caregiverProfileId = null }) {
    const newUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role,
      caregiverProfileId,
      createdAt: new Date()
    };

    this.users.push(newUser);
    return { ...newUser };
  }

  /**
   * Localiza um usuário pelo seu e-mail (insensível a maiúsculas/minúsculas).
   * @param {string} email
   */
  async findByEmail(email) {
    if (!email) return null;
    const normalized = email.trim().toLowerCase();
    const user = this.users.find((u) => u.email === normalized);
    return user ? { ...user } : null;
  }

  /**
   * Localiza um usuário pelo seu identificador único.
   * @param {string} id
   */
  async findById(id) {
    if (!id) return null;
    const user = this.users.find((u) => u.id === id);
    return user ? { ...user } : null;
  }

  /**
   * Lista todos os usuários (útil para auditoria e testes).
   */
  async findAll() {
    return this.users.map((u) => ({ ...u }));
  }

  /**
   * Reseta o banco em memória (utilizado em testes para garantir isolamento).
   */
  async reset(seed = SEED_USERS) {
    this.users = [...seed];
  }
}

export const userRepository = new InMemoryUserRepository();
