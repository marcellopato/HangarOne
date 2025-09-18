/**
 * Modelo do Piloto
 * Representa os pilotos cadastrados em cada aeroclube
 */
class Pilot {
  constructor({
    id = null,
    clubId, // FK para o aeroclube (multi-tenancy)
    name,
    cpf,
    birthDate,
    license,
    nickname,
    bloodType,
    address,
    emergencyContact,
    medicalInsurance,
    medications = [],
    restrictions = [],
    photo = null,
    paymentDate = null,
    hangar = null,
    documents = [], // Array de documentos anexados
    isActive = true,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.clubId = clubId;
    this.name = name;
    this.cpf = cpf;
    this.birthDate = birthDate;
    this.license = license;
    this.nickname = nickname;
    this.bloodType = bloodType;
    this.address = address;
    this.emergencyContact = emergencyContact;
    this.medicalInsurance = medicalInsurance;
    this.medications = medications;
    this.restrictions = restrictions;
    this.photo = photo;
    this.paymentDate = paymentDate;
    this.hangar = hangar;
    this.documents = documents;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validar dados do piloto
   */
  validate() {
    const errors = [];

    if (!this.clubId) {
      errors.push('ID do aeroclube é obrigatório');
    }


    if (!this.name || this.name.trim().length < 3) {
      errors.push('Nome deve ter pelo menos 3 caracteres');
    }

    if (!this.cpf || !/^\d{11}$/.test(this.cpf.replace(/\D/g, ''))) {
      errors.push('CPF deve ter 11 dígitos numéricos');
    }

    if (!this.birthDate || isNaN(Date.parse(this.birthDate))) {
      errors.push('Data de nascimento inválida ou ausente');
    }

    if (!this.license || !/^[A-Z0-9]+$/i.test(this.license)) {
      errors.push('Licença é obrigatória e deve conter apenas letras e números');
    }

    if (this.bloodType && !['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(this.bloodType)) {
      errors.push('Tipo sanguíneo inválido');
    }

    if (this.emergencyContact && (!this.emergencyContact.name || !this.emergencyContact.phone)) {
      errors.push('Contato de emergência deve ter nome e telefone');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Verificar se o pagamento está em dia
   */
  isPaymentUpToDate() {
    if (!this.paymentDate) return false;
    
    const currentDate = new Date();
    const paymentDate = new Date(this.paymentDate);
    const monthsDiff = (currentDate.getFullYear() - paymentDate.getFullYear()) * 12 + 
                      (currentDate.getMonth() - paymentDate.getMonth());
    
    return monthsDiff <= 1; // Pagamento válido por 1 mês
  }

  /**
   * Converter para objeto simples (para JSON)
   */
  toJSON() {
    return {
      id: this.id,
      clubId: this.clubId,
      name: this.name,
      cpf: this.cpf,
      birthDate: this.birthDate,
      license: this.license,
      nickname: this.nickname,
      bloodType: this.bloodType,
      address: this.address,
      emergencyContact: this.emergencyContact,
      medicalInsurance: this.medicalInsurance,
      medications: this.medications,
      restrictions: this.restrictions,
      photo: this.photo,
      paymentDate: this.paymentDate,
      hangar: this.hangar,
      documents: this.documents,
      isActive: this.isActive,
      isPaymentUpToDate: this.isPaymentUpToDate(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Pilot;