require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function setupMultiTenant() {
  console.log('====================================================');
  console.log('🚀 INICIANDO PROVISIONAMENTO MULTIBASES (MULTI-TENANT)');
  console.log('====================================================');
  console.log(`Conectando em ${process.env.DB_HOST}:${process.env.DB_PORT}...`);

  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true,
      connectTimeout: 8000
    });
    console.log('✅ Conexão inicial com o servidor MySQL bem-sucedida!');
  } catch (err) {
    console.error('❌ Erro ao conectar ao MySQL:', err.message);
    process.exit(1);
  }

  try {
    // -------------------------------------------------------------
    // PASSO 1: CRIAR E ESTRUTURAR O BANCO CENTRAL (MASTER)
    // -------------------------------------------------------------
    const masterDbName = 'bibliotech_master';
    console.log(`\n📦 1. Configurando Banco Central: "${masterDbName}"...`);
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${masterDbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await conn.changeUser({ database: masterDbName });

    const schemaMasterPath = path.resolve(__dirname, '../../database/schema_master.sql');
    if (fs.existsSync(schemaMasterPath)) {
      const sqlMaster = fs.readFileSync(schemaMasterPath, 'utf8');
      await conn.query(sqlMaster);
      console.log('   ✅ Tabelas criadas no Master: tenants, users, user_tenants, plans');
    }

    // -------------------------------------------------------------
    // PASSO 2: PROVISIONAR TENANT 1 - MATRIZ CENTRAL
    // -------------------------------------------------------------
    const tenantMatrizDb = 'bibliotech_tenant_matriz';
    console.log(`\n🏢 2. Provisionando Tenant Matriz: "${tenantMatrizDb}"...`);
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${tenantMatrizDb}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await conn.changeUser({ database: tenantMatrizDb });

    const schemaTenantPath = path.resolve(__dirname, '../../database/schema_tenant.sql');
    if (fs.existsSync(schemaTenantPath)) {
      const sqlTenant = fs.readFileSync(schemaTenantPath, 'utf8');
      await conn.query(sqlTenant);
      console.log('   ✅ Tabelas criadas no Tenant Matriz: books, community_posts, post_replies, post_reactions, orders, user_preferences');
    }

    // Povoar livros do acervo na Matriz
    const [b1] = await conn.query('SELECT COUNT(*) as count FROM books');
    if (b1[0].count === 0) {
      await conn.query(
        `INSERT INTO books (title, author, genre, rating, reviews_count, price, original_price, discount_percent, stock, badge, format, synopsis, year, pages, status, cover_image, cover_gradient, accent_color)
         VALUES 
         ('Duna', 'Frank Herbert', 'Ficção Científica', 4.9, 1840, 59.90, 89.90, 33, 24, 'Mais Vendido', 'Capa Dura', 'Em um futuro distante, o jovem Paul Atreides governa o inóspito planeta desértico Arrakis.', 1965, 680, 'Disponível', 'https://covers.openlibrary.org/b/id/11149234-L.jpg', 'linear-gradient(135deg, #10b981 0%, #059669 100%)', '#10b981'),
         ('O Senhor dos Anéis: A Sociedade do Anel', 'J.R.R. Tolkien', 'Fantasia', 5.0, 2410, 69.90, 99.90, 30, 18, 'Destaque', 'Edição Especial', 'Frodo Bolseiro herda um anel mágico ancestral e deve destruí-lo na Montanha da Perdição.', 1954, 576, 'Disponível', 'https://covers.openlibrary.org/b/id/14547565-L.jpg', 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #064e3b 100%)', '#34d399'),
         ('1984', 'George Orwell', 'Distopia', 4.8, 3150, 34.90, 49.90, 30, 45, 'Super Oferta', 'Brochura', 'Winston Smith vive sob o olhar implacável do Grande Irmão em uma sociedade de vigilância total.', 1949, 336, 'Disponível', 'https://covers.openlibrary.org/b/id/9267242-L.jpg', 'linear-gradient(135deg, #059669 0%, #047857 50%, #022c22 100%)', '#059669'),
         ('Código Limpo (Clean Code)', 'Robert C. Martin', 'Tecnologia', 4.7, 980, 84.90, 119.00, 28, 12, 'Mais Vendido', 'Brochura Premium', 'Princípios essenciais para desenvolvedores escreverem código legível, elegante e sustentável.', 2008, 464, 'Disponível', 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg', 'linear-gradient(135deg, #10b981 0%, #047857 50%, #064e3b 100%)', '#10b981')`
      );
      console.log('   ✅ 4 Livros inseridos no acervo da Matriz!');
    }

    // -------------------------------------------------------------
    // PASSO 3: PROVISIONAR TENANT 2 - FRANQUIA SÃO PAULO (EXEMPLO)
    // -------------------------------------------------------------
    const tenantSpDb = 'bibliotech_tenant_franquia_sp';
    console.log(`\n🏢 3. Provisionando Segunda Unidade: "${tenantSpDb}"...`);
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${tenantSpDb}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await conn.changeUser({ database: tenantSpDb });

    if (fs.existsSync(schemaTenantPath)) {
      const sqlTenant = fs.readFileSync(schemaTenantPath, 'utf8');
      await conn.query(sqlTenant);
      console.log('   ✅ Tabelas criadas no Tenant Franquia SP');
    }

    // Registra a Franquia SP no Master
    await conn.changeUser({ database: masterDbName });
    await conn.query(
      `INSERT INTO tenants (id, slug, name, cnpj, db_name, status)
       VALUES (2, 'franquia-sp', 'Bibliotech - Franquia São Paulo', '11.222.333/0001-44', 'bibliotech_tenant_franquia_sp', 'active')
       ON DUPLICATE KEY UPDATE name = VALUES(name), db_name = VALUES(db_name)`
    );
    console.log('   ✅ Franquia SP cadastrada no Master com base própria!');

    // -------------------------------------------------------------
    // RESUMO FINAL
    // -------------------------------------------------------------
    console.log('\n====================================================');
    console.log('🎉 ARQUITETURA MULTIBASES PROVISIONADA COM SUCESSO!');
    console.log('Bancos físicos ativos:');
    console.log('  1. bibliotech_master (Usuários globais, SSO, catálogo de Franquias)');
    console.log('  2. bibliotech_tenant_matriz (Base física da Unidade Matriz)');
    console.log('  3. bibliotech_tenant_franquia_sp (Base física da Franquia SP)');
    console.log('====================================================');
  } catch (err) {
    console.error('❌ Erro durante o provisionamento multibases:', err);
  } finally {
    await conn.end();
  }
}

setupMultiTenant();
