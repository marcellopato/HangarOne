/**
 * Sistema de Autenticação HangarOne
 * Gerencia autenticação JWT, hash de senhas e tokens
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class AuthService {
  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'hangar-one-secret-key-2025';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
    this.BCRYPT_SALT_ROUNDS = 10;
  }

  /**
   * Gera hash da senha
   */
  async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(this.BCRYPT_SALT_ROUNDS);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw new Error('Erro ao criptografar senha');
    }
  }

  /**
   * Verifica se senha está correta
   */
  async comparePassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error('Erro ao verificar senha');
    }
  }

  /**
   * Gera token JWT
   */
  generateToken(user) {
    try {
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        clubId: user.clubId,
        name: user.name
      };

      return jwt.sign(payload, this.JWT_SECRET, {
        expiresIn: this.JWT_EXPIRES_IN,
        issuer: 'hangarone',
        audience: 'hangarone-users'
      });
    } catch (error) {
      throw new Error('Erro ao gerar token');
    }
  }

  /**
   * Verifica e decodifica token JWT
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, this.JWT_SECRET, {
        issuer: 'hangarone',
        audience: 'hangarone-users'
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expirado');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Token inválido');
      } else {
        throw new Error('Erro ao verificar token');
      }
    }
  }

  /**
   * Extrai token do header Authorization
   */
  extractTokenFromHeader(authHeader) {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }

  /**
   * Gera token para reset de senha
   */
  generateResetPasswordToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Gera data de expiração para reset de senha (1 hora)
   */
  generateResetPasswordExpires() {
    return new Date(Date.now() + 3600000); // 1 hora
  }

  /**
   * Verifica força da senha
   */
  checkPasswordStrength(password) {
    const strength = {
      score: 0,
      feedback: [],
      level: 'weak'
    };

    if (!password) {
      strength.feedback.push('Senha é obrigatória');
      return strength;
    }

    // Comprimento mínimo
    if (password.length >= 8) {
      strength.score += 1;
    } else {
      strength.feedback.push('Use pelo menos 8 caracteres');
    }

    // Letras minúsculas
    if (/[a-z]/.test(password)) {
      strength.score += 1;
    } else {
      strength.feedback.push('Adicione letras minúsculas');
    }

    // Letras maiúsculas
    if (/[A-Z]/.test(password)) {
      strength.score += 1;
    } else {
      strength.feedback.push('Adicione letras maiúsculas');
    }

    // Números
    if (/\d/.test(password)) {
      strength.score += 1;
    } else {
      strength.feedback.push('Adicione números');
    }

    // Caracteres especiais
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      strength.score += 1;
    } else {
      strength.feedback.push('Adicione caracteres especiais');
    }

    // Definir nível baseado na pontuação
    if (strength.score >= 4) {
      strength.level = 'strong';
    } else if (strength.score >= 3) {
      strength.level = 'medium';
    } else {
      strength.level = 'weak';
    }

    return strength;
  }

  /**
   * Middleware de autenticação
   */
  authenticate() {
    return async (req, res, next) => {
      try {
        const authHeader = req.headers.authorization;
        const token = this.extractTokenFromHeader(authHeader);

        if (!token) {
          return res.status(401).json({
            success: false,
            message: 'Token de acesso requerido'
          });
        }

        const decoded = this.verifyToken(token);
        req.user = decoded;
        next();
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }
    };
  }

  /**
   * Middleware de autorização por role
   */
  authorize(roles = []) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
      }

      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado. Privilégios insuficientes.'
        });
      }

      next();
    };
  }

  /**
   * Middleware para verificar acesso ao tenant (aeroclube)
   */
  checkTenantAccess() {
    return (req, res, next) => {
      const targetClubId = req.params.clubId || req.body.clubId || req.query.clubId;
      
      // Superadmin tem acesso a tudo
      if (req.user.role === 'superadmin') {
        return next();
      }

      // Outros roles só podem acessar seu próprio aeroclube
      if (targetClubId && targetClubId !== req.user.clubId) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado. Você só pode acessar recursos do seu aeroclube.'
        });
      }

      next();
    };
  }
}

module.exports = new AuthService();