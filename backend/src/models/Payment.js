/**
 * Modelo de Pagamento
 * Sistema de cobrança mensal para pilotos
 */
class Payment {
  constructor({
    id = null,
    clubId, // FK para o aeroclube (multi-tenancy)
    pilotId, // FK para o piloto
    dueDate, // Data de vencimento
    amount, // Valor da mensalidade
    description = 'Mensalidade',
    status = 'pending', // pending, paid, overdue, cancelled
    paidDate = null,
    paidAmount = null,
    paymentMethod = null, // cash, bank_transfer, credit_card, debit_card, pix
    transactionId = null, // ID da transação
    notes = null,
    isActive = true,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.clubId = clubId;
    this.pilotId = pilotId;
    this.dueDate = dueDate;
    this.amount = amount;
    this.description = description;
    this.status = status;
    this.paidDate = paidDate;
    this.paidAmount = paidAmount;
    this.paymentMethod = paymentMethod;
    this.transactionId = transactionId;
    this.notes = notes;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Status de pagamento válidos
   */
  static getValidStatuses() {
    return ['pending', 'paid', 'overdue', 'cancelled'];
  }

  /**
   * Métodos de pagamento válidos
   */
  static getValidPaymentMethods() {
    return ['cash', 'bank_transfer', 'credit_card', 'debit_card', 'pix', 'check'];
  }

  /**
   * Validar dados do pagamento
   */
  validate() {
    const errors = [];

    if (!this.clubId) {
      errors.push('Aeroclube é obrigatório');
    }

    if (!this.pilotId) {
      errors.push('Piloto é obrigatório');
    }

    if (!this.dueDate) {
      errors.push('Data de vencimento é obrigatória');
    }

    if (!this.amount || this.amount <= 0) {
      errors.push('Valor deve ser maior que zero');
    }

    if (this.status && !Payment.getValidStatuses().includes(this.status)) {
      errors.push('Status de pagamento inválido');
    }

    if (this.paymentMethod && !Payment.getValidPaymentMethods().includes(this.paymentMethod)) {
      errors.push('Método de pagamento inválido');
    }

    if (this.paidAmount && this.paidAmount < 0) {
      errors.push('Valor pago não pode ser negativo');
    }

    if (this.status === 'paid' && !this.paidDate) {
      errors.push('Data de pagamento é obrigatória quando status é "paid"');
    }

    if (this.status === 'paid' && !this.paidAmount) {
      errors.push('Valor pago é obrigatório quando status é "paid"');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Verificar se o pagamento está em atraso
   */
  isOverdue() {
    if (this.status === 'paid' || this.status === 'cancelled') {
      return false;
    }
    
    return new Date() > new Date(this.dueDate);
  }

  /**
   * Calcular dias em atraso
   */
  getDaysOverdue() {
    if (!this.isOverdue()) {
      return 0;
    }

    const today = new Date();
    const due = new Date(this.dueDate);
    return Math.ceil((today - due) / (1000 * 60 * 60 * 24));
  }

  /**
   * Calcular dias até o vencimento
   */
  getDaysUntilDue() {
    if (this.status === 'paid' || this.status === 'cancelled') {
      return null;
    }

    const today = new Date();
    const due = new Date(this.dueDate);
    const days = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    return days > 0 ? days : 0;
  }

  /**
   * Marcar como pago
   */
  markAsPaid(paidAmount = null, paymentMethod = null, transactionId = null, paidDate = new Date()) {
    this.status = 'paid';
    this.paidDate = paidDate;
    this.paidAmount = paidAmount || this.amount;
    if (paymentMethod) this.paymentMethod = paymentMethod;
    if (transactionId) this.transactionId = transactionId;
    this.updatedAt = new Date();
  }

  /**
   * Marcar como atrasado
   */
  markAsOverdue() {
    if (this.status === 'pending' && this.isOverdue()) {
      this.status = 'overdue';
      this.updatedAt = new Date();
    }
  }

  /**
   * Cancelar pagamento
   */
  cancel(reason = null) {
    if (['pending', 'overdue'].includes(this.status)) {
      this.status = 'cancelled';
      if (reason) this.notes = (this.notes || '') + `\nCancelado: ${reason}`;
      this.updatedAt = new Date();
    }
  }

  /**
   * Verificar se há diferença no valor pago
   */
  hasPaymentDifference() {
    if (this.status !== 'paid' || !this.paidAmount) {
      return false;
    }
    
    return Math.abs(this.amount - this.paidAmount) > 0.01;
  }

  /**
   * Calcular multa por atraso (2% + 0.1% ao dia)
   */
  calculateLateFee() {
    if (!this.isOverdue()) {
      return 0;
    }

    const daysOverdue = this.getDaysOverdue();
    const feePercentage = 2 + (daysOverdue * 0.1); // 2% + 0.1% por dia
    return (this.amount * feePercentage) / 100;
  }

  /**
   * Calcular valor total com multa
   */
  getTotalAmountWithFee() {
    return this.amount + this.calculateLateFee();
  }

  /**
   * Converter para objeto simples (para JSON)
   */
  toJSON() {
    return {
      id: this.id,
      clubId: this.clubId,
      pilotId: this.pilotId,
      dueDate: this.dueDate,
      amount: this.amount,
      description: this.description,
      status: this.status,
      paidDate: this.paidDate,
      paidAmount: this.paidAmount,
      paymentMethod: this.paymentMethod,
      transactionId: this.transactionId,
      notes: this.notes,
      isActive: this.isActive,
      isOverdue: this.isOverdue(),
      daysOverdue: this.getDaysOverdue(),
      daysUntilDue: this.getDaysUntilDue(),
      hasPaymentDifference: this.hasPaymentDifference(),
      lateFee: this.calculateLateFee(),
      totalAmountWithFee: this.getTotalAmountWithFee(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Payment;