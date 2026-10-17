/**
 * Middleware para garantir que o usuário está autenticado na sessão.
 */
export function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  if (req.accepts('html')) {
    // Preserva a URL de destino para redirecionar após login bem-sucedido
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'Por favor, faça login para continuar.');
    return res.redirect('/auth/login');
  }

  return res.status(401).json({
    error: 'Unauthorized',
    message: 'Autenticação necessária para acessar este recurso.'
  });
}

/**
 * Middleware para injetar dados do usuário e mensagens flash nas views EJS.
 */
export function populateSessionData(req, res, next) {
  res.locals.currentUser = req.session?.user || null;
  res.locals.flash = {
    success: req.flash('success'),
    error: req.flash('error')
  };
  next();
}
