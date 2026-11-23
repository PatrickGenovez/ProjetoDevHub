/**
 * Serviço de Cupons de Desconto - Bibliotech
 * Padrão Clean Code & Clean Architecture
 */

const ACTIVE_COUPONS = {
  CLUBE20: {
    code: 'CLUBE20',
    type: 'percentage',
    value: 20,
    minSubtotal: 40.0,
    description: '20% de desconto para membros do clube',
    maxDiscount: null
  },
  BEMVINDO10: {
    code: 'BEMVINDO10',
    type: 'percentage',
    value: 10,
    minSubtotal: 30.0,
    description: '10% de desconto na primeira compra',
    maxDiscount: null
  },
  FRETEGRATIS: {
    code: 'FRETEGRATIS',
    type: 'shipping',
    value: 100, // 100% off no frete
    minSubtotal: 50.0,
    description: 'Frete grátis para qualquer região',
    maxDiscount: null
  },
  LEITOR15: {
    code: 'LEITOR15',
    type: 'fixed',
    value: 15.0,
    minSubtotal: 60.0,
    description: 'R$ 15,00 de desconto em compras acima de R$ 60',
    maxDiscount: null
  },
  BIBLIO50: {
    code: 'BIBLIO50',
    type: 'percentage',
    value: 50,
    minSubtotal: 80.0,
    description: '50% de desconto (limitado a R$ 50 de desconto)',
    maxDiscount: 50.0
  }
};

class CouponService {
  /**
   * Validar código de cupom com base no subtotal da compra
   */
  static validate(code, subtotal = 0) {
    if (!code || typeof code !== 'string') {
      return {
        isValid: false,
        message: 'Código de cupom não informado.'
      };
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = ACTIVE_COUPONS[cleanCode];

    if (!coupon) {
      return {
        isValid: false,
        message: 'Cupom inválido ou expirado.'
      };
    }

    const numSubtotal = Math.max(0, parseFloat(subtotal) || 0);

    // Validação de subtotal mínimo
    if (coupon.minSubtotal && numSubtotal < coupon.minSubtotal) {
      return {
        isValid: false,
        message: `Este cupom é válido apenas para compras a partir de R$ ${coupon.minSubtotal.toFixed(2).replace('.', ',')}.`
      };
    }

    // Cálculo do desconto
    let discountAmount = 0;

    if (coupon.type === 'percentage') {
      discountAmount = (numSubtotal * coupon.value) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.type === 'fixed') {
      discountAmount = Math.min(coupon.value, numSubtotal);
    } else if (coupon.type === 'shipping') {
      discountAmount = 0; // O desconto é aplicado no frete
    }

    discountAmount = parseFloat(discountAmount.toFixed(2));
    const newSubtotal = parseFloat(Math.max(0, numSubtotal - discountAmount).toFixed(2));

    return {
      isValid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discountAmount,
      newSubtotal,
      description: coupon.description,
      isShippingFree: coupon.type === 'shipping'
    };
  }

  /**
   * Listar cupons ativos promocionais disponíveis
   */
  static listActive() {
    return Object.values(ACTIVE_COUPONS).map((c) => ({
      code: c.code,
      description: c.description,
      minSubtotal: c.minSubtotal,
      type: c.type
    }));
  }
}

module.exports = CouponService;
