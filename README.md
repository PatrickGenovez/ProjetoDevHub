# 📚 Bibliotech - Plataforma Fullstack de Livraria & Clube Literário

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Clean Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-orange?style=for-the-badge)

Bem-vindo ao repositório do **Bibliotech**, um ecossistema completo de livraria online e comunidade de leitores, construído com **Next.js**, **Node.js/Express**, Clean Architecture e design premium em Glassmorphism.

---

## 📖 Documentação Completa

Todas as especificações técnicas, guias de arquitetura, referências de API e modelagem do banco de dados estão organizadas na pasta [`docs/`](docs/README.md):

- 📑 [**Índice de Documentações**](docs/README.md)
- 🏗️ [**Arquitetura do Sistema & Clean Architecture**](docs/ARQUITETURA.md)
- 🔌 [**Referência de Endpoints da API REST**](docs/API_ENDPOINTS.md)
- 🛒 [**Carrinho, Frete ViaCEP e Checkout (Sprint 4)**](docs/CHECKOUT_E_CARRINHO.md)
- 💾 [**Estrutura & Modelagem do Banco de Dados**](docs/ESTRUTURA_BANCO_DE_DADOS.md)

---

## ⚡ Inicialização Rápida

### Pré-requisitos
- **Node.js** (v18 ou superior)
- **NPM** ou gerenciador equivalente
- Banco de dados (MySQL ou PostgreSQL) configurado

---

### 1. Backend (API REST - Porta 5000)

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Configure o arquivo de variáveis de ambiente a partir do exemplo
cp ex.env .env
# (Abra o arquivo .env e preencha suas credenciais de banco e JWT)

# Execute o setup e migração do banco de dados
npm run db:setup

# Inicie o servidor em modo de desenvolvimento
npm run dev
```

> 📡 **API rodando em:** [http://localhost:5000](http://localhost:5000)

---

### 2. Frontend (Next.js - Porta 3000)

```bash
# Em outro terminal, entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp ex.env .env

# Inicie o servidor de desenvolvimento
npm run dev
```

> 🌐 **Aplicação web disponível em:** [http://localhost:3000](http://localhost:3000)
