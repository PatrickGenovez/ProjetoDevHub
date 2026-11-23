import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  ShoppingBag,
  Truck,
  Tag,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Loader2,
  Sparkles,
  Percent,
  Check,
  AlertCircle,
  Clock,
  ArrowRight,
  Crown
} from 'lucide-react';
import styles from './CheckoutModal.module.css';

export default function CheckoutModal({
  isOpen,
  onClose,
  cart = [],
  currentUser = null,
  onOrderSuccess = () => {}
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Estados de Entrega / Frete
  const [cep, setCep] = useState('');
  const [addressData, setAddressData] = useState(null);
  const [addressNumber, setAddressNumber] = useState('');
  const [addressComplement, setAddressComplement] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState('pac'); // 'pac' | 'sedex'
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState(null);

  // Estados de Cupom
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState(null);
  const [couponSuccessMessage, setCouponSuccessMessage] = useState(null);

  // Estados de Pagamento e Dados do Comprador
  const [paymentMethod, setPaymentMethod] = useState('pix'); // 'pix' | 'credit' | 'boleto'
  const [installments, setInstallments] = useState(1);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado de Confirmação do Pedido
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Preenche dados do usuário autenticado se disponível
  useEffect(() => {
    if (currentUser) {
      if (currentUser.nome || currentUser.name) setBuyerName(currentUser.nome || currentUser.name);
      if (currentUser.email) setBuyerEmail(currentUser.email);
    }
  }, [currentUser]);

  // Identifica se o usuário possui plano VIP ativo
  const isVip = useMemo(() => {
    if (!currentUser) return false;
    const plan = String(currentUser.plano_id || currentUser.subscription || currentUser.plan || '').toLowerCase();
    return plan === 'vip' || plan === 'master' || plan === 'box-vip' || Boolean(currentUser.isVip);
  }, [currentUser]);

  // Cálculos de Itens e Subtotal
  const cartTotalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const price = item.price || item.book?.price || 49.9;
      return acc + price * (item.quantity || 1);
    }, 0);
  }, [cart]);

  // Desconto Exclusivo de Membro VIP (20% em todas as compras de livros)
  const vipDiscount = useMemo(() => {
    if (!isVip) return 0;
    const val = (cartSubtotal * 0.20);
    return parseFloat(val.toFixed(2));
  }, [isVip, cartSubtotal]);

  // Frete Selecionado (Membros VIP possuem Frete Grátis Total para todo o Brasil)
  const selectedShipping = useMemo(() => {
    if (isVip) {
      return {
        id: 'pac-vip',
        name: 'PAC VIP Nacional (Frete Grátis)',
        price: 0,
        estimatedDeliveryText: '3 a 6 dias úteis',
        isFree: true
      };
    }
    if (!shippingOptions || shippingOptions.length === 0) {
      // Frete padrão se ainda não calculou por CEP
      const isFree = cartSubtotal >= 99 || appliedCoupon?.isShippingFree;
      return {
        id: 'pac',
        name: 'PAC Econômico',
        price: isFree ? 0 : 14.9,
        estimatedDeliveryText: '4 a 7 dias úteis',
        isFree
      };
    }
    const found = shippingOptions.find((opt) => opt.id === selectedShippingMethod);
    return found || shippingOptions[0];
  }, [isVip, shippingOptions, selectedShippingMethod, cartSubtotal, appliedCoupon]);

  const shippingCost = isVip ? 0 : (selectedShipping ? selectedShipping.price : 0);

  // Valor do Desconto do Cupom
  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const base = Math.max(0, cartSubtotal - vipDiscount);
    if (appliedCoupon.type === 'percentage') {
      const val = (base * appliedCoupon.value) / 100;
      return parseFloat(val.toFixed(2));
    }
    if (appliedCoupon.type === 'fixed') {
      return Math.min(appliedCoupon.value, base);
    }
    return 0;
  }, [appliedCoupon, cartSubtotal, vipDiscount]);

  // Desconto Extra do PIX (5% sobre produtos pós-descontos)
  const pixDiscount = useMemo(() => {
    if (paymentMethod !== 'pix') return 0;
    const base = Math.max(0, cartSubtotal - vipDiscount - couponDiscount);
    return parseFloat((base * 0.05).toFixed(2));
  }, [paymentMethod, cartSubtotal, vipDiscount, couponDiscount]);

  // Total Final
  const finalTotal = useMemo(() => {
    const total = cartSubtotal - vipDiscount - couponDiscount + shippingCost - pixDiscount;
    return Math.max(0, parseFloat(total.toFixed(2)));
  }, [cartSubtotal, vipDiscount, couponDiscount, shippingCost, pixDiscount]);

  // Formatação de Máscara de CEP (00000-000)
  const handleCepChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    let formatted = raw;
    if (raw.length > 5) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5, 8)}`;
    }
    setCep(formatted);
    setShippingError(null);

    // Auto-calcula ao atingir 8 dígitos
    if (raw.length === 8) {
      fetchShipping(raw);
    }
  };

  // Calcular Frete no Backend (ViaCEP + Tarifas Regionais)
  const fetchShipping = async (cleanCepParam) => {
    const rawCep = cleanCepParam || cep.replace(/\D/g, '');
    if (rawCep.length !== 8) {
      setShippingError('Digite um CEP válido com 8 números.');
      return;
    }

    setIsCalculatingShipping(true);
    setShippingError(null);

    try {
      const res = await fetch(`${apiUrl}/checkout/shipping/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cep: rawCep,
          subtotal: cartSubtotal,
          couponCode: appliedCoupon?.code || undefined,
          isVip
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Não foi possível calcular o frete para este CEP.');
      }

      setAddressData(json.data.address);
      setShippingOptions(json.data.options || []);
      if (json.data.options && json.data.options.length > 0) {
        setSelectedShippingMethod(json.data.options[0].id);
      }
    } catch (err) {
      setShippingError(err.message || 'Erro ao conectar com o serviço de frete.');
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  // Validar Cupom no Backend (CLUBE20, BEMVINDO10, etc.)
  const handleApplyCoupon = async (codeToApply) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) {
      setCouponError('Digite um código de cupom.');
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError(null);
    setCouponSuccessMessage(null);

    try {
      const res = await fetch(`${apiUrl}/checkout/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          subtotal: cartSubtotal
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Cupom inválido ou expirado.');
      }

      setAppliedCoupon(json.data);
      setCouponSuccessMessage(`Cupom ${json.data.code} aplicado com sucesso!`);
      setCouponCode('');

      // Se for cupom de frete grátis, recalcula opções de frete se já tiver CEP
      if (json.data.isShippingFree && cep.replace(/\D/g, '').length === 8) {
        fetchShipping(cep.replace(/\D/g, ''));
      }
    } catch (err) {
      setCouponError(err.message || 'Cupom inválido.');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccessMessage(null);
    setCouponError(null);
  };

  // Confirmar Pedido
  const handleConfirmOrder = async (e) => {
    e.preventDefault();

    if (!buyerName.trim()) {
      alert('Por favor, informe seu nome completo para a entrega.');
      return;
    }
    if (!buyerEmail.trim()) {
      alert('Por favor, informe seu e-mail para receber o código de rastreamento.');
      return;
    }

    setIsSubmitting(true);

    const orderId = `BLT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const orderPayload = {
      orderId,
      createdAt: new Date().toISOString(),
      dateFormatted: new Date().toLocaleDateString('pt-BR'),
      buyer: {
        name: buyerName,
        email: buyerEmail
      },
      deliveryAddress: {
        cep: cep || '01001-000',
        street: addressData?.street || 'Endereço Principal',
        number: addressNumber || 'S/N',
        complement: addressComplement,
        neighborhood: addressData?.neighborhood || '',
        city: addressData?.city || 'São Paulo',
        state: addressData?.state || 'SP'
      },
      shipping: {
        method: selectedShipping.name,
        days: selectedShipping.estimatedDeliveryText,
        price: shippingCost
      },
      coupon: appliedCoupon
        ? {
            code: appliedCoupon.code,
            discount: couponDiscount
          }
        : null,
      payment: {
        method: paymentMethod,
        methodLabel:
          paymentMethod === 'pix'
            ? 'PIX Instantâneo'
            : paymentMethod === 'credit'
            ? `Cartão de Crédito (${installments}x)`
            : 'Boleto Bancário',
        totalPaid: finalTotal
      },
      items: cart,
      subtotal: cartSubtotal,
      finalTotal
    };

    setTimeout(() => {
      setConfirmedOrder(orderPayload);
      setIsSubmitting(false);
      onOrderSuccess(orderPayload);
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Cabeçalho */}
        <div className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <div className={styles.headerIcon}>
              <ShoppingBag size={22} />
            </div>
            <div>
              <h3 className={styles.title}>
                {confirmedOrder ? 'Pedido Confirmado!' : 'Checkout Seguro'}
              </h3>
              <p className={styles.subtitle}>
                {confirmedOrder
                  ? 'Sua compra foi aprovada e está sendo separada.'
                  : `Revise seus ${cartTotalItems} ${cartTotalItems === 1 ? 'item' : 'itens'} e escolha a forma de envio`}
              </p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} title="Fechar modal">
            <X size={20} />
          </button>
        </div>

        {/* Corpo do Checkout */}
        {!confirmedOrder ? (
          <form onSubmit={handleConfirmOrder} className={styles.body}>
            {/* Coluna Esquerda: Entrega, Cupom e Pagamento */}
            <div className={styles.leftCol}>
              {/* Banner de Status VIP */}
              {isVip ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(198, 146, 56, 0.12)',
                  border: '1px solid #c69238',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginBottom: '1rem',
                  color: 'var(--color-gold-accent, #c69238)'
                }}>
                  <Crown size={22} style={{ flexShrink: 0, color: '#e5b352' }} />
                  <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                    <strong style={{ display: 'block', color: 'var(--color-gold-light, #e5b352)' }}>Membro VIP Ativo!</strong>
                    <span>Você tem <strong>20% de desconto</strong> nos livros e <strong>Frete Grátis</strong> garantido para todo o Brasil.</span>
                  </div>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(140, 86, 39, 0.06)',
                  border: '1px dashed rgba(140, 86, 39, 0.25)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '1rem',
                  fontSize: '0.82rem',
                  color: 'var(--color-text-secondary)'
                }}>
                  <Sparkles size={16} style={{ color: '#c69238', flexShrink: 0 }} />
                  <span>Assine o <strong>Plano VIP</strong> da Bibliotech para ter 20% OFF em todos os livros e frete 100% grátis!</span>
                </div>
              )}

              {/* 1. Entrega e Cálculo de Frete */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <Truck size={18} className={styles.sectionIcon} />
                  <h4 className={styles.sectionTitle}>1. Endereço de Entrega & Frete</h4>
                </div>

                <div className={styles.cepRow}>
                  <div className={styles.cepInputWrapper}>
                    <MapPin size={16} className={styles.inputIcon} />
                    <input
                      type="text"
                      maxLength={9}
                      placeholder="00000-000 (Digite seu CEP)"
                      value={cep}
                      onChange={handleCepChange}
                      className={styles.cepInput}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => fetchShipping()}
                    disabled={isCalculatingShipping || cep.replace(/\D/g, '').length < 8}
                    className={styles.btnCalcShipping}
                  >
                    {isCalculatingShipping ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Truck size={16} />
                    )}
                    <span>{isCalculatingShipping ? 'Calculando...' : 'Calcular'}</span>
                  </button>
                </div>

                {shippingError && (
                  <div style={{ color: '#ef4444', fontSize: '0.82rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <AlertCircle size={14} />
                    <span>{shippingError}</span>
                  </div>
                )}

                {addressData && (
                  <div className={styles.addressBox}>
                    <div>
                      <strong>Local de Entrega:</strong> {addressData.street || 'Logradouro'}
                      {addressData.neighborhood ? `, ${addressData.neighborhood}` : ''}
                    </div>
                    <div>
                      {addressData.city} - {addressData.state} • CEP: {addressData.formattedCep || cep}
                    </div>
                  </div>
                )}

                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Número *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 120"
                      value={addressNumber}
                      onChange={(e) => setAddressNumber(e.target.value)}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Complemento</label>
                    <input
                      type="text"
                      placeholder="Apto 42, Bloco B"
                      value={addressComplement}
                      onChange={(e) => setAddressComplement(e.target.value)}
                      className={styles.formInput}
                    />
                  </div>
                </div>

                {/* Opções de Envio (PAC vs SEDEX) */}
                <div className={styles.shippingOptions}>
                  {shippingOptions.length > 0 ? (
                    shippingOptions.map((opt) => (
                      <div
                        key={opt.id}
                        className={`${styles.shippingOptionCard} ${
                          selectedShippingMethod === opt.id ? styles.shippingOptionSelected : ''
                        }`}
                        onClick={() => setSelectedShippingMethod(opt.id)}
                      >
                        <div className={styles.shippingOptionInfo}>
                          <div className={styles.radioIndicator}>
                            {selectedShippingMethod === opt.id && <div className={styles.radioDot} />}
                          </div>
                          <div>
                            <div className={styles.shippingName}>
                              <span>{opt.name}</span>
                              {opt.isFree && <span className={styles.freeShippingTag}>GRÁTIS</span>}
                            </div>
                            <div className={styles.shippingDays}>{opt.estimatedDeliveryText}</div>
                          </div>
                        </div>
                        <div className={styles.shippingPrice}>
                          {opt.isFree ? 'GRÁTIS' : `R$ ${opt.price.toFixed(2).replace('.', ',')}`}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      className={`${styles.shippingOptionCard} ${styles.shippingOptionSelected}`}
                    >
                      <div className={styles.shippingOptionInfo}>
                        <div className={styles.radioIndicator}>
                          <div className={styles.radioDot} />
                        </div>
                        <div>
                          <div className={styles.shippingName}>
                            <span>PAC Econômico Nacional</span>
                            {cartSubtotal >= 99 && (
                              <span className={styles.freeShippingTag}>FRETE GRÁTIS</span>
                            )}
                          </div>
                          <div className={styles.shippingDays}>
                            {cartSubtotal >= 99
                              ? 'Grátis para compras acima de R$ 99'
                              : 'Digite o CEP acima para calcular tarifas exatas'}
                          </div>
                        </div>
                      </div>
                      <div className={styles.shippingPrice}>
                        {cartSubtotal >= 99 ? 'GRÁTIS' : 'R$ 14,90'}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Cupom de Desconto */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <Tag size={18} className={styles.sectionIcon} />
                  <h4 className={styles.sectionTitle}>2. Cupom de Desconto</h4>
                </div>

                <div className={styles.couponBox}>
                  <input
                    type="text"
                    placeholder="Digite seu cupom (Ex: CLUBE20)"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponError(null);
                    }}
                    className={styles.couponInput}
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={isValidatingCoupon || !couponCode.trim()}
                    className={styles.btnApplyCoupon}
                  >
                    {isValidatingCoupon ? 'Validando...' : 'Aplicar'}
                  </button>
                </div>

                {couponError && (
                  <div style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <AlertCircle size={14} />
                    <span>{couponError}</span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className={styles.appliedCouponBadge}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Check size={16} />
                      <span>
                        Cupom <strong>{appliedCoupon.code}</strong> ativo ({appliedCoupon.description || 'Desconto aplicado'})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className={styles.btnRemoveCoupon}
                    >
                      Remover
                    </button>
                  </div>
                )}

                {/* Sugestões rápidas de cupons */}
                <div className={styles.couponSuggestions}>
                  <span className={styles.suggestionLabel}>Cupons disponíveis:</span>
                  <button
                    type="button"
                    className={styles.couponChip}
                    onClick={() => handleApplyCoupon('CLUBE20')}
                  >
                    <Sparkles size={12} color="#10b981" />
                    <strong>CLUBE20</strong> (20% OFF)
                  </button>
                  <button
                    type="button"
                    className={styles.couponChip}
                    onClick={() => handleApplyCoupon('BEMVINDO10')}
                  >
                    <Percent size={12} />
                    <strong>BEMVINDO10</strong> (10% OFF)
                  </button>
                  <button
                    type="button"
                    className={styles.couponChip}
                    onClick={() => handleApplyCoupon('FRETEGRATIS')}
                  >
                    <Truck size={12} />
                    <strong>FRETEGRATIS</strong>
                  </button>
                </div>
              </div>

              {/* 3. Forma de Pagamento */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <CreditCard size={18} className={styles.sectionIcon} />
                  <h4 className={styles.sectionTitle}>3. Forma de Pagamento</h4>
                </div>

                <div className={styles.paymentGrid}>
                  <div
                    className={`${styles.paymentCard} ${
                      paymentMethod === 'pix' ? styles.paymentCardSelected : ''
                    }`}
                    onClick={() => setPaymentMethod('pix')}
                  >
                    <div className={styles.paymentBadge}>5% OFF</div>
                    <Sparkles size={22} color="#10b981" />
                    <span className={styles.paymentName}>PIX</span>
                    <span className={styles.paymentHint}>Aprovação Instantânea</span>
                  </div>

                  <div
                    className={`${styles.paymentCard} ${
                      paymentMethod === 'credit' ? styles.paymentCardSelected : ''
                    }`}
                    onClick={() => setPaymentMethod('credit')}
                  >
                    <CreditCard size={22} color="#3b82f6" />
                    <span className={styles.paymentName}>Cartão</span>
                    <span className={styles.paymentHint}>Até 6x sem juros</span>
                  </div>

                  <div
                    className={`${styles.paymentCard} ${
                      paymentMethod === 'boleto' ? styles.paymentCardSelected : ''
                    }`}
                    onClick={() => setPaymentMethod('boleto')}
                  >
                    <Clock size={22} color="#eab308" />
                    <span className={styles.paymentName}>Boleto</span>
                    <span className={styles.paymentHint}>Compensação em 1 dia</span>
                  </div>
                </div>

                {paymentMethod === 'pix' && (
                  <div style={{ marginTop: '0.85rem', fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16, 185, 129, 0.08)', padding: '0.6rem 0.85rem', borderRadius: '8px' }}>
                    <Sparkles size={16} />
                    <span>Economize <strong>R$ {pixDiscount.toFixed(2).replace('.', ',')}</strong> pagando via PIX! Chave gerada na próxima tela.</span>
                  </div>
                )}

                {paymentMethod === 'credit' && (
                  <div style={{ marginTop: '0.85rem' }} className={styles.formField}>
                    <label className={styles.formLabel}>Parcelamento</label>
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(Number(e.target.value))}
                      className={styles.formInput}
                      style={{ cursor: 'pointer' }}
                    >
                      <option value={1}>1x de R$ {finalTotal.toFixed(2).replace('.', ',')} (à vista sem juros)</option>
                      <option value={2}>2x de R$ {(finalTotal / 2).toFixed(2).replace('.', ',')} sem juros</option>
                      <option value={3}>3x de R$ {(finalTotal / 3).toFixed(2).replace('.', ',')} sem juros</option>
                      <option value={4}>4x de R$ {(finalTotal / 4).toFixed(2).replace('.', ',')} sem juros</option>
                      <option value={5}>5x de R$ {(finalTotal / 5).toFixed(2).replace('.', ',')} sem juros</option>
                      <option value={6}>6x de R$ {(finalTotal / 6).toFixed(2).replace('.', ',')} sem juros</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Coluna Direita: Resumo dos Itens, Totais e Botão de Confirmação */}
            <div className={styles.rightCol}>
              {/* Dados do Comprador */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <ShieldCheck size={18} className={styles.sectionIcon} />
                  <h4 className={styles.sectionTitle}>Dados do Destinatário</h4>
                </div>

                <div className={styles.formField} style={{ marginBottom: '0.6rem' }}>
                  <label className={styles.formLabel}>Nome Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome completo"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>E-mail de Confirmação *</label>
                  <input
                    type="email"
                    required
                    placeholder="seuemail@exemplo.com"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className={styles.formInput}
                  />
                </div>
              </div>

              {/* Lista Resumo dos Itens */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <ShoppingBag size={18} className={styles.sectionIcon} />
                  <h4 className={styles.sectionTitle}>
                    Itens do Pedido ({cartTotalItems})
                  </h4>
                </div>

                <div className={styles.itemsList}>
                  {cart.map((item, idx) => {
                    const price = item.price || item.book?.price || 49.9;
                    const cover = item.coverImage || item.book?.coverImage;
                    const title = item.title || item.book?.title || 'Livro';
                    const author = item.author || item.book?.author || 'Autor';
                    const qty = item.quantity || 1;

                    return (
                      <div key={idx} className={styles.itemRow}>
                        {cover ? (
                          <img
                            src={cover}
                            alt={title}
                            className={styles.itemCover}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className={styles.itemCoverPlaceholder}>
                            <ShoppingBag size={16} />
                          </div>
                        )}
                        <div className={styles.itemMeta}>
                          <h5 className={styles.itemTitle} title={title}>
                            {title}
                          </h5>
                          <p className={styles.itemAuthor}>{author}</p>
                          <span className={styles.itemQty}>
                            {qty}x R$ {price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                        <div className={styles.itemPrice}>
                          R$ {(price * qty).toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Resumo Financeiro */}
              <div className={styles.summaryBox}>
                <div className={styles.summaryRow}>
                  <span>Subtotal ({cartTotalItems} {cartTotalItems === 1 ? 'item' : 'itens'})</span>
                  <span>R$ {cartSubtotal.toFixed(2).replace('.', ',')}</span>
                </div>

                {/* Desconto VIP */}
                {isVip && vipDiscount > 0 && (
                  <div className={`${styles.summaryRow} ${styles.summaryDiscount}`} style={{ color: '#c69238', fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Crown size={14} />
                      <span>Desconto Membro VIP (20%)</span>
                    </span>
                    <span>- R$ {vipDiscount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}

                {appliedCoupon && couponDiscount > 0 && (
                  <div className={`${styles.summaryRow} ${styles.summaryDiscount}`}>
                    <span>Cupom {appliedCoupon.code}</span>
                    <span>- R$ {couponDiscount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}

                <div className={styles.summaryRow}>
                  <span>Frete {isVip ? '(Membro VIP Brasil)' : `(${selectedShipping?.name || 'PAC'})`}</span>
                  <span style={{ color: shippingCost === 0 ? '#10b981' : 'inherit', fontWeight: shippingCost === 0 ? 700 : 400 }}>
                    {shippingCost === 0 ? 'GRÁTIS' : `R$ ${shippingCost.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>

                {paymentMethod === 'pix' && pixDiscount > 0 && (
                  <div className={`${styles.summaryRow} ${styles.summaryDiscount}`}>
                    <span>Desconto Especial PIX (5%)</span>
                    <span>- R$ {pixDiscount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}

                <div className={styles.summaryTotalRow}>
                  <span>Total Final:</span>
                  <span className={styles.finalPrice}>
                    R$ {finalTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Botão de Finalização */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className={styles.btnConfirmOrder}
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}
                  <span>
                    {isSubmitting
                      ? 'Processando Pedido...'
                      : `Confirmar e Pagar R$ ${finalTotal.toFixed(2).replace('.', ',')}`}
                  </span>
                </button>
                <div className={styles.securityBadge}>
                  <ShieldCheck size={14} color="#10b981" />
                  <span>Ambiente Criptografado & Compra 100% Protegida</span>
                </div>
              </div>
            </div>
          </form>
        ) : (
          /* Tela de Confirmação do Pedido (Order Success) */
          <div className={styles.successCard}>
            <div className={styles.successIconCircle}>
              <CheckCircle2 size={42} />
            </div>
            <h3 className={styles.successTitle}>Pedido Confirmado com Sucesso!</h3>
            <p className={styles.successSubtitle}>
              Obrigado pela sua compra, <strong>{confirmedOrder.buyer.name}</strong>! Enviamos a confirmação e nota fiscal para <strong>{confirmedOrder.buyer.email}</strong>.
            </p>

            <div className={styles.orderCardDetails}>
              <div className={styles.orderDetailItem}>
                <span>Número do Pedido:</span>
                <strong style={{ color: '#10b981' }}>#{confirmedOrder.orderId}</strong>
              </div>
              <div className={styles.orderDetailItem}>
                <span>Data do Pedido:</span>
                <strong>{confirmedOrder.dateFormatted}</strong>
              </div>
              <div className={styles.orderDetailItem}>
                <span>Forma de Pagamento:</span>
                <strong>{confirmedOrder.payment.methodLabel}</strong>
              </div>
              <div className={styles.orderDetailItem}>
                <span>Entrega via:</span>
                <strong>{confirmedOrder.shipping.method} ({confirmedOrder.shipping.days})</strong>
              </div>
              <div className={styles.orderDetailItem}>
                <span>Endereço de Entrega:</span>
                <strong>
                  {confirmedOrder.deliveryAddress.street}, {confirmedOrder.deliveryAddress.number} - {confirmedOrder.deliveryAddress.city}/{confirmedOrder.deliveryAddress.state}
                </strong>
              </div>
              {confirmedOrder.coupon && (
                <div className={styles.orderDetailItem}>
                  <span>Cupom Aplicado:</span>
                  <strong style={{ color: '#10b981' }}>
                    {confirmedOrder.coupon.code} (- R$ {confirmedOrder.coupon.discount.toFixed(2).replace('.', ',')})
                  </strong>
                </div>
              )}
              <div className={styles.orderDetailItem} style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.6rem', marginTop: '0.2rem' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>Valor Total:</span>
                <strong className={styles.orderSuccessTotal}>
                  R$ {confirmedOrder.finalTotal.toFixed(2).replace('.', ',')}
                </strong>
              </div>
            </div>

            <button
              type="button"
              className={styles.btnContinueShopping}
              onClick={() => {
                setConfirmedOrder(null);
                onClose();
              }}
            >
              Continuar Navegando
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
