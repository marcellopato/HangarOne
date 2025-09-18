/**
 * Controller de Usuários HangarOne
 * Gerencia CRUD de usuários e autenticação
 */

const User = require('../models/User');
const AuthService = require('../services/AuthService');

// Armazenamento temporário em memória (será substituído pelo banco de dados)
let usersStorage = [
  {
    id: 1,
    name: 'Super Administrador',
    email: 'admin@hangarone.com',
    password: '', // Será definido na inicialização
    role: 'superadmin',
    clubId: null,
    cpf: '',
    phone: '',
    address: '',
    birthDate: null,
    licenseNumber: '',
    isActive: true,
    emailVerified: true,
    lastLogin: null,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  }
];

class UserController {
  /**
   * Inicializa dados padrão (executar na inicialização do servidor)
   */
  static async initializeDefaultUsers() {
    try {
      // Criar senha hash para o superadmin
      const defaultPassword = await AuthService.hashPassword('admin123');
      usersStorage[0].password = defaultPassword;
      
      console.log('🔐 Usuário superadmin inicializado:');
      console.log('   Email: admin@hangarone.com');
      console.log('   Senha: admin123');
      console.log('   Role: superadmin');
    } catch (error) {
      console.error('Erro ao inicializar usuários padrão:', error);
    }
  }

  /**
   * Registro de novo usuário
   */
  static async register(req, res) {
    try {
      const { name, email, password, role, clubId, cpf, phone, address, birthDate, licenseNumber } = req.body;

      // Verificar se email já existe
      const existingUser = usersStorage.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email já está em uso'
        });
      }

      // Criar novo usuário
      const userData = {
        id: Math.max(...usersStorage.map(u => u.id), 0) + 1,
        name,
        email,
        password,
        role: role || 'pilot',
        clubId: role === 'superadmin' ? null : clubId,
        cpf: cpf || '',
        phone: phone || '',
        address: address || '',
        birthDate: birthDate || null,
        licenseNumber: licenseNumber || '',
        isActive: true,
        emailVerified: false
      };

      const user = new User(userData);
      
      // Validar dados
      const validation = user.validate();
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: validation.errors
        });
      }

      // Hash da senha
      user.password = await AuthService.hashPassword(password);

      // Salvar usuário
      usersStorage.push(user);

      // Gerar token
      const token = AuthService.generateToken(user);

      res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: {
          user: user.toJSON(),
          token
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao registrar usuário',
        error: error.message
      });
    }
  }

  /**
   * Login de usuário
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email e senha são obrigatórios'
        });
      }

      // Buscar usuário
      const userIndex = usersStorage.findIndex(u => u.email === email);
      if (userIndex === -1) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      const userData = usersStorage[userIndex];
      const user = new User(userData);

      // Verificar se usuário está ativo
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Conta desativada. Contate o administrador.'
        });
      }

      // Verificar senha
      const isPasswordValid = await AuthService.comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Atualizar último login
      user.updateLastLogin();
      usersStorage[userIndex] = user;

      // Gerar token
      const token = AuthService.generateToken(user);

      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user: user.toJSON(),
          token
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao fazer login',
        error: error.message
      });
    }
  }

  /**
   * Logout (apenas resposta, token será removido no frontend)
   */
  static async logout(req, res) {
    try {
      res.json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao fazer logout',
        error: error.message
      });
    }
  }

  /**
   * Listar usuários (com controle de acesso)
   */
  static async listUsers(req, res) {
    try {
      let users = usersStorage;

      // Filtrar baseado no role do usuário logado
      if (req.user.role !== 'superadmin') {
        // Admin e manager só veem usuários do seu aeroclube
        users = users.filter(u => u.clubId === req.user.clubId);
      }

      const usersData = users.map(userData => {
        const user = new User(userData);
        return user.toJSON();
      });

      res.json({
        success: true,
        data: usersData,
        total: usersData.length,
        message: 'Usuários listados com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao listar usuários',
        error: error.message
      });
    }
  }

  /**
   * Buscar usuário por ID
   */
  static async getUser(req, res) {
    try {
      const { id } = req.params;
      const userData = usersStorage.find(u => u.id === parseInt(id));

      if (!userData) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      const user = new User(userData);

      // Verificar permissão de acesso
      if (req.user.role !== 'superadmin' && user.clubId !== req.user.clubId && user.id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      res.json({
        success: true,
        data: user.toJSON(),
        message: 'Usuário encontrado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar usuário',
        error: error.message
      });
    }
  }

  /**
   * Atualizar usuário
   */
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const userIndex = usersStorage.findIndex(u => u.id === parseInt(id));
      if (userIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      const currentUser = new User(usersStorage[userIndex]);

      // Verificar permissão
      if (req.user.role !== 'superadmin' && currentUser.clubId !== req.user.clubId && currentUser.id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      // Atualizar dados
      const updatedUserData = { ...usersStorage[userIndex], ...updateData };
      
      // Se senha foi alterada, fazer hash
      if (updateData.password) {
        updatedUserData.password = await AuthService.hashPassword(updateData.password);
      }

      const updatedUser = new User(updatedUserData);
      updatedUser.touch();

      // Validar
      const validation = updatedUser.validate();
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: validation.errors
        });
      }

      usersStorage[userIndex] = updatedUser;

      res.json({
        success: true,
        data: updatedUser.toJSON(),
        message: 'Usuário atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar usuário',
        error: error.message
      });
    }
  }

  /**
   * Desativar usuário (soft delete)
   */
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const userIndex = usersStorage.findIndex(u => u.id === parseInt(id));

      if (userIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      const user = new User(usersStorage[userIndex]);

      // Verificar permissão
      if (req.user.role !== 'superadmin' && user.clubId !== req.user.clubId) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      // Não permitir deletar superadmin
      if (user.role === 'superadmin') {
        return res.status(400).json({
          success: false,
          message: 'Não é possível desativar superadmin'
        });
      }

      // Desativar usuário
      user.isActive = false;
      user.touch();
      usersStorage[userIndex] = user;

      res.json({
        success: true,
        message: 'Usuário desativado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao desativar usuário',
        error: error.message
      });
    }
  }

  /**
   * Verificar força da senha
   */
  static checkPasswordStrength(req, res) {
    try {
      const { password } = req.body;
      const strength = AuthService.checkPasswordStrength(password);

      res.json({
        success: true,
        data: strength,
        message: 'Força da senha verificada'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao verificar força da senha',
        error: error.message
      });
    }
  }

  /**
   * Solicitar reset de senha
   */
  static async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;
      const userIndex = usersStorage.findIndex(u => u.email === email);

      if (userIndex === -1) {
        // Por segurança, sempre retornar sucesso mesmo se email não existir
        return res.json({
          success: true,
          message: 'Se o email existir, você receberá instruções para redefinir sua senha'
        });
      }

      const user = new User(usersStorage[userIndex]);
      user.resetPasswordToken = AuthService.generateResetPasswordToken();
      user.resetPasswordExpires = AuthService.generateResetPasswordExpires();
      user.touch();

      usersStorage[userIndex] = user;

      // TODO: Enviar email com o token (por enquanto, retornar na resposta para teste)
      res.json({
        success: true,
        message: 'Instruções de redefinição de senha enviadas',
        // REMOVER em produção - apenas para teste
        resetToken: user.resetPasswordToken
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao solicitar reset de senha',
        error: error.message
      });
    }
  }

  /**
   * Reset de senha com token
   */
  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Token e nova senha são obrigatórios'
        });
      }

      const userIndex = usersStorage.findIndex(u => 
        u.resetPasswordToken === token && 
        new Date(u.resetPasswordExpires) > new Date()
      );

      if (userIndex === -1) {
        return res.status(400).json({
          success: false,
          message: 'Token inválido ou expirado'
        });
      }

      const user = new User(usersStorage[userIndex]);
      user.password = await AuthService.hashPassword(newPassword);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      user.touch();

      usersStorage[userIndex] = user;

      res.json({
        success: true,
        message: 'Senha redefinida com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao redefinir senha',
        error: error.message
      });
    }
  }
}

module.exports = UserController;