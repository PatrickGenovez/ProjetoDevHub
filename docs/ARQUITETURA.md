# 🏗️ Arquitetura do Sistema - Bibliotech

Este documento descreve a estrutura de engenharia de software adotada na plataforma **Bibliotech**, garantindo manutenibilidade, separação de responsabilidades e alta escalabilidade.

---

## 1. Visão Geral da Arquitetura

O sistema é construído como uma aplicação Fullstack moderna desacoplada:

```
┌─────────────────────────────────────────────────────────────┐
│                       FRONTEND                              │
│  Next.js (React) • CSS Modules • Glassmorphism Design       │
│  - / (Landing Page & Vitrine)                               │
│  - /catalogo (Catálogo Dinâmico & Busca)                    │
│  - /comunidade (Clube de Leitores & Feed)                   │
│  - /login (Autenticação JWT)                                │
│  - CheckoutModal (Frete ViaCEP, Cupons, Resumo de Pedido)   │
└──────────────────────────────┬──────────────────────────────┘
                               │  JSON / HTTP REST
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                              │
│  Node.js • Express • Clean Architecture                     │
│                                                             │
│  [Middlewares] (Auth JWT, Tenant, Error Handler)            │
│         │                                                   │
│         ▼                                                   │
│  [Routes Layer] (/auth, /books, /cart, /checkout, /tenants) │
│         │                                                   │
│         ▼                                                   │
│  [Controllers Layer] (Validação HTTP & Formatação)          │
│         │                                                   │
│         ▼                                                   │
│  [Services Layer] (Regras de Negócio Puras)                 │
│         │                                                   │
│         ▼                                                   │
│  [Data Layer] (MySQL Pools / JSON Storage / Open Library)   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Padrão Clean Architecture no Backend

Para evitar acoplamento excessivo e código macarrônico, o backend adota a separação estrita em três camadas principais:

### Camada 1: Rotas (`backend/src/routes/`)
- Responsável única e exclusivamente por registrar as rotas HTTP e direcionar a requisição ao método correspondente do Controller.
- Exemplo: [`checkout.js`](file:///c:/Users/Elza-002/Desktop/modelo/backend/src/routes/checkout.js), [`cart.js`](file:///c:/Users/Elza-002/Desktop/modelo/backend/src/routes/cart.js).

### Camada 2: Controllers (`backend/src/controllers/`)
- Extrai parâmetros de `req.body`, `req.params`, `req.query` e `req.user`.
- Valida tipos e presença de campos obrigatórios.
- Invoca o Service responsável.
- Retorna respostas padronizadas utilizando a classe utilitária `ApiResponse` (`ApiResponse.success`, `ApiResponse.badRequest`, etc.).
- Não contém regras de negócio ou cálculos matemáticos diretos.

### Camada 3: Services (`backend/src/services/`)
- Contém a **lógica de negócio pura** e isolada do protocolo HTTP.
- Exemplos:
  - `shippingService.js`: Consulta a API ViaCEP, calcula distâncias regionais e tarifas PAC/SEDEX, avalia limites de frete grátis.
  - `couponService.js`: Valida elegibilidade, tipo de desconto (porcentagem ou fixo) e valores mínimos.
  - `cartService.js`: Gerencia a persistência de carrinhos, mesclagem inteligente e isolamento por usuário.
  - `externalBooksService.js`: Faz cache e consome a API do Open Library para enriquecer o catálogo com títulos reais e capas de alta qualidade.

---

## 3. Multi-Tenant Resiliente com Modo Offline

A Bibliotech suporta arquitetura Multi-Tenant isolada por banco de dados através do [`tenantMiddleware.js`](file:///c:/Users/Elza-002/Desktop/modelo/backend/src/middlewares/tenantMiddleware.js):

1. **Extração de Tenant**: Identifica o tenant ativo através do header `X-Tenant-Slug`, query param `?tenant=` ou token JWT.
2. **Pool Dinâmico**: O [`tenantManager.js`](file:///c:/Users/Elza-002/Desktop/modelo/backend/src/config/tenantManager.js) mantém um cache de conexões MySQL separadas por cliente/franquia.
3. **Modo Resiliente Offline**: Caso o servidor de banco de dados MySQL ainda não esteja configurado ou passe por instabilidade, o middleware intercepta o erro de conexão graciosamente, injeta um tenant padrão (`matriz`) e permite que a aplicação continue operando sem travar requisições que independem de banco físico.

---

## 4. Persistência de Dados e Prevenção de Loops no Nodemon

- Os dados de sessão rápida (como carrinhos e usuários de teste) são persistidos na pasta `backend/data/`.
- **Configuração do Nodemon ([`backend/nodemon.json`](file:///c:/Users/Elza-002/Desktop/modelo/backend/nodemon.json))**:
  Para evitar reinicializações indesejadas do servidor toda vez que um cliente adiciona ou remove um livro da sacola, o `nodemon` foi configurado para monitorar estritamente o código fonte em `src/` e ignorar `data/**` e arquivos `.json`.

---

## 5. Arquitetura do Frontend (Next.js)

### Design System & Estética
- **Glassmorphism & Dark Mode**: Interfaces translúcidas com `backdrop-filter: blur(16px)`, bordas sutis (`rgba(255, 255, 255, 0.08)`) e paleta inspirada em esmeralda (`#10b981`), ardósia (`#0f172a`, `#1e293b`) e texto de alto contraste.
- **Componentes Reutilizáveis**:
  - `AuroraBackground`: Efeito dinâmico de iluminação no fundo da aplicação.
  - `ThemeToggle`: Alternância de tema escuro/claro com persistência.
  - `CheckoutModal`: Modal completo de finalização de compras, frete e cupons.
  - `RelevantBooksCarousel`: Carrossel de destaques literários.

### Estratégia de Estado & Sincronização Híbrida
- Os itens da sacola de compras são mantidos no `localStorage` sob a chave `bibliotech_cart`.
- Quando um leitor faz login, a sacola local é associada ao seu identificador (`bibliotech_cart_{userKey}`) e sincronizada via API com o backend (`POST /cart/merge`), permitindo que o usuário recupere seus livros em qualquer dispositivo sem duplicar quantidades.
