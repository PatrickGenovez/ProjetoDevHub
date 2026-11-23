require('dotenv').config();
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const { CONFIG } = require('./constants');
const { INITIAL_BOOKS } = require('../data/initialBooks');

// Cache de pools para conexões dinâmicas por tenant
const tenantPools = new Map();
let masterPool = null;

const MASTER_DB_NAME = CONFIG.MASTER_DB_NAME;

/**
 * Obtém ou inicializa o pool de conexão com o Banco Central (Master)
 */
function getMasterPool() {
  if (!masterPool) {
    masterPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: MASTER_DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      multipleStatements: true
    }).promise();
  }
  return masterPool;
}

/**
 * Obtém ou cria dinamicamente o pool de conexão para a base de um tenant específico
 * @param {string|number} slugOrId - Slug (ex: 'matriz') ou ID do tenant
 */
async function getTenantPool(slugOrId) {
  const master = getMasterPool();

  // 1. Busca os metadados do tenant no banco Master
  let query = 'SELECT * FROM tenants WHERE slug = ? AND status = "active" LIMIT 1';
  if (typeof slugOrId === 'number' || (!isNaN(slugOrId) && !isNaN(parseFloat(slugOrId)))) {
    query = 'SELECT * FROM tenants WHERE (id = ? OR slug = ?) AND status = "active" LIMIT 1';
  }

  const [rows] = await master.query(query, [slugOrId, String(slugOrId)]);
  if (!rows || rows.length === 0) {
    // Fallback: se não achar, tenta buscar o tenant matriz padrão
    if (slugOrId !== 'matriz') {
      return getTenantPool('matriz');
    }
    throw new Error(`Tenant "${slugOrId}" não encontrado ou inativo.`);
  }

  const tenant = rows[0];
  const dbName = tenant.db_name;

  // 2. Se já existir pool em cache para essa base, reaproveita
  if (tenantPools.has(dbName)) {
    return {
      pool: tenantPools.get(dbName),
      tenant
    };
  }

  // 3. Cria novo pool exclusivo para a base física desta empresa/franquia
  const pool = mysql.createPool({
    host: tenant.db_host || process.env.DB_HOST || 'localhost',
    port: Number(tenant.db_port || process.env.DB_PORT) || 3306,
    user: tenant.db_user || process.env.DB_USER || 'root',
    password: tenant.db_password || process.env.DB_PASSWORD || '',
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
  }).promise();

  tenantPools.set(dbName, pool);

  return {
    pool,
    tenant
  };
}

/**
 * Provisiona uma nova base de dados física completa para um novo tenant/empresa
 * @param {Object} tenantData - { name, slug, cnpj }
 */
async function provisionTenant({ name, slug, cnpj = '' }) {
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const dbName = `bibliotech_tenant_${cleanSlug.replace(/-/g, '_')}`;
  const master = getMasterPool();

  // 1. Cria ou atualiza o registro no Master
  await master.query(
    `INSERT INTO tenants (slug, name, cnpj, db_name, status)
     VALUES (?, ?, ?, ?, 'active')
     ON DUPLICATE KEY UPDATE name = VALUES(name), db_name = VALUES(db_name), status = 'active'`,
    [cleanSlug, name, cnpj, dbName]
  );

  // 2. Cria o banco de dados físico no MySQL
  await master.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);

  // 3. Conecta ao novo banco para executar o schema do tenant
  const tenantConn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: dbName,
    multipleStatements: true
  }).promise();

  const tenantSchemaPath = path.resolve(__dirname, '../../database/schema_tenant.sql');
  if (fs.existsSync(tenantSchemaPath)) {
    const schemaSql = fs.readFileSync(tenantSchemaPath, 'utf8');
    await tenantConn.query(schemaSql);
  }

  // 4. Copia ou semeia o acervo inicial de livros para este novo tenant se estiver vazio
  const [bRows] = await tenantConn.query('SELECT COUNT(*) as count FROM books');
  if (bRows[0].count === 0) {
    for (const b of INITIAL_BOOKS) {
      await tenantConn.query(
        `INSERT INTO books (title, author, genre, rating, reviews_count, price, original_price, discount_percent, stock, badge, format, synopsis, year, pages, status, cover_image, cover_gradient, accent_color)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Disponível', ?, ?, ?)`,
        [
          b.title, b.author, b.genre, b.rating, b.reviewsCount, b.price,
          b.originalPrice, b.discountPercent, b.stock, b.badge, b.format,
          b.synopsis, b.year, b.pages, b.coverImage, b.coverGradient, b.accentColor
        ]
      );
    }
  }

  await tenantConn.end();

  // Limpa o cache para que o novo pool seja criado sob demanda
  tenantPools.delete(dbName);

  const [tRow] = await master.query('SELECT * FROM tenants WHERE slug = ?', [cleanSlug]);
  return tRow[0];
}

/**
 * Lista todos os tenants ativos no Master
 */
async function listTenants() {
  const master = getMasterPool();
  const [rows] = await master.query('SELECT id, slug, name, cnpj, db_name, status, created_at FROM tenants WHERE status = "active" ORDER BY id ASC');
  return rows;
}

module.exports = {
  getMasterPool,
  getTenantPool,
  provisionTenant,
  listTenants,
  MASTER_DB_NAME
};
