const express = require('express');
const router = express.Router();
const Hangar = require('../models/Hangar');
const Club = require('../models/Club');

// Listar todos os hangares
router.get('/', async (req, res) => {
  try {
    // Aqui você pode adicionar filtros por clubId se desejar
    // Exemplo: /api/hangars?clubId=1
    const { clubId } = req.query;
    let hangars = req.app.locals.db ? await req.app.locals.db.Hangar.findAll({ where: clubId ? { clubId } : {} }) : [];
    res.json({ success: true, data: hangars });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao buscar hangares', error: err.message });
  }
});

// Criar novo hangar
router.post('/', async (req, res) => {
  try {
    const { clubId, name, location, capacity, description, isActive } = req.body;
    if (!clubId || !name) {
      return res.status(400).json({ success: false, message: 'clubId e name são obrigatórios' });
    }
    // Aqui você pode adicionar validações extras
    let hangar = req.app.locals.db ? await req.app.locals.db.Hangar.create({ clubId, name, location, capacity, description, isActive }) : null;
    res.status(201).json({ success: true, data: hangar });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao criar hangar', error: err.message });
  }
});

// Buscar hangar por ID
router.get('/:id', async (req, res) => {
  try {
    let hangar = req.app.locals.db ? await req.app.locals.db.Hangar.findByPk(req.params.id) : null;
    if (!hangar) return res.status(404).json({ success: false, message: 'Hangar não encontrado' });
    res.json({ success: true, data: hangar });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao buscar hangar', error: err.message });
  }
});

// Atualizar hangar
router.put('/:id', async (req, res) => {
  try {
    let hangar = req.app.locals.db ? await req.app.locals.db.Hangar.findByPk(req.params.id) : null;
    if (!hangar) return res.status(404).json({ success: false, message: 'Hangar não encontrado' });
    await hangar.update(req.body);
    res.json({ success: true, data: hangar });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar hangar', error: err.message });
  }
});

// Deletar hangar
router.delete('/:id', async (req, res) => {
  try {
    let hangar = req.app.locals.db ? await req.app.locals.db.Hangar.findByPk(req.params.id) : null;
    if (!hangar) return res.status(404).json({ success: false, message: 'Hangar não encontrado' });
    await hangar.destroy();
    res.json({ success: true, message: 'Hangar removido com sucesso' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao remover hangar', error: err.message });
  }
});

module.exports = router;
