/**
 * Modelo de Hangar
 * Cada hangar pertence a um aeroclube e pode abrigar várias aeronaves
 */
class Hangar {
  constructor({
    id = null,
    clubId, // FK para o aeroclube
    name, // Nome ou identificação do hangar
    location = null, // Localização física ou referência
    capacity = 1, // Quantidade máxima de aeronaves
    description = null,
    isActive = true,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.clubId = clubId;
    this.name = name;
    this.location = location;
    this.capacity = capacity;
    this.description = description;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  validate() {
    const errors = [];
    if (!this.clubId) {
      errors.push('ID do aeroclube é obrigatório');
    }
    if (!this.name || this.name.trim().length < 2) {
      errors.push('Nome do hangar deve ter pelo menos 2 caracteres');
    }
    if (this.capacity < 1) {
      errors.push('Capacidade deve ser pelo menos 1');
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      id: this.id,
      clubId: this.clubId,
      name: this.name,
      location: this.location,
      capacity: this.capacity,
      description: this.description,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Hangar;
