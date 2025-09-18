/**
 * Rotas de Autenticação HangarOne
 * Endpoints para login, registro e gerenciamento de senhas
 */

const express = require('express');
const UserController = require('../controllers/UserController');
const AuthService = require('../services/AuthService');

const router = express.Router();

// POST /auth/register - Registrar novo usuário
router.post('/register', UserController.register);

// POST /auth/login - Login de usuário
router.post('/login', UserController.login);

// POST /auth/logout - Logout de usuário
router.post('/logout', AuthService.authenticate(), UserController.logout);

// POST /auth/password-strength - Verificar força da senha
router.post('/password-strength', UserController.checkPasswordStrength);

// POST /auth/request-password-reset - Solicitar reset de senha
router.post('/request-password-reset', UserController.requestPasswordReset);

// POST /auth/reset-password - Reset de senha com token
router.post('/reset-password', UserController.resetPassword);

module.exports = router;