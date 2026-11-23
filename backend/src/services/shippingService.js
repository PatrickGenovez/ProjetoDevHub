/**
 * Serviço de Cálculo de Frete e Consulta de CEP - Bibliotech
 * Padrão Clean Code & Clean Architecture
 */

const FREE_SHIPPING_THRESHOLD = 99.0; // Frete grátis a partir de R$ 99,00

// Tabela de tarifas e prazos por faixa de CEP regional
const REGION_RATES = {
  SP_CAPITAL: { min: 1000, max: 5999, name: 'São Paulo (Capital)', pac: 12.9, sedex: 19.9, daysPac: 3, daysSedex: 1 },
  SP_INTERIOR: { min: 6000, max: 19999, name: 'São Paulo (Interior)', pac: 15.9, sedex: 24.9, daysPac: 4, daysSedex: 2 },
  RJ: { min: 20000, max: 28999, name: 'Rio de Janeiro', pac: 16.9, sedex: 26.9, daysPac: 5, daysSedex: 2 },
  ES: { min: 29000, max: 29999, name: 'Espírito Santo', pac: 18.9, sedex: 29.9, daysPac: 6, daysSedex: 3 },
  MG: { min: 30000, max: 39999, name: 'Minas Gerais', pac: 17.9, sedex: 27.9, daysPac: 5, daysSedex: 2 },
  SUL: { min: 80000, max: 99999, name: 'Região Sul (PR/SC/RS)', pac: 19.9, sedex: 32.9, daysPac: 6, daysSedex: 3 },
  CENTRO_OESTE: { min: 70000, max: 79999, name: 'Região Centro-Oeste (DF/GO/MT/MS/TO)', pac: 21.9, sedex: 35.9, daysPac: 7, daysSedex: 3 },
  NORDESTE: { min: 40000, max: 65999, name: 'Região Nordeste', pac: 24.9, sedex: 39.9, daysPac: 8, daysSedex: 4 },
  NORTE: { min: 66000, max: 69999, name: 'Região Norte', pac: 29.9, sedex: 46.9, daysPac: 10, daysSedex: 5 }
};

class ShippingService {
  /**
   * Consulta endereço completo pelo CEP na API ViaCEP com timeout resiliente
   */
  static async lookupAddress(cep) {
    const cleanCep = String(cep || '').replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      throw new Error('CEP deve conter exatamente 8 dígitos numéricos.');
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Bibliotech/1.0' }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`ViaCEP retornou status ${response.status}`);
      }

      const data = await response.json();
      if (data.erro) {
        throw new Error('CEP não encontrado na base dos Correios.');
      }

      return {
        cep: cleanCep,
        formattedCep: cleanCep.replace(/(\d{5})(\d{3})/, '$1-$2'),
        street: data.logradouro || '',
        complement: data.complemento || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || ''
      };
    } catch (err) {
      // Se a API externa falhar, retorna dados mínimos para não travar o fluxo do usuário
      return {
        cep: cleanCep,
        formattedCep: cleanCep.replace(/(\d{5})(\d{3})/, '$1-$2'),
        street: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        fallback: true
      };
    }
  }

  /**
   * Calcular opções de frete (PAC e SEDEX) por CEP e subtotal da compra
   * Usuários VIP possuem Frete Grátis Total para qualquer lugar do Brasil
   */
  static async calculate({ cep, subtotal = 0, isFreeShippingCoupon = false, isVip = false }) {
    const cleanCep = String(cep || '').replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      throw new Error('CEP inválido. Informe um CEP com 8 dígitos numéricos.');
    }

    // 1. Consulta dados de endereço
    const address = await this.lookupAddress(cleanCep);

    // 2. Determina a tarifa pela faixa de CEP
    const cepPrefix = parseInt(cleanCep.slice(0, 5), 10);
    let regionConfig = REGION_RATES.SP_CAPITAL;

    for (const key in REGION_RATES) {
      const reg = REGION_RATES[key];
      if (cepPrefix >= reg.min && cepPrefix <= reg.max) {
        regionConfig = reg;
        break;
      }
    }

    const numSubtotal = Math.max(0, parseFloat(subtotal) || 0);
    const qualifiesForFreeShipping = isVip || isFreeShippingCoupon || numSubtotal >= FREE_SHIPPING_THRESHOLD;

    // PAC: se for VIP ou atingir o valor de frete grátis, preço é 0
    const pacPrice = qualifiesForFreeShipping ? 0.0 : regionConfig.pac;
    const sedexPrice = regionConfig.sedex;

    const options = [
      {
        id: 'pac',
        name: isVip ? 'PAC VIP Nacional (Frete Grátis)' : 'PAC Econômico',
        description: isVip
          ? 'Benefício Membro VIP: Frete Grátis para todo o Brasil'
          : qualifiesForFreeShipping
          ? 'Frete Grátis Promocional'
          : 'Entrega padrão com rastreamento',
        price: pacPrice,
        formattedPrice: pacPrice === 0 ? 'GRÁTIS' : `R$ ${pacPrice.toFixed(2).replace('.', ',')}`,
        estimatedDays: regionConfig.daysPac,
        estimatedDeliveryText: `Até ${regionConfig.daysPac} dias úteis`,
        isFree: pacPrice === 0
      },
      {
        id: 'sedex',
        name: 'SEDEX Expresso',
        description: 'Entrega rápida com prioridade máxima de envio',
        price: sedexPrice,
        formattedPrice: `R$ ${sedexPrice.toFixed(2).replace('.', ',')}`,
        estimatedDays: regionConfig.daysSedex,
        estimatedDeliveryText: `Em até ${regionConfig.daysSedex} ${regionConfig.daysSedex === 1 ? 'dia útil' : 'dias úteis'}`,
        isFree: false
      }
    ];

    return {
      cep: cleanCep,
      formattedCep: address.formattedCep,
      address,
      regionName: regionConfig.name,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      qualifiesForFreeShipping,
      isVip,
      amountNeededForFreeShipping: isVip ? 0 : Math.max(0, parseFloat((FREE_SHIPPING_THRESHOLD - numSubtotal).toFixed(2))),
      options
    };
  }
}

module.exports = ShippingService;
