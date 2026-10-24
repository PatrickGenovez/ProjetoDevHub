# 🛒 Carrinho de Compras, Frete & Fluxo de Checkout (Sprint 4)

Este documento detalha o funcionamento técnico e as regras de negócio implementadas na **Sprint 4** da plataforma Bibliotech.

---

## 1. Persistência do Carrinho de Compras

A sacola de compras adota uma estratégia de **persistência híbrida**:

1. **Visitante Não Autenticado:**
   - Itens são gravados localmente no `localStorage` sob a chave `bibliotech_cart`.
   - Permite navegação livre sem forçar o login prévio para adicionar itens.
2. **Usuário Autenticado:**
   - Ao fazer login ou carregar a página com sessão ativa, os itens são salvos também sob a chave isolada `bibliotech_cart_{userKey}`.
   - O frontend sincroniza com o backend através de `POST /cart/merge`.

### Regra de Não-Duplicação (Smart Merge & Idempotência)
No passado, recarregamentos sucessivos causavam a soma de itens já presentes na sacola (`quantity = quantity + incoming`). Essa lógica foi refatorada em [`cartService.js`](file:///c:/Users/Elza-002/Desktop/modelo/backend/src/services/cartService.js):

- Ao mesclar itens locais com o servidor, se o item já existe na conta, o sistema adota `Math.max(existing.quantity, incoming.quantity)`.
- Isso garante **idempotência estrita**: o usuário pode recarregar a página infinitas vezes sem que as quantidades se multipliquem.
- Foi implementada também uma camada de sanitização no frontend que limita a quantidade máxima por livro em 20 unidades, impedindo dados corrompidos.

---

## 2. Cálculo de Frete por CEP com ViaCEP

O serviço de frete em [`shippingService.js`](file:///c:/Users/Elza-002/Desktop/modelo/backend/src/services/shippingService.js) é responsável por:

1. **Validação e Formatação de CEP:** Garante 8 dígitos numéricos e aplica máscara `00000-000`.
2. **Consulta Externa ViaCEP:** Busca rua, bairro, cidade e estado em `https://viacep.com.br/ws/${cep}/json/` com timeout resiliente de 3.5 segundos. Se a API externa falhar, aplica modo fallback e não bloqueia a compra.
3. **Cálculo de Tarifas e Prazos Regionais:**
   - **PAC Econômico**: Entrega padrão com custo acessível.
   - **SEDEX Expresso**: Entrega prioritária de 1 a 3 dias úteis.
4. **Regra de Frete Grátis:**
   - Compras com subtotal a partir de **R$ 99,00** recebem automaticamente **PAC GRÁTIS** (tarifa zerada).
   - O uso do cupom `FRETEGRATIS` também zera a tarifa de envio.

---

## 3. Sistema de Cupons de Desconto

Gerenciado por [`couponService.js`](file:///c:/Users/Elza-002/Desktop/modelo/backend/src/services/couponService.js), suporta três categorias de benefícios:

| Código | Tipo | Valor | Regra / Mínimo | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| **`CLUBE20`** | Percentual | **20% OFF** | Subtotal mín. R$ 40,00 | Exclusivo para assinantes do Clube |
| **`BEMVINDO10`** | Percentual | **10% OFF** | Subtotal mín. R$ 30,00 | Cupom para a primeira compra |
| **`LEITOR15`** | Fixo | **R$ 15,00 OFF**| Subtotal mín. R$ 60,00 | Desconto direto no valor dos livros |
| **`FRETEGRATIS`**| Envio | **100% OFF Frete**| Subtotal mín. R$ 50,00 | Isenta o valor do frete PAC |
| **`BIBLIO50`** | Percentual | **50% OFF** | Subtotal mín. R$ 80,00 (Teto: R$ 50) | Cupom especial limitado |

O modal disponibiliza botões tipo **chips** que permitem testar e aplicar os cupons principais com apenas um clique.

---

## 4. O Componente de Checkout (`CheckoutModal.js`)

Localizado em [`frontend/components/checkout/CheckoutModal.js`](file:///c:/Users/Elza-002/Desktop/modelo/frontend/components/checkout/CheckoutModal.js) e estilizado em [`CheckoutModal.module.css`](file:///c:/Users/Elza-002/Desktop/modelo/frontend/components/checkout/CheckoutModal.module.css):

### Estrutura em Duas Colunas (Desktop)
- **Coluna Esquerda:**
  1. *Endereço & Frete*: Input de CEP com busca automática, endereço localizado em destaque, número e complemento, e seleção visual entre PAC e SEDEX.
  2. *Cupom*: Input com validação contra a API backend e tags de sugestão.
  3. *Forma de Pagamento*: Seleção entre PIX (com aviso visual de 5% de desconto extra), Cartão de Crédito (com simulador de até 6x sem juros) e Boleto.
- **Coluna Direita:**
  1. *Dados do Comprador*: Nome completo e e-mail (autopreenchidos se o usuário estiver logado).
  2. *Resumo dos Livros*: Lista com miniaturas de capa, título, quantidade e valor unitário.
  3. *Detalhamento Financeiro*: Subtotal, Desconto do Cupom, Frete, Desconto PIX e Total Final em verde esmeralda.
  4. *Botão de Ação*: Finalização com ícone de segurança e badge de ambiente criptografado.

### Tela de Confirmação (Sucesso)
Ao confirmar a compra, a tela apresenta:
- Código oficial do pedido (`#BLT-2026-XXXX`).
- Endereço de entrega confirmado e prazo do método escolhido.
- Meio de pagamento selecionado e valor total pago.
- Esvaziamento automático da sacola de compras.
