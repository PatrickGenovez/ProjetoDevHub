/**
 * Servidor Backend - Bibliotech (Multi-Tenant & E-Commerce)
 * Padrão Clean Code & Clean Architecture
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const { CONFIG } = require('./config/constants');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// 1. Middlewares Globais de Infraestrutura
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 2. Registro de Rotas da Aplicação
app.use(routes);

// 3. Middlewares de Tratamento de 404 e Erros Globais
app.use(notFoundHandler);
app.use(errorHandler);

// 4. Inicialização do Servidor HTTP
const PORT = CONFIG.PORT;

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`✨ [Bibliotech API] Servidor rodando com sucesso na porta ${PORT}`);
    console.log(`👉 Ambiente: ${CONFIG.NODE_ENV}`);
    console.log(`👉 Documentação/Health: http://localhost:${PORT}/`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Porta ${PORT} em uso. Tentando alocação automática de porta livre...`);
      const fallbackServer = app.listen(0, () => {
        const freePort = fallbackServer.address().port;
        console.log(`✨ [Bibliotech API] Servidor alocado na porta alternativa ${freePort}`);
      });
    } else {
      console.error('❌ Falha crítica ao iniciar servidor:', err);
    }
  });
}

module.exports = app;
