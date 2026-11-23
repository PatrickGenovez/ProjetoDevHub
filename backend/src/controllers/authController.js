const AuthService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Controller para operações de autenticação e sessão (Clean Code)
 */
class AuthController {
  /**
   * POST /auth/register
   */
  static async register(req, res, next) {
    try {
      const { token, user } = await AuthService.register(req.body);
      return res.status(201).json({
        success: true,
        message: 'Conta criada com sucesso na Bibliotech!',
        token,
        user
      });
    } catch (error) {
      if (error.statusCode) {
        return ApiResponse.error(res, error.message, error.statusCode);
      }
      if (error.message.includes('obrigatórios') || error.message.includes('caracteres')) {
        return ApiResponse.badRequest(res, error.message);
      }
      next(error);
    }
  }

  /**
   * POST /auth/login
   */
  static async login(req, res, next) {
    try {
      const { token, user } = await AuthService.login(req.body);
      return res.json({
        success: true,
        message: `Bem-vindo de volta, ${user.full_name}!`,
        token,
        user
      });
    } catch (error) {
      if (error.statusCode) {
        return ApiResponse.error(res, error.message, error.statusCode);
      }
      if (error.message.includes('informe e-mail')) {
        return ApiResponse.badRequest(res, error.message);
      }
      next(error);
    }
  }

  /**
   * GET /auth/me
   */
  static async me(req, res, next) {
    try {
      const user = await AuthService.getCurrentUserProfile(req.user.id);
      return res.json({
        success: true,
        user
      });
    } catch (error) {
      if (error.statusCode === 404) {
        return ApiResponse.notFound(res, error.message);
      }
      next(error);
    }
  }

  /**
   * PATCH /auth/plan
   */
  static async updatePlan(req, res, next) {
    try {
      const { plano_id } = req.body;
      const updatedUser = await AuthService.updateSubscriptionPlan(req.user.id, plano_id);

      return res.json({
        success: true,
        message: `Plano atualizado para ${plano_id}!`,
        user: updatedUser
      });
    } catch (error) {
      if (error.message.includes('não informado')) {
        return ApiResponse.badRequest(res, error.message);
      }
      next(error);
    }
  }

  /**
   * POST /auth/reset-password
   */
  static async resetPassword(req, res, next) {
    try {
      const result = await AuthService.resetPassword(req.body);
      return res.json(result);
    } catch (error) {
      if (error.message.includes('Preencha') || error.message.includes('coincidem') || error.message.includes('caracteres')) {
        return ApiResponse.badRequest(res, error.message);
      }
      next(error);
    }
  }
}

module.exports = AuthController;
