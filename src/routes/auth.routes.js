import { Router } from 'express';
import {
  showLogin,
  handleLogin,
  handleLogout,
  showRegisterFamily,
  handleRegisterFamily,
  showRegisterCaregiver,
  handleRegisterCaregiver
} from '../controllers/auth.controller.js';

const router = Router();

// Login
router.get('/login', showLogin);
router.post('/login', handleLogin);

// Logout (apenas POST para evitar CSRF via link GET)
router.post('/logout', handleLogout);

// Registro de família
router.get('/cadastro/familia', showRegisterFamily);
router.post('/cadastro/familia', handleRegisterFamily);

// Registro de cuidador
router.get('/cadastro/cuidador', showRegisterCaregiver);
router.post('/cadastro/cuidador', handleRegisterCaregiver);

export default router;
