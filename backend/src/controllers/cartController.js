/**
 * Controller de Carrinho e Sincronização de Conta - Bibliotech
 * Padrão Clean Code & Clean Architecture
 */

const CartService = require('../services/cartService');
const ApiResponse = require('../utils/apiResponse');

class CartController {
  /**
   * Buscar carrinho sincronizado do usuário autenticado
   * GET /api/cart
   */
  static async getCart(req, res, next) {
    try {
      const userId = req.user.id;
      const items = CartService.getCart(userId);
      return ApiResponse.success(res, items, 'Carrinho do usuário recuperado com sucesso');
    } catch (error) {
      next(error);
    }
  }
  /**
   * Salvar/Substituir itens do carrinho do usuário autenticado
   * PUT /api/cart
   * Body: { items: Array }
   */
  static async saveCart(req, res, next) {
    try {
      const userId = req.user.id;
      const { items } = req.body;
      const updatedCart = CartService.saveCart(userId, items);
      return ApiResponse.success(res, updatedCart, 'Carrinho salvo com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Sincronizar / Mesclar itens locais com a conta após o login
   * POST /api/cart/merge
   * Body: { items: Array }
   */
  static async mergeCart(req, res, next) {
    try {
      const userId = req.user.id;
      const { items } = req.body;
      const mergedCart = CartService.mergeCart(userId, items);
      return ApiResponse.success(res, mergedCart, 'Carrinho sincronizado com sua conta');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Limpar carrinho do usuário
   * DELETE /api/cart
   */
  static async clearCart(req, res, next) {
    try {
      const userId = req.user.id;
      CartService.clearCart(userId);
      return ApiResponse.success(res, [], 'Carrinho esvaziado com sucesso');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CartController;
