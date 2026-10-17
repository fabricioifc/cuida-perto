import { Router } from 'express';
import { caregiverController } from '../controllers/caregiver.controller.js';

const router = Router();

// Rota inicial
router.get('/', caregiverController.renderHome);

// Rota de busca e filtros
router.get('/search', caregiverController.renderSearch);

// Rota de detalhes de um cuidador
router.get('/cuidadores/:id', caregiverController.renderDetail);

export default router;
