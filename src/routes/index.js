import { Router } from 'express';
import publicRoutes from './public.routes.js';
import authRoutes from './auth.routes.js';

const router = Router();

// Rota de Healthcheck para monitoramento e infraestrutura
router.get('/health', (req, res) => {
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'CuidaPerto Web App'
  });
});

// Rotas de autenticação (login, logout, cadastro)
router.use('/auth', authRoutes);

// Rotas públicas (Home, Busca, Perfil)
router.use('/', publicRoutes);

export default router;
