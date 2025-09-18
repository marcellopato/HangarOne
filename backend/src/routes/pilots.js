const express = require('express');
const PilotController = require('../controllers/PilotController');

const router = express.Router();

/**
 * Rotas para gerenciamento de Pilotos
 */

// GET /api/pilots - Listar todos os pilotos
router.get('/', PilotController.list);

// GET /api/pilots/:id - Buscar piloto por ID
router.get('/:id', PilotController.getById);

// POST /api/pilots - Criar novo piloto
router.post('/', PilotController.create);

// PUT /api/pilots/:id - Atualizar piloto
router.put('/:id', PilotController.update);

// DELETE /api/pilots/:id - Deletar piloto
router.delete('/:id', PilotController.delete);

// GET /api/pilots/club/:clubId - Listar pilotos de um aeroclube específico
router.get('/club/:clubId', PilotController.getByClub);

module.exports = router;