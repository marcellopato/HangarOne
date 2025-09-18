const { Pilot } = require('../models');

/**
 * Controller para operações CRUD de Pilotos
 */
class PilotController {
  /**
   * Listar todos os pilotos
   */
  static async list(req, res) {
    try {
      const pilots = Pilot.getAll();
      
      // Por enquanto, retornar apenas os pilotos sem dados do aeroclube
      // TODO: Implementar busca de aeroclubes quando necessário
      const pilotsWithClubs = pilots.map(pilot => ({
        ...pilot,
        clubName: pilot.clubId ? `Aeroclube ${pilot.clubId}` : 'Sem aeroclube'
      }));

      res.json({
        success: true,
        data: pilotsWithClubs
      });
    } catch (error) {
      console.error('Erro ao listar pilotos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Buscar piloto por ID
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const pilot = Pilot.getById(parseInt(id));

      if (!pilot) {
        return res.status(404).json({
          success: false,
          message: 'Piloto não encontrado'
        });
      }

      // Buscar dados do aeroclube
      const club = Club.getById(pilot.clubId);
      const pilotWithClub = {
        ...pilot,
        clubName: club?.name || 'Aeroclube não encontrado'
      };

      res.json({
        success: true,
        data: pilotWithClub
      });
    } catch (error) {
      console.error('Erro ao buscar piloto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Criar novo piloto
   */
  static async create(req, res) {
    try {
      const pilotData = req.body;

      // Por enquanto, skippar validação do aeroclube
      // TODO: Implementar validação quando Club.getById() for criado

      // Criar instância do piloto
      const pilot = new Pilot(pilotData);

      // Validar dados
      const validation = pilot.validate();
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: validation.errors
        });
      }

      // Salvar piloto
      const savedPilot = pilot.save();

      res.status(201).json({
        success: true,
        data: savedPilot,
        message: 'Piloto cadastrado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao criar piloto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Atualizar piloto
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const pilotData = req.body;

      // Verificar se o piloto existe
      const existingPilot = Pilot.getById(parseInt(id));
      if (!existingPilot) {
        return res.status(404).json({
          success: false,
          message: 'Piloto não encontrado'
        });
      }

      // Por enquanto, skippar validação do aeroclube
      // TODO: Implementar validação quando Club.getById() for criado

      // Atualizar dados
      const updatedData = {
        ...existingPilot,
        ...pilotData,
        id: parseInt(id),
        updatedAt: new Date()
      };

      // Log para debug
      console.log('Dados recebidos para update:', {
        emergencyContact: pilotData.emergencyContact,
        type: typeof pilotData.emergencyContact,
        length: pilotData.emergencyContact?.length
      });

      const pilot = new Pilot(updatedData);

      // Validar dados
      const validation = pilot.validate();
      console.log('Resultado da validação:', validation);
      if (!validation.isValid) {
        console.log('Validação falhou:', validation.errors);
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: validation.errors
        });
      }

      // Salvar alterações
      const savedPilot = pilot.save();

      res.json({
        success: true,
        data: savedPilot,
        message: 'Piloto atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar piloto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Deletar piloto
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;

      // Verificar se o piloto existe
      const pilot = Pilot.getById(parseInt(id));
      if (!pilot) {
        return res.status(404).json({
          success: false,
          message: 'Piloto não encontrado'
        });
      }

      // Deletar piloto
      const deleted = Pilot.deleteById(parseInt(id));

      if (deleted) {
        res.json({
          success: true,
          message: 'Piloto removido com sucesso'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro ao remover piloto'
        });
      }
    } catch (error) {
      console.error('Erro ao deletar piloto:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Listar pilotos por aeroclube
   */
  static async getByClub(req, res) {
    try {
      const { clubId } = req.params;

      // Verificar se o aeroclube existe
      const club = Club.getById(parseInt(clubId));
      if (!club) {
        return res.status(404).json({
          success: false,
          message: 'Aeroclube não encontrado'
        });
      }

      const pilots = Pilot.getAll().filter(pilot => pilot.clubId === parseInt(clubId));

      res.json({
        success: true,
        data: pilots,
        club: club.name
      });
    } catch (error) {
      console.error('Erro ao listar pilotos por aeroclube:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = PilotController;