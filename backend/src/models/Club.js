/**
 * Modelo do Aeroclube
 * Cada aeroclube é um tenant separado no sistema
 */
class Club {
  constructor({
    id = null,
    name,
    cnpj,
    address,
    phone,
    email,
    responsiblePerson,
    requiredDocuments = [],
    isActive = true,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.name = name;
    this.cnpj = cnpj;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.responsiblePerson = responsiblePerson;
    this.requiredDocuments = requiredDocuments; // Lista de documentos exigidos pelo aeroclube
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validar dados do aeroclube
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length < 3) {
      errors.push('Nome do aeroclube deve ter pelo menos 3 caracteres');
    }

    if (!this.cnpj || !/^\d{14}$/.test(this.cnpj.replace(/\D/g, ''))) {
      errors.push('CNPJ deve ter 14 dígitos');
    }

    if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      errors.push('E-mail inválido');
    }

    if (!this.responsiblePerson || this.responsiblePerson.trim().length < 3) {
      errors.push('Nome do responsável deve ter pelo menos 3 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Converter para objeto simples (para JSON)
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      cnpj: this.cnpj,
      address: this.address,
      phone: this.phone,
      email: this.email,
      responsiblePerson: this.responsiblePerson,
      requiredDocuments: this.requiredDocuments,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Club;