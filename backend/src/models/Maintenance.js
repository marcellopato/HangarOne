/**
 * Modelo de Manutenção
 * Registro de manutenções realizadas nas aeronaves
 */
class Maintenance {
  constructor({
    id = null,
    clubId, // FK para o aeroclube (multi-tenancy)
    aircraftId, // FK para a aeronave
    type, // preventive, corrective, inspection, annual
    description,
    scheduledDate,
    completedDate = null,
    cost = 0,
    technician = null, // Nome do técnico responsável
    technicianLicense = null, // Licença do técnico
    parts = [], // Array de peças utilizadas
    workHours = 0,
    nextMaintenanceDate = null,
    status = 'scheduled', // scheduled, in_progress, completed, cancelled
    priority = 'medium', // low, medium, high, critical
    documents = [], // Documentos relacionados à manutenção
    notes = null,
    isActive = true,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.clubId = clubId;
    this.aircraftId = aircraftId;
    this.type = type;
    this.description = description;
    this.scheduledDate = scheduledDate;
    this.completedDate = completedDate;
    this.cost = cost;
    this.technician = technician;
    this.technicianLicense = technicianLicense;
    this.parts = parts;
    this.workHours = workHours;
    this.nextMaintenanceDate = nextMaintenanceDate;
    this.status = status;
    this.priority = priority;
    this.documents = documents;
    this.notes = notes;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Tipos de manutenção válidos
   */
  static getValidTypes() {
    return ['preventive', 'corrective', 'inspection', 'annual', '100h', '50h'];
  }

  /**
   * Status de manutenção válidos
   */
  static getValidStatuses() {
    return ['scheduled', 'in_progress', 'completed', 'cancelled'];
  }

  /**
   * Prioridades válidas
   */
  static getValidPriorities() {
    return ['low', 'medium', 'high', 'critical'];
  }

  /**
   * Validar dados da manutenção
   */
  validate() {
    const errors = [];

    if (!this.clubId) {
      errors.push('Aeroclube é obrigatório');
    }

    if (!this.aircraftId) {
      errors.push('Aeronave é obrigatória');
    }

    if (!this.type || !Maintenance.getValidTypes().includes(this.type)) {
      errors.push('Tipo de manutenção inválido');
    }

    if (!this.description || this.description.trim().length < 10) {
      errors.push('Descrição deve ter pelo menos 10 caracteres');
    }

    if (!this.scheduledDate) {
      errors.push('Data agendada é obrigatória');
    }

    if (this.status && !Maintenance.getValidStatuses().includes(this.status)) {
      errors.push('Status de manutenção inválido');
    }

    if (this.priority && !Maintenance.getValidPriorities().includes(this.priority)) {
      errors.push('Prioridade inválida');
    }

    if (this.cost < 0) {
      errors.push('Custo não pode ser negativo');
    }

    if (this.workHours < 0) {
      errors.push('Horas de trabalho não podem ser negativas');
    }

    if (this.completedDate && this.scheduledDate && 
        new Date(this.completedDate) < new Date(this.scheduledDate)) {
      errors.push('Data de conclusão não pode ser anterior à data agendada');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Verificar se a manutenção está atrasada
   */
  isOverdue() {
    if (this.status === 'completed' || this.status === 'cancelled') {
      return false;
    }
    
    return new Date() > new Date(this.scheduledDate);
  }

  /**
   * Calcular dias até a manutenção
   */
  getDaysUntilMaintenance() {
    if (this.status === 'completed' || this.status === 'cancelled') {
      return null;
    }

    const today = new Date();
    const scheduled = new Date(this.scheduledDate);
    return Math.ceil((scheduled - today) / (1000 * 60 * 60 * 24));
  }

  /**
   * Iniciar manutenção
   */
  startMaintenance() {
    if (this.status === 'scheduled') {
      this.status = 'in_progress';
      this.updatedAt = new Date();
    }
  }

  /**
   * Completar manutenção
   */
  completeMaintenance(completedDate = new Date(), cost = null, workHours = null, nextMaintenanceDate = null) {
    if (['scheduled', 'in_progress'].includes(this.status)) {
      this.status = 'completed';
      this.completedDate = completedDate;
      if (cost !== null) this.cost = cost;
      if (workHours !== null) this.workHours = workHours;
      if (nextMaintenanceDate) this.nextMaintenanceDate = nextMaintenanceDate;
      this.updatedAt = new Date();
    }
  }

  /**
   * Cancelar manutenção
   */
  cancelMaintenance(reason = null) {
    if (['scheduled', 'in_progress'].includes(this.status)) {
      this.status = 'cancelled';
      if (reason) this.notes = (this.notes || '') + `\nCancelado: ${reason}`;
      this.updatedAt = new Date();
    }
  }

  /**
   * Adicionar peça utilizada
   */
  addPart(part) {
    if (part && part.name && part.quantity && part.cost) {
      this.parts.push({
        name: part.name,
        partNumber: part.partNumber || null,
        quantity: part.quantity,
        unitCost: part.cost,
        totalCost: part.quantity * part.cost,
        supplier: part.supplier || null
      });
      this.updatedAt = new Date();
    }
  }

  /**
   * Calcular custo total incluindo peças
   */
  getTotalCost() {
    const partsCost = this.parts.reduce((total, part) => total + (part.totalCost || 0), 0);
    return this.cost + partsCost;
  }

  /**
   * Converter para objeto simples (para JSON)
   */
  toJSON() {
    return {
      id: this.id,
      clubId: this.clubId,
      aircraftId: this.aircraftId,
      type: this.type,
      description: this.description,
      scheduledDate: this.scheduledDate,
      completedDate: this.completedDate,
      cost: this.cost,
      technician: this.technician,
      technicianLicense: this.technicianLicense,
      parts: this.parts,
      workHours: this.workHours,
      nextMaintenanceDate: this.nextMaintenanceDate,
      status: this.status,
      priority: this.priority,
      documents: this.documents,
      notes: this.notes,
      isActive: this.isActive,
      isOverdue: this.isOverdue(),
      daysUntilMaintenance: this.getDaysUntilMaintenance(),
      totalCost: this.getTotalCost(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Maintenance;