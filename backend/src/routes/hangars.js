const express = require('express');
const router = express.Router();
const Hangar = require('../models/Hangar');
const Club = require('../models/Club');

// Armazenamento temporário em memória (será substituído pelo banco de dados)
let hangarsStorage = [
  {
    id: 1,
    name: 'Hangar Alpha',
    clubId: 1,
    location: 'Pista Principal',
    capacity: 8,
    description: 'Hangar principal com capacidade para aeronaves de grande porte',
    isActive: true
  },
  {
    id: 2,
    name: 'Hangar Beta',
    clubId: 1,
    location: 'Pista Secundária',
    capacity: 4,
    description: 'Hangar para aeronaves de pequeno porte',
    isActive: true
  },
  {
    id: 3,
    name: 'Hangar Charlie',
    clubId: 2,
    location: 'Terminal Norte',
    capacity: 6,
    description: 'Hangar com sistema de manutenção integrado',
    isActive: false
  }
];

// Listar todos os hangares
router.get('/', async (req, res) => {
  try {
    const { clubId } = req.query;
    
    // Filtrar por clubId se especificado
    let hangars = hangarsStorage;
    if (clubId) {
      hangars = hangarsStorage.filter(h => h.clubId == clubId);
    }
    
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
    
    // Criar novo hangar e adicionar ao armazenamento
    const newHangar = {
      id: Math.max(...hangarsStorage.map(h => h.id), 0) + 1, // Próximo ID sequencial
      clubId: parseInt(clubId),
      name,
      location: location || '',
      capacity: parseInt(capacity) || 1,
      description: description || '',
      isActive: isActive !== undefined ? isActive : true,
      created_at: new Date().toISOString()
    };
    
    // Adicionar ao armazenamento
    hangarsStorage.push(newHangar);
    
    res.status(201).json({ success: true, data: newHangar });
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
