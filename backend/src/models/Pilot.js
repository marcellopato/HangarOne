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

    // Validar contato de emergência (opcional, mas se preenchido deve ter formato correto)
    console.log('Validando emergencyContact:', {
      value: this.emergencyContact,
      type: typeof this.emergencyContact,
      length: this.emergencyContact?.length,
      trimmed: this.emergencyContact?.trim(),
      trimmedLength: this.emergencyContact?.trim()?.length,
      hasHyphen: this.emergencyContact?.includes?.('-')
    });
    
    if (this.emergencyContact && typeof this.emergencyContact === 'string' && this.emergencyContact.trim().length > 0) {
      const contact = this.emergencyContact.trim();
      // Deve ter pelo menos um hífen separando nome e telefone e pelo menos 8 caracteres
      if (contact.length < 8 || !contact.includes('-')) {
        console.log('Erro na validação do contato de emergência:', { contact, length: contact.length, hasHyphen: contact.includes('-') });
        errors.push('Contato de emergência deve ter formato: "Nome - Telefone"');
      }
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

  // Métodos estáticos para simulação de banco de dados
  static data = [
    {
      id: 1,
      clubId: 1,
      name: 'João Silva Santos',
      cpf: '12345678901',
      birthDate: '1985-03-15',
      license: 'PCH12345',
      nickname: 'João Piloto',
      bloodType: 'A+',
      address: 'Rua das Flores, 123 - São Paulo, SP',
      emergencyContact: 'Maria Silva - (11) 99999-9999',
      medicalInsurance: 'Plano Saúde Aviação',
      medications: [],
      restrictions: [],
      photo: null,
      paymentDate: '2025-09-01',
      hangar: 'Hangar Alpha',
      documents: [],
      isActive: true,
      createdAt: '2025-01-15T10:00:00.000Z',
      updatedAt: '2025-09-01T10:00:00.000Z'
    },
    {
      id: 2,
      clubId: 1,
      name: 'Ana Maria Costa',
      cpf: '98765432109',
      birthDate: '1990-07-22',
      license: 'PP87654',
      nickname: 'Ana Aviadora',
      bloodType: 'O-',
      address: 'Av. Paulista, 456 - São Paulo, SP',
      emergencyContact: 'Pedro Costa - (11) 88888-8888',
      medicalInsurance: 'SulAmérica Saúde',
      medications: ['Aspirina (quando necessário)'],
      restrictions: [],
      photo: null,
      paymentDate: '2025-08-15',
      hangar: 'Hangar Beta',
      documents: [],
      isActive: true,
      createdAt: '2025-02-10T14:30:00.000Z',
      updatedAt: '2025-08-15T14:30:00.000Z'
    },
    {
      id: 3,
      clubId: 2,
      name: 'Carlos Eduardo Oliveira',
      cpf: '11122233344',
      birthDate: '1978-12-03',
      license: 'PCA98765',
      nickname: 'Carlão',
      bloodType: 'B+',
      address: 'Rua Copacabana, 789 - Rio de Janeiro, RJ',
      emergencyContact: 'Lucia Oliveira - (21) 77777-7777',
      medicalInsurance: 'Unimed Rio',
      medications: [],
      restrictions: ['Não voar com tempo instável'],
      photo: null,
      paymentDate: '2025-09-10',
      hangar: 'Hangar Charlie',
      documents: [],
      isActive: true,
      createdAt: '2025-01-20T09:15:00.000Z',
      updatedAt: '2025-09-10T09:15:00.000Z'
    },
    {
      id: 4,
      clubId: 1,
      name: 'Roberto Mendes',
      cpf: '55566677788',
      birthDate: '1992-05-18',
      license: 'PCH55555',
      nickname: 'Beto',
      bloodType: 'AB+',
      address: 'Rua Augusta, 321 - São Paulo, SP',
      emergencyContact: 'Sandra Mendes - (11) 66666-6666',
      medicalInsurance: 'Bradesco Saúde',
      medications: [],
      restrictions: [],
      photo: null,
      paymentDate: '2025-07-20',
      hangar: 'Hangar Alpha',
      documents: [],
      isActive: false,
      createdAt: '2025-03-05T16:45:00.000Z',
      updatedAt: '2025-07-20T16:45:00.000Z'
    }
  ];

  static getAll() {
    return this.data.map(pilot => new Pilot(pilot));
  }

  static getById(id) {
    const pilotData = this.data.find(pilot => pilot.id === id);
    return pilotData ? new Pilot(pilotData) : null;
  }

  static deleteById(id) {
    const index = this.data.findIndex(pilot => pilot.id === id);
    if (index !== -1) {
      this.data.splice(index, 1);
      return true;
    }
    return false;
  }

  save() {
    if (this.id) {
      // Atualizar existente
      const index = Pilot.data.findIndex(pilot => pilot.id === this.id);
      if (index !== -1) {
        Pilot.data[index] = this.toJSON();
      }
    } else {
      // Criar novo
      this.id = Math.max(...Pilot.data.map(pilot => pilot.id), 0) + 1;
      Pilot.data.push(this.toJSON());
    }
    return this;
  }
}

module.exports = Pilot;