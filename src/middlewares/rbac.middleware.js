/**
 * Middleware para Controle de Acesso Baseado em Papéis (RBAC).
 * 
 * @param {string[]} allowedRoles - Lista de papéis autorizados a acessar a rota
 */
export function ensureRole(allowedRoles = []) {
  return (req, res, next) => {
    // Primeiro garante que está autenticado
    if (!req.session || !req.session.user) {
      if (req.accepts('html')) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Por favor, faça login para continuar.');
        return res.redirect('/auth/login');
      }
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Autenticação necessária.'
      });
    }

    const userRole = req.session.user.role;

    if (!allowedRoles.includes(userRole)) {
      if (req.accepts('html')) {
        return res.status(403).renderWithLayout('pages/errors/403', {
          title: 'Acesso Proibido — Permissão Insuficiente',
          message: 'Você não possui permissão para acessar esta área.'
        });
      }

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Você não possui permissão para acessar este recurso.'
      });
    }

    return next();
  };
}
