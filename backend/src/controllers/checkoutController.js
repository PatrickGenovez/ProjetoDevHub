/**
 * Controller de Checkout, Cupons e Frete - Bibliotech
 * Padrão Clean Code & Clean Architecture
 */

const CouponService = require('../services/couponService');
const ShippingService = require('../services/shippingService');
const ApiResponse = require('../utils/apiResponse');

class CheckoutController {
  /**
   * Validar código de cupom de desconto
   * POST /api/checkout/coupons/validate ou POST /api/coupons/validate
   * Body: { code: string, subtotal: number }
   */
  static async validateCoupon(req, res, next) {
    try {
      const { code, subtotal } = req.body;

      if (!code) {
        return ApiResponse.badRequest(res, 'Informe o código do cupom para validação.');
      }

      const result = CouponService.validate(code, subtotal);

      if (!result.isValid) {
        return ApiResponse.badRequest(res, result.message);
      }

      return ApiResponse.success(res, result, 'Cupom aplicado com sucesso!');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Listar cupons promocionais disponíveis
   * GET /api/checkout/coupons ou GET /api/coupons
   */
  static async listCoupons(req, res, next) {
    try {
      const coupons = CouponService.listActive();
      return ApiResponse.success(res, coupons, 'Cupons promocionais ativos');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Calcular opções de frete (PAC e SEDEX) por CEP
   * POST /api/checkout/shipping/calculate ou POST /api/shipping/calculate
   * Body: { cep: string, subtotal: number, couponCode?: string }
   */
  static async calculateShipping(req, res, next) {
    try {
      const { cep, subtotal = 0, couponCode } = req.body;

      if (!cep) {
        return ApiResponse.badRequest(res, 'Informe o CEP para cálculo do frete.');
      }

      let isFreeShippingCoupon = false;
      if (couponCode) {
        const couponResult = CouponService.validate(couponCode, subtotal);
        if (couponResult.isValid && couponResult.isShippingFree) {
          isFreeShippingCoupon = true;
        }
      }

      const shippingData = await ShippingService.calculate({
        cep,
        subtotal,
        isFreeShippingCoupon
      });

      return ApiResponse.success(res, shippingData, 'Opções de frete calculadas com sucesso');
    } catch (error) {
      if (error.message.includes('CEP inválido') || error.message.includes('CEP deve conter')) {
        return ApiResponse.badRequest(res, error.message);
      }
      next(error);
    }
  }

  /**
   * Consulta rápida de endereço por CEP (ViaCEP)
   * GET /api/checkout/shipping/cep/:cep ou GET /api/shipping/cep/:cep
   */
  static async lookupCep(req, res, next) {
    try {
      const { cep } = req.params;
      const address = await ShippingService.lookupAddress(cep);
      return ApiResponse.success(res, address, 'Endereço localizado com sucesso');
    } catch (error) {
      return ApiResponse.badRequest(res, error.message);
    }
  }
}

module.exports = CheckoutController;
