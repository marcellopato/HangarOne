/**
 * Modelo de Documento
 * Representa documentos anexados a pilotos, aeronaves ou aeroclubes
 */
class Document {
  constructor({
    id = null,
    clubId, // FK para o aeroclube (multi-tenancy)
    entityType, // 'pilot', 'aircraft', 'club'
    entityId, // ID da entidade (piloto, aeronave ou clube)
    name,
    type, // Tipo do documento (RG, CPF, CHT, etc.)
    filePath,
    fileName,
    fileSize,
    mimeType,
    expirationDate = null,
    isRequired = false,
    aiValidated = false,
    aiValidationResult = null,
    uploadedAt = new Date(),
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.clubId = clubId;
    this.entityType = entityType;
    this.entityId = entityId;
    this.name = name;
    this.type = type;
    this.filePath = filePath;
    this.fileName = fileName;
    this.fileSize = fileSize;
    this.mimeType = mimeType;
    this.expirationDate = expirationDate;
    this.isRequired = isRequired;
    this.aiValidated = aiValidated;
    this.aiValidationResult = aiValidationResult;
    this.uploadedAt = uploadedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Tipos de entidade válidos
   */
  static getValidEntityTypes() {
    return ['pilot', 'aircraft', 'club'];
  }

  /**
   * Tipos MIME aceitos para imagens
   */
  static getValidImageMimeTypes() {
    return [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf'
    ];
  }

  /**
   * Validar dados do documento
   */
  validate() {
    const errors = [];

    if (!this.clubId) {
      errors.push('ID do aeroclube é obrigatório');
    }

    if (!this.entityType || !Document.getValidEntityTypes().includes(this.entityType)) {
      errors.push('Tipo de entidade inválido');
    }

    if (!this.entityId) {
      errors.push('ID da entidade é obrigatório');
    }

    if (!this.name || this.name.trim().length < 3) {
      errors.push('Nome do documento deve ter pelo menos 3 caracteres');
    }

    if (!this.type || this.type.trim().length < 2) {
      errors.push('Tipo do documento deve ter pelo menos 2 caracteres');
    }

    if (!this.filePath) {
      errors.push('Caminho do arquivo é obrigatório');
    }

    if (!this.fileName) {
      errors.push('Nome do arquivo é obrigatório');
    }

    if (!this.mimeType || !Document.getValidImageMimeTypes().includes(this.mimeType)) {
      errors.push('Tipo de arquivo não suportado');
    }

    if (this.fileSize && this.fileSize > 10 * 1024 * 1024) { // 10MB
      errors.push('Arquivo muito grande (máximo 10MB)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Verificar se o documento está expirado
   */
  isExpired() {
    if (!this.expirationDate) return false;
    return new Date(this.expirationDate) < new Date();
  }

  /**
   * Verificar se o documento expira em breve (30 dias)
   */
  isExpiringSoon() {
    if (!this.expirationDate) return false;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return new Date(this.expirationDate) <= thirtyDaysFromNow;
  }

  /**
   * Converter para objeto simples (para JSON)
   */
  toJSON() {
    return {
      id: this.id,
      clubId: this.clubId,
      entityType: this.entityType,
      entityId: this.entityId,
      name: this.name,
      type: this.type,
      filePath: this.filePath,
      fileName: this.fileName,
      fileSize: this.fileSize,
      mimeType: this.mimeType,
      expirationDate: this.expirationDate,
      isRequired: this.isRequired,
      aiValidated: this.aiValidated,
      aiValidationResult: this.aiValidationResult,
      isExpired: this.isExpired(),
      isExpiringSoon: this.isExpiringSoon(),
      uploadedAt: this.uploadedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Document;