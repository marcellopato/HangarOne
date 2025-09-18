/**
 * Arquivo principal de rotas da API
 * Centraliza todas as rotas do sistema
 */

const express = require('express');

const authRoutes = require('./auth');
const usersRoutes = require('./users');
const clubsRoutes = require('./clubs');
const hangarsRoutes = require('./hangars');

const router = express.Router();

// Rotas de autenticação
router.use('/auth', authRoutes);
// Rotas de usuários
router.use('/users', usersRoutes);
// Rotas dos aeroclubes
router.use('/clubs', clubsRoutes);
// Rotas dos hangares
router.use('/hangars', hangarsRoutes);

// Rota de teste da API
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'HangarOne API está funcionando!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Rota para informações da API
router.get('/info', (req, res) => {
  res.json({
    name: 'HangarOne API',
    version: '1.0.0',
    description: 'Sistema de gerenciamento de pilotos e aeroclubes',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        logout: 'POST /api/auth/logout',
        passwordReset: 'POST /api/auth/request-password-reset',
        resetPassword: 'POST /api/auth/reset-password'
      },
      users: 'GET|POST|PUT|DELETE /api/users',
      clubs: '/api/clubs',
      hangars: '/api/hangars',
      pilots: '/api/pilots (em breve)',
      aircraft: '/api/aircraft (em breve)',
      flights: '/api/flights (em breve)',
      maintenance: '/api/maintenance (em breve)'
    },
    features: [
      'Multi-tenancy baseado em aeroclubes',
      'Autenticação JWT',
      'Controle de acesso por roles',
      'Sistema de usuários (superadmin/admin/manager/pilot)',
      'Relatórios'
    ]
  });
});

module.exports = router;