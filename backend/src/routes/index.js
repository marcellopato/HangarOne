/**
 * Arquivo principal de rotas da API
 * Centraliza todas as rotas do sistema
 */

const express = require('express');
const clubsRoutes = require('./clubs');

const router = express.Router();

// Rotas dos aeroclubes
router.use('/clubs', clubsRoutes);

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
      clubs: '/api/clubs',
      pilots: '/api/pilots (em breve)',
      aircraft: '/api/aircraft (em breve)',
      flights: '/api/flights (em breve)',
      maintenance: '/api/maintenance (em breve)'
    },
    features: [
      'Multi-tenancy',
      'Autenticação JWT',
      'Upload de arquivos',
      'Relatórios'
    ]
  });
});

module.exports = router;