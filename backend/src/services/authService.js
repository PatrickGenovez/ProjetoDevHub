const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserService = require('./userService');
const { CONFIG, PLANS, USER_ROLES } = require('../config/constants');

/**
 * Serviço de regras de negócio para Autenticação e Gestão de Contas (Clean Code)
 */
class AuthService {
  /**
   * Gerador de Token JWT seguro (DRY)
   */
  static generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role || USER_ROLES.USER,
        plano_id: user.plano_id || PLANS.VISITOR
      },
      CONFIG.JWT_SECRET,
      { expiresIn: CONFIG.JWT_EXPIRES_IN }
    );
  }

  /**
   * Sanitiza o objeto de usuário removendo dados sensíveis como password_hash
   */
  static sanitizeUser(user) {
    if (!user) return null;
    const { password_hash, ...safeUser } = user;
    return {
      id: safeUser.id,
      email: safeUser.email,
      full_name: safeUser.full_name,
      plano_id: safeUser.plano_id || PLANS.VISITOR,
      avatar_url: safeUser.avatar_url || '',
      role: safeUser.role || USER_ROLES.USER
    };
  }

  /**
   * Cadastrar novo usuário (Signup)
   */
  static async register({ email, password, full_name, name, plano_id }) {
    const userName = (full_name || name || '').trim();

    if (!email || !password || !userName) {
      throw new Error('E-mail, senha e nome completo são obrigatórios.');
    }

    if (password.length < 6) {
      throw new Error('A senha deve ter no mínimo 6 caracteres.');
    }

    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      const error = new Error('Este e-mail já está cadastrado na Bibliotech.');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, CONFIG.BCRYPT_SALT_ROUNDS);

    const newUser = await UserService.create({
      email,
      full_name: userName,
      password_hash: hashedPassword,
      plano_id: plano_id || PLANS.VISITOR,
      avatar_url: '',
      role: USER_ROLES.USER
    });

    const token = this.generateToken(newUser);
    const sanitizedUser = this.sanitizeUser(newUser);

    return { token, user: sanitizedUser };
  }

  /**
   * Realizar login com validação de credenciais
   */
  static async login({ email, password }) {
    if (!email || !password) {
      throw new Error('Por favor, informe e-mail e senha.');
    }

    const user = await UserService.findByEmail(email);
    if (!user) {
      const error = new Error('E-mail ou senha incorretos.');
      error.statusCode = 400;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      const error = new Error('E-mail ou senha incorretos.');
      error.statusCode = 400;
      throw error;
    }

    const token = this.generateToken(user);
    const sanitizedUser = this.sanitizeUser(user);

    return { token, user: sanitizedUser };
  }

  /**
   * Recuperar perfil do usuário autenticado
   */
  static async getCurrentUserProfile(userId) {
    const user = await UserService.findById(userId);
    if (!user) {
      const error = new Error('Usuário não encontrado.');
      error.statusCode = 404;
      throw error;
    }
    return this.sanitizeUser(user);
  }

  /**
   * Atualizar plano de assinatura
   */
  static async updateSubscriptionPlan(userId, planId) {
    if (!planId) {
      throw new Error('Plano não informado.');
    }

    await UserService.updatePlan(userId, planId);
    const updatedUser = await UserService.findById(userId);
    return this.sanitizeUser(updatedUser);
  }

  /**
   * Redefinir senha
   */
  static async resetPassword({ email, newPassword, confirmPassword }) {
    if (!email || !newPassword || !confirmPassword) {
      throw new Error('Preencha todos os campos.');
    }

    if (newPassword !== confirmPassword) {
      throw new Error('As senhas não coincidem.');
    }

    if (newPassword.length < 6) {
      throw new Error('A nova senha deve ter no mínimo 6 caracteres.');
    }

    const user = await UserService.findByEmail(email);
    if (!user) {
      // Retorna sucesso genérico para não vazar a existência do email
      return { message: 'Se o e-mail existir, a senha será redefinida.' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, CONFIG.BCRYPT_SALT_ROUNDS);
    await UserService.updatePassword(email, hashedPassword);

    return { message: 'Senha redefinida com sucesso! Faça login com a nova senha.' };
  }
}

module.exports = AuthService;
