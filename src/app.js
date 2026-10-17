import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import session from 'express-session';
import flash from 'connect-flash';
import { populateSessionData } from './middlewares/auth.middleware.js';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Hardening de Segurança: Oculta o cabeçalho X-Powered-By do Express
app.disable('x-powered-by');

// Configuração da View Engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Arquivos estáticos servidos diretamente da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Parsers de requisição
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Gerenciamento de sessão seguro
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  name: 'cuidaperto.sid',
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000  // 8 horas
  }
}));

// Mensagens flash (deve vir após express-session)
app.use(flash());

// Injeta currentUser e flash nas res.locals para todas as views
app.use(populateSessionData);


// Helper customizado e limpo de layout para EJS
app.use((req, res, next) => {
  res.renderWithLayout = (view, locals = {}) => {
    app.render(view, locals, (err, html) => {
      if (err) {
        return next(err);
      }
      return res.render('layouts/main', { ...locals, body: html });
    });
  };
  next();
});

// Rotas da aplicação
app.use(routes);

// Tratamento de Rota Não Encontrada (404)
app.use((req, res) => {
  res.status(404).renderWithLayout('pages/errors/404', {
    title: 'Página não encontrada'
  });
});

// Tratamento de Erro Global (500)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[ERRO INTERNO]', err);
  const statusCode = err.statusCode || 500;
  
  if (req.accepts('html')) {
    return res.status(statusCode).renderWithLayout('pages/errors/404', {
      title: 'Ocorreu um erro inesperado',
      message: 'Não foi possível processar sua solicitação no momento. Tente novamente mais tarde.'
    });
  }

  return res.status(statusCode).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

export default app;
