/**
 * Modelo de Usuário do Sistema HangarOne
 * Representa todos os tipos de usuários (superadmin, admin, manager, pilot)
 * Implementa multitenancy baseado em aeroclubes
 */

class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.email = data.email || '';
    this.password = data.password || ''; // Hash da senha
    this.role = data.role || 'pilot'; // superadmin, admin, manager, pilot
    this.clubId = data.clubId || null; // Relacionamento com aeroclube (null para superadmin)
    this.cpf = data.cpf || '';
    this.phone = data.phone || '';
    this.address = data.address || '';
    this.birthDate = data.birthDate || null;
    this.licenseNumber = data.licenseNumber || ''; // Para pilotos
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.emailVerified = data.emailVerified || false;
    this.lastLogin = data.lastLogin || null;
    this.resetPasswordToken = data.resetPasswordToken || null;
    this.resetPasswordExpires = data.resetPasswordExpires || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Validações do modelo User
   */
  validate() {
    const errors = [];

    // Validações obrigatórias
    if (!this.name || this.name.length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Email é obrigatório e deve ser válido');
    }

    if (!this.password || this.password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }

    if (!['superadmin', 'admin', 'manager', 'pilot'].includes(this.role)) {
      errors.push('Role deve ser: superadmin, admin, manager ou pilot');
    }

    // Validações específicas por role
    if (this.role !== 'superadmin' && !this.clubId) {
      errors.push('clubId é obrigatório para todos os roles exceto superadmin');
    }

    if (this.role === 'superadmin' && this.clubId) {
      errors.push('superadmin não deve ter clubId');
    }

    // Validação de CPF (formato básico)
    if (this.cpf && !this.isValidCPF(this.cpf)) {
      errors.push('CPF deve ter formato válido (XXX.XXX.XXX-XX)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Verifica se email é válido
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Verifica se CPF tem formato válido (básico)
   */
  isValidCPF(cpf) {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(cpf);
  }

  /**
   * Converte para objeto JSON (remove campos sensíveis)
   */
  toJSON() {
    const user = { ...this };
    delete user.password;
    delete user.resetPasswordToken;
    return user;
  }

  /**
   * Verifica se usuário tem permissão para acessar recurso
   */
  canAccess(resource, targetClubId = null) {
    switch (this.role) {
      case 'superadmin':
        return true; // Acesso total
      
      case 'admin':
        // Admin pode acessar apenas seu próprio aeroclube
        return !targetClubId || targetClubId === this.clubId;
      
      case 'manager':
        // Manager pode acessar apenas o aeroclube que gerencia
        return !targetClubId || targetClubId === this.clubId;
      
      case 'pilot':
        // Pilot pode acessar apenas recursos do seu aeroclube
        // e apenas seus próprios recursos pessoais
        return !targetClubId || targetClubId === this.clubId;
      
      default:
        return false;
    }
  }

  /**
   * Verifica se usuário pode gerenciar outros usuários
   */
  canManageUsers() {
    return ['superadmin', 'admin', 'manager'].includes(this.role);
  }

  /**
   * Verifica se usuário pode criar aeroclubes
   */
  canCreateClubs() {
    return this.role === 'superadmin';
  }

  /**
   * Atualiza timestamp de último login
   */
  updateLastLogin() {
    this.lastLogin = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Atualiza timestamp de modificação
   */
  touch() {
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = User;