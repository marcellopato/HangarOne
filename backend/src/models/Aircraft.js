/**
 * Modelo da Aeronave
 * Representa as aeronaves cadastradas nos aeroclubes
 */
class Aircraft {
  constructor({
    id = null,
    clubId, // FK para o aeroclube (multi-tenancy)
    pilotId, // FK para o piloto proprietário
    type, // asa delta, parapente, planador, trike, ultraleve asa fixa, paramotor, paratrike, ultraleve avançado
    prefix, // BR-XXXX até 10 caracteres
  manufacturer,
  model,
  year,
    serialNumber,
    motor,
    description,
    operationStatus = true, // true = operando, false = inoperante
    photo = null,
    hangar = null,
    documents = [], // Array de documentos da aeronave
    maintenanceSchedule = [],
    isActive = true,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.clubId = clubId;
    this.pilotId = pilotId;
    this.type = type;
    this.prefix = prefix;
    this.manufacturer = manufacturer;
    this.model = model;
    this.year = year;
    this.serialNumber = serialNumber;
    this.motor = motor;
    this.description = description;
    this.operationStatus = operationStatus;
    this.photo = photo;
    this.hangar = hangar;
    this.documents = documents;
    this.maintenanceSchedule = maintenanceSchedule;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  static getValidTypes() {
    return [
      'asa_delta',
      'parapente', 
      'planador',
      'trike',
      'ultraleve_asa_fixa',
      'paramotor',
      'paratrike',
      'ultraleve_avancado'
    ];
  }

  /**
   * Validar dados da aeronave
   */
  validate() {
    const errors = [];

    if (!this.clubId) {
      errors.push('ID do aeroclube é obrigatório');
    }

    if (!this.pilotId) {
      errors.push('ID do piloto proprietário é obrigatório');
    }

    if (!this.type || !Aircraft.getValidTypes().includes(this.type)) {
      errors.push('Tipo de aeronave inválido');
    }

    if (!this.prefix || this.prefix.length > 10) {
      errors.push('Prefixo deve ter até 10 caracteres');
    }

    if (this.prefix && !/^BR-[A-Z0-9]+$/i.test(this.prefix)) {
      errors.push('Prefixo deve seguir o padrão BR-XXXX');
    }


    if (!this.manufacturer || this.manufacturer.trim().length < 2) {
      errors.push('Fabricante deve ter pelo menos 2 caracteres');
    }

    if (!this.model || this.model.trim().length < 2) {
      errors.push('Modelo deve ter pelo menos 2 caracteres');
    }

    if (!this.motor || this.motor.trim().length < 2) {
      errors.push('Motor é obrigatório e deve ter pelo menos 2 caracteres');
    }

    if (!this.description || this.description.trim().length < 5) {
      errors.push('Descrição detalhada é obrigatória e deve ter pelo menos 5 caracteres');
    }

    if (typeof this.operationStatus !== 'boolean') {
      errors.push('Status de operação deve ser booleano (sim/não)');
    }

    if (this.year && (this.year < 1900 || this.year > new Date().getFullYear() + 1)) {
      errors.push('Ano inválido');
    }

    // Validação opcional: garantir que o hangar pertence ao clubId
    // (Necessário acesso ao repositório de hangares, depende da camada de serviço ou controller)
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Verificar se precisa de manutenção
   */
  needsMaintenance() {
    if (!this.maintenanceSchedule.length) return false;
    
    const currentDate = new Date();
    return this.maintenanceSchedule.some(maintenance => {
      const dueDate = new Date(maintenance.dueDate);
      return dueDate <= currentDate && !maintenance.completed;
    });
  }

  /**
   * Converter para objeto simples (para JSON)
   */
  toJSON() {
    return {
      id: this.id,
      clubId: this.clubId,
      pilotId: this.pilotId,
      type: this.type,
      prefix: this.prefix,
      manufacturer: this.manufacturer,
      model: this.model,
      year: this.year,
      serialNumber: this.serialNumber,
      motor: this.motor,
      description: this.description,
      operationStatus: this.operationStatus,
      photo: this.photo,
      hangar: this.hangar,
      documents: this.documents,
      maintenanceSchedule: this.maintenanceSchedule,
      needsMaintenance: this.needsMaintenance(),
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Aircraft;