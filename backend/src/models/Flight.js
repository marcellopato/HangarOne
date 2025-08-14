/**
 * Modelo de Voo
 * Registro de voos realizados pelos pilotos
 */
class Flight {
  constructor({
    id = null,
    clubId, // FK para o aeroclube (multi-tenancy)
    pilotId, // FK para o piloto
    aircraftId, // FK para a aeronave
    date, // Data do voo
    departureTime,
    arrivalTime = null,
    duration = null, // Duração em minutos
    departureLocation,
    arrivalLocation = null,
    route = null, // Rota planejada/realizada
    altitude = null,
    weather = null, // Condições meteorológicas
    purpose, // training, recreation, competition, transport
    instructorId = null, // FK para instrutor (se voo de treinamento)
    notes = null,
    status = 'scheduled', // scheduled, in_flight, completed, cancelled
    flightType = 'local', // local, cross_country, competition
    isActive = true,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.clubId = clubId;
    this.pilotId = pilotId;
    this.aircraftId = aircraftId;
    this.date = date;
    this.departureTime = departureTime;
    this.arrivalTime = arrivalTime;
    this.duration = duration;
    this.departureLocation = departureLocation;
    this.arrivalLocation = arrivalLocation;
    this.route = route;
    this.altitude = altitude;
    this.weather = weather;
    this.purpose = purpose;
    this.instructorId = instructorId;
    this.notes = notes;
    this.status = status;
    this.flightType = flightType;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Propósitos de voo válidos
   */
  static getValidPurposes() {
    return ['training', 'recreation', 'competition', 'transport', 'maintenance_test'];
  }

  /**
   * Status de voo válidos
   */
  static getValidStatuses() {
    return ['scheduled', 'in_flight', 'completed', 'cancelled'];
  }

  /**
   * Tipos de voo válidos
   */
  static getValidFlightTypes() {
    return ['local', 'cross_country', 'competition', 'training'];
  }

  /**
   * Validar dados do voo
   */
  validate() {
    const errors = [];

    if (!this.clubId) {
      errors.push('Aeroclube é obrigatório');
    }

    if (!this.pilotId) {
      errors.push('Piloto é obrigatório');
    }

    if (!this.aircraftId) {
      errors.push('Aeronave é obrigatória');
    }

    if (!this.date) {
      errors.push('Data do voo é obrigatória');
    }

    if (!this.departureTime) {
      errors.push('Horário de decolagem é obrigatório');
    }

    if (!this.departureLocation || this.departureLocation.trim().length < 3) {
      errors.push('Local de decolagem deve ter pelo menos 3 caracteres');
    }

    if (!this.purpose || !Flight.getValidPurposes().includes(this.purpose)) {
      errors.push('Propósito do voo inválido');
    }

    if (this.status && !Flight.getValidStatuses().includes(this.status)) {
      errors.push('Status do voo inválido');
    }

    if (this.flightType && !Flight.getValidFlightTypes().includes(this.flightType)) {
      errors.push('Tipo de voo inválido');
    }

    if (this.arrivalTime && this.departureTime && this.arrivalTime <= this.departureTime) {
      errors.push('Horário de chegada deve ser posterior ao de decolagem');
    }

    if (this.duration && this.duration <= 0) {
      errors.push('Duração do voo deve ser positiva');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Calcular duração do voo automaticamente
   */
  calculateDuration() {
    if (this.departureTime && this.arrivalTime) {
      const departure = new Date(`1970-01-01T${this.departureTime}`);
      const arrival = new Date(`1970-01-01T${this.arrivalTime}`);
      
      let duration = (arrival - departure) / (1000 * 60); // em minutos
      
      // Se a chegada for no dia seguinte
      if (duration < 0) {
        duration += 24 * 60; // adiciona 24 horas
      }
      
      this.duration = Math.round(duration);
      this.updatedAt = new Date();
    }
  }

  /**
   * Marcar voo como iniciado
   */
  startFlight() {
    if (this.status === 'scheduled') {
      this.status = 'in_flight';
      this.updatedAt = new Date();
    }
  }

  /**
   * Marcar voo como concluído
   */
  completeFlight(arrivalTime = null, arrivalLocation = null) {
    if (this.status === 'in_flight') {
      this.status = 'completed';
      if (arrivalTime) this.arrivalTime = arrivalTime;
      if (arrivalLocation) this.arrivalLocation = arrivalLocation;
      this.calculateDuration();
      this.updatedAt = new Date();
    }
  }

  /**
   * Cancelar voo
   */
  cancelFlight(reason = null) {
    if (['scheduled', 'in_flight'].includes(this.status)) {
      this.status = 'cancelled';
      if (reason) this.notes = (this.notes || '') + `\nCancelado: ${reason}`;
      this.updatedAt = new Date();
    }
  }

  /**
   * Converter para objeto simples (para JSON)
   */
  toJSON() {
    return {
      id: this.id,
      clubId: this.clubId,
      pilotId: this.pilotId,
      aircraftId: this.aircraftId,
      date: this.date,
      departureTime: this.departureTime,
      arrivalTime: this.arrivalTime,
      duration: this.duration,
      departureLocation: this.departureLocation,
      arrivalLocation: this.arrivalLocation,
      route: this.route,
      altitude: this.altitude,
      weather: this.weather,
      purpose: this.purpose,
      instructorId: this.instructorId,
      notes: this.notes,
      status: this.status,
      flightType: this.flightType,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Flight;