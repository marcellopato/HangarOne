/**
 * Rotas de Usuários HangarOne
 * Endpoints para CRUD de usuários (protegidas por autenticação)
 */

const express = require('express');
const UserController = require('../controllers/UserController');
const AuthService = require('../services/AuthService');

const router = express.Router();

// Middleware: todas as rotas de usuários requerem autenticação
router.use(AuthService.authenticate());

// GET /users - Listar usuários (baseado no role e aeroclube)
router.get('/', UserController.listUsers);

// GET /users/:id - Buscar usuário por ID
router.get('/:id', UserController.getUser);

// PUT /users/:id - Atualizar usuário
router.put('/:id', UserController.updateUser);

// DELETE /users/:id - Desativar usuário (soft delete)
router.delete('/:id', 
  AuthService.authorize(['superadmin', 'admin', 'manager']), 
  UserController.deleteUser
);

// POST /users - Criar novo usuário (apenas admin e manager podem criar)
router.post('/', 
  AuthService.authorize(['superadmin', 'admin', 'manager']), 
  UserController.register
);

module.exports = router;