import bcrypt from 'bcryptjs';
import { userRepository, USER_ROLES } from '../repositories/memory/user.repository.js';
import { ValidationError } from '../utils/custom-errors.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class AuthService {
  constructor(repository = userRepository) {
    this.repository = repository;
  }

  /**
   * Registra um novo usuário no sistema com hashing seguro de senha.
   * 
   * @param {Object} params
   * @param {string} params.name
   * @param {string} params.email
   * @param {string} params.password
   * @param {string} params.role
   */
  async register({ name, email, password, role }) {
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      throw new ValidationError('O nome completo deve ter pelo menos 2 caracteres.');
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      throw new ValidationError('Por favor, informe um endereço de e-mail válido.');
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      throw new ValidationError('A senha deve ter no mínimo 8 caracteres.');
    }

    const validRoles = Object.values(USER_ROLES);
    if (!role || !validRoles.includes(role)) {
      throw new ValidationError('Papel de usuário inválido.');
    }

    // Prevenção de duplicidade de e-mail
    const existing = await this.repository.findByEmail(email);
    if (existing) {
      throw new ValidationError('Este endereço de e-mail já está em uso na plataforma.');
    }

    // Hashing seguro com salt de 10 rounds
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.repository.create({
      name: name.trim(),
      email: email.trim(),
      passwordHash,
      role
    });

    // Retorna o objeto sem a senha
    return this._sanitizeUser(user);
  }

  /**
   * Autentica um usuário através de e-mail e senha.
   * Utiliza mensagem genérica contra enumeração de contas.
   * 
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.password
   */
  async authenticate({ email, password }) {
    if (!email || !password) {
      throw new ValidationError('E-mail e senha são obrigatórios.');
    }

    const user = await this.repository.findByEmail(email);
    if (!user) {
      // Mensagem genérica contra enumeração de e-mails
      throw new ValidationError('E-mail ou senha incorretos.');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new ValidationError('E-mail ou senha incorretos.');
    }

    return this._sanitizeUser(user);
  }

  /**
   * Remove campos sensíveis antes de expor o usuário em sessão.
   */
  _sanitizeUser(user) {
    // eslint-disable-next-line no-unused-vars
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}

export const authService = new AuthService();
