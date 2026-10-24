# 🔌 Referência de Endpoints da API RESTful - Bibliotech

A API da Bibliotech opera na porta `5000` (ex: `http://localhost:5000`) e adota o padrão de comunicação JSON com respostas estruturadas via `ApiResponse`.

---

## 📋 Formato Padrão de Resposta

Todas as respostas de sucesso seguem a estrutura:
```json
{
  "success": true,
  "data": { ... },
  "message": "Mensagem descritiva opcional",
  "timestamp": "2026-10-24T00:00:00.000Z"
}
```

Respostas de erro seguem:
```json
{
  "success": false,
  "error": "Descrição clara do erro",
  "statusCode": 400,
  "timestamp": "2026-10-24T00:00:00.000Z"
}
```

---

## 1. Autenticação (`/auth`)

### `POST /auth/login`
Autentica um usuário existente e emite um token JWT de acesso.

- **Corpo da Requisição (Body):**
```json
{
  "email": "patrick@bibliotech.com",
  "password": "admin123"
}
```
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "nome": "Patrick Genovez",
      "email": "patrick@bibliotech.com",
      "tipo": "admin",
      "plano_id": "anual_vip"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login realizado com sucesso!"
}
```

---

## 2. Catálogo de Livros (`/books`)

### `GET /books`
Retorna a lista paginada e filtrada de livros do acervo. Se o banco local estiver vazio, integra dinamicamente com o Open Library para retornar livros reais com capas.

- **Parâmetros de Consulta (Query Params):**
  - `page`: Número da página (padrão: 1)
  - `limit`: Quantidade de itens por página (padrão: 12)
  - `genre`: Filtro por gênero literário (ex: `Ficção Científica`, `Clássicos`, `Romance`)
  - `search`: Termo de busca por título, autor ou palavras-chave
  - `sort`: Critério de ordenação (`sales`, `price-asc`, `price-desc`, `rating`, `title`)

---

## 3. Carrinho de Compras Sincronizado (`/cart`)

Todos os endpoints de carrinho requerem o header:
`Authorization: Bearer <TOKEN_JWT>`

### `GET /cart`
Recupera os itens salvos na conta do usuário autenticado.

### `PUT /cart`
Substitui completamente a sacola do usuário no backend.
- **Body:**
```json
{
  "items": [
    {
      "id": "OL1003017W",
      "title": "Memórias póstumas de Brás Cubas",
      "author": "Machado de Assis",
      "price": 49.90,
      "quantity": 1,
      "coverImage": "https://covers.openlibrary.org/b/id/11149234-M.jpg"
    }
  ]
}
```

### `POST /cart/merge`
Mescla itens que o usuário selecionou antes de logar (armazenados localmente no navegador) com os itens que já estavam na conta dele no servidor, **sem duplicar quantidades** em recarregamentos repetidos.
- **Body:**
```json
{
  "items": [
    {
      "id": "OL1003040W",
      "title": "Dom Casmurro",
      "author": "Machado de Assis",
      "price": 39.90,
      "quantity": 1
    }
  ]
}
```

### `DELETE /cart`
Esvazia a sacola do usuário após a conclusão de uma compra.

---

## 4. Checkout, Cupons e Frete (`/checkout`)

### `POST /checkout/coupons/validate`
Valida se um cupom promocional existe, se atinge o valor mínimo de compra e calcula o valor do desconto.

- **Body:**
```json
{
  "code": "CLUBE20",
  "subtotal": 100.00
}
```
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "code": "CLUBE20",
    "type": "percentage",
    "value": 20,
    "discountAmount": 20.00,
    "newSubtotal": 80.00,
    "description": "20% de desconto para membros do clube",
    "isShippingFree": false
  },
  "message": "Cupom aplicado com sucesso!"
}
```

### `GET /checkout/coupons`
Lista todos os cupons ativos no sistema para campanhas e chips de sugestão rápida.

### `POST /checkout/shipping/calculate`
Calcula as opções de frete (PAC e SEDEX) consultando o ViaCEP e aplicando as tabelas de prazos e valores regionais.

- **Body:**
```json
{
  "cep": "01001-000",
  "subtotal": 120.00,
  "couponCode": "CLUBE20"
}
```
- **Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "data": {
    "cep": "01001000",
    "formattedCep": "01001-000",
    "address": {
      "street": "Praça da Sé",
      "neighborhood": "Sé",
      "city": "São Paulo",
      "state": "SP"
    },
    "regionName": "São Paulo (Capital)",
    "freeShippingThreshold": 99.00,
    "qualifiesForFreeShipping": true,
    "options": [
      {
        "id": "pac",
        "name": "PAC Econômico",
        "price": 0.00,
        "formattedPrice": "GRÁTIS",
        "estimatedDays": 3,
        "estimatedDeliveryText": "Até 3 dias úteis",
        "isFree": true
      },
      {
        "id": "sedex",
        "name": "SEDEX Expresso",
        "price": 19.90,
        "formattedPrice": "R$ 19,90",
        "estimatedDays": 1,
        "estimatedDeliveryText": "Em até 1 dia útil",
        "isFree": false
      }
    ]
  }
}
```

### `GET /checkout/shipping/cep/:cep`
Consulta rápida de endereço dos Correios via API ViaCEP com tratamento resiliente contra timeouts.
