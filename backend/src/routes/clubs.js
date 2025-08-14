/**
 * Rotas para gerenciamento de aeroclubes
 * Endpoints para CRUD de clubes (multi-tenancy)
 */

const express = require('express');
const ClubController = require('../controllers/ClubController');

const router = express.Router();

// GET /api/clubs - Listar todos os aeroclubes
router.get('/', ClubController.listClubs);

// GET /api/clubs/:id - Buscar aeroclube por ID
router.get('/:id', ClubController.getClub);

// POST /api/clubs - Criar novo aeroclube
router.post('/', ClubController.createClub);

// PUT /api/clubs/:id - Atualizar aeroclube
router.put('/:id', ClubController.updateClub);

// DELETE /api/clubs/:id - Deletar aeroclube
router.delete('/:id', ClubController.deleteClub);

module.exports = router;