import { authService } from '../services/auth.service.js';
import { USER_ROLES } from '../repositories/memory/user.repository.js';
import { ValidationError } from '../utils/custom-errors.js';

// ──────────────────────────────────────────────────────────────
//  GET /auth/login
// ──────────────────────────────────────────────────────────────
export function showLogin(req, res) {
  if (req.session?.user) {
    return res.redirect('/');
  }
  return res.renderWithLayout('pages/auth/login', {
    title: 'Entrar na conta — CuidaPerto',
    formData: {}
  });
}

// ──────────────────────────────────────────────────────────────
//  POST /auth/login
// ──────────────────────────────────────────────────────────────
export async function handleLogin(req, res, next) {
  const { email = '', password = '' } = req.body;

  try {
    const user = await authService.authenticate({ email, password });

    // Regenera o ID de sessão para prevenir fixação de sessão
    req.session.regenerate((err) => {
      if (err) return next(err);

      req.session.user = user;

      req.flash('success', `Bem-vindo(a) de volta, ${user.name}!`);

      // Redireciona para a URL de origem (se segura) ou para a home
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      const target = returnTo && returnTo.startsWith('/') ? returnTo : '/';
      return res.redirect(target);
    });
  } catch (err) {
    if (err instanceof ValidationError) {
      req.flash('error', err.message);
      return res.redirect('/auth/login');
    }
    return next(err);
  }
}

// ──────────────────────────────────────────────────────────────
//  POST /auth/logout
// ──────────────────────────────────────────────────────────────
export function handleLogout(req, res, next) {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('cuidaperto.sid');
    return res.redirect('/');
  });
}

// ──────────────────────────────────────────────────────────────
//  GET /auth/cadastro/familia
// ──────────────────────────────────────────────────────────────
export function showRegisterFamily(req, res) {
  if (req.session?.user) {
    return res.redirect('/');
  }
  return res.renderWithLayout('pages/auth/register-family', {
    title: 'Cadastro de Família — CuidaPerto',
    formData: {}
  });
}

// ──────────────────────────────────────────────────────────────
//  POST /auth/cadastro/familia
// ──────────────────────────────────────────────────────────────
export async function handleRegisterFamily(req, res, next) {
  const { name = '', email = '', password = '', confirmPassword = '' } = req.body;
  const formData = { name, email };

  if (password !== confirmPassword) {
    req.flash('error', 'As senhas não coincidem.');
    return res.renderWithLayout('pages/auth/register-family', {
      title: 'Cadastro de Família — CuidaPerto',
      formData
    });
  }

  try {
    await authService.register({ name, email, password, role: USER_ROLES.FAMILY });
    req.flash('success', 'Conta criada com sucesso! Faça login para continuar.');
    return res.redirect('/auth/login');
  } catch (err) {
    if (err instanceof ValidationError) {
      req.flash('error', err.message);
      return res.renderWithLayout('pages/auth/register-family', {
        title: 'Cadastro de Família — CuidaPerto',
        formData
      });
    }
    return next(err);
  }
}

// ──────────────────────────────────────────────────────────────
//  GET /auth/cadastro/cuidador
// ──────────────────────────────────────────────────────────────
export function showRegisterCaregiver(req, res) {
  if (req.session?.user) {
    return res.redirect('/');
  }
  return res.renderWithLayout('pages/auth/register-caregiver', {
    title: 'Cadastro de Cuidador — CuidaPerto',
    formData: {}
  });
}

// ──────────────────────────────────────────────────────────────
//  POST /auth/cadastro/cuidador
// ──────────────────────────────────────────────────────────────
export async function handleRegisterCaregiver(req, res, next) {
  const { name = '', email = '', password = '', confirmPassword = '' } = req.body;
  const formData = { name, email };

  if (password !== confirmPassword) {
    req.flash('error', 'As senhas não coincidem.');
    return res.renderWithLayout('pages/auth/register-caregiver', {
      title: 'Cadastro de Cuidador — CuidaPerto',
      formData
    });
  }

  try {
    await authService.register({ name, email, password, role: USER_ROLES.CAREGIVER });
    req.flash('success', 'Conta de cuidador criada! Aguarde revisão do perfil após o login.');
    return res.redirect('/auth/login');
  } catch (err) {
    if (err instanceof ValidationError) {
      req.flash('error', err.message);
      return res.renderWithLayout('pages/auth/register-caregiver', {
        title: 'Cadastro de Cuidador — CuidaPerto',
        formData
      });
    }
    return next(err);
  }
}
