# 📚 Documentação Oficial - Bibliotech

Bem-vindo ao centro de documentações técnicas e operacionais da **Bibliotech**, a plataforma moderna de livraria online e clube literário inteligente.

---

## 🗂️ Índice das Documentações

| Documento | Descrição |
| :--- | :--- |
| 🏗️ [**Arquitetura do Sistema**](ARQUITETURA.md) | Padrão Clean Architecture, separação de camadas (Routes, Controllers, Services), Multi-tenant resiliente e Design System do Frontend. |
| 🔌 [**Referência de API (Endpoints)**](API_ENDPOINTS.md) | Especificação completa de todas as rotas REST (`/auth`, `/books`, `/cart`, `/checkout`, `/tenants`), payloads e headers. |
| 🛒 [**Carrinho, Frete & Checkout (Sprint 4)**](CHECKOUT_E_CARRINHO.md) | Funcionamento da persistência local/nuvem do carrinho, cálculo de frete ViaCEP, regras de cupons e fluxo do Checkout Modal. |
| 💾 [**Estrutura do Banco de Dados**](ESTRUTURA_BANCO_DE_DADOS.md) | Modelagem relacional sugerida, tabelas (`users`, `books`, `orders`, `tenants`) e diagrama ER para implementação do banco. |

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
- **Node.js**: v18.0.0 ou superior
- **Gerenciador de Pacotes**: npm ou yarn

### 2. Inicializando o Backend
```bash
cd backend
npm install
npm run dev
```
- Servidor HTTP disponível em: `http://localhost:5000`
- Monitoramento de código com `nodemon` (ignora arquivos de dados e JSON em `data/` via `backend/nodemon.json`).

### 3. Inicializando o Frontend
```bash
cd frontend
npm install
npm run dev
```
- Aplicação Next.js disponível em: `http://localhost:3000`
- Catálogo de Livros: `http://localhost:3000/catalogo`
- Canal da Comunidade & Clube: `http://localhost:3000/comunidade`
- Login & Cadastro: `http://localhost:3000/login`

---

## 🔐 Credenciais de Demonstração

Para testes de autenticação e funcionalidades exclusivas de membros do clube:

| Papel | E-mail | Senha | Benefícios |
| :--- | :--- | :--- | :--- |
| **Administrador / Membro Clube** | `patrick@bibliotech.com` | `admin123` | Desconto de 20% com cupom `CLUBE20`, acesso total |
| **Leitor Cadastrado** | `mariana@leitora.com` | `leitora123` | Sincronização de sacola na nuvem |
