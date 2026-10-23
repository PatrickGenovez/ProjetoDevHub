const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

function generateDatabaseStudyPDF(outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 40, bottom: 45, left: 45, right: 45 },
      info: {
        Title: 'Estudo de Modelagem e Arquitetura do Banco de Dados - Bibliotech',
        Author: 'Bibliotech Architecture Team',
        Subject: 'Especificação Técnica do Banco de Dados Relacional',
        Keywords: 'MySQL, Modelagem, Banco de Dados, Bibliotech, DER, Schema'
      },
      bufferPages: true // Permite numeração "Página X de Y" no final
    });

    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    const colors = {
      primary: '#7a1919',       // Vinho clássico / Carmesim Bibliotech
      primaryDark: '#500f0f',   // Vinho profundo
      gold: '#b8860b',          // Ouro nobre
      goldLight: '#e9d7aa',     // Ouro suave para badges
      dark: '#1c1917',          // Texto principal escuro
      muted: '#57534e',         // Texto secundário / descrições
      cardBg: '#faf8f5',        // Fundo pergaminho suave
      border: '#e4dcce',        // Linha e contorno suave
      tagBg: '#f2ede4',         // Fundo de tags/pills
      typeColor: '#0369a1',     // Azul para tipos de dados SQL
      pkColor: '#b45309',       // Âmbar para PK
      fkColor: '#047857',       // Verde esmeralda para FK
      white: '#ffffff'
    };

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const contentWidth = pageWidth - doc.page.margins.left - doc.page.margins.right;
    const leftMargin = doc.page.margins.left;
    const bottomLimit = pageHeight - doc.page.margins.bottom - 20;

    let y = doc.page.margins.top;

    // Helper para verificar espaço na página
    function ensureSpace(heightNeeded) {
      if (y + heightNeeded > bottomLimit) {
        doc.addPage();
        y = doc.page.margins.top + 15;
        drawRunningHeader();
      }
    }

    // Cabeçalho discreto no topo de páginas subsequentes
    function drawRunningHeader() {
      doc.save();
      doc.fontSize(8).font('Helvetica-Bold').fillColor(colors.gold)
        .text('BIBLIOTECH', leftMargin, y - 20, { continued: true })
        .font('Helvetica').fillColor(colors.muted)
        .text('  •  Estudo de Modelagem e Estrutura do Banco de Dados Relacional', { align: 'left' });
      doc.rect(leftMargin, y - 10, contentWidth, 0.5).fill(colors.border);
      doc.restore();
    }

    // ==========================================
    // CAPA / HEADER PRINCIPAL
    // ==========================================
    doc.rect(leftMargin, y, contentWidth, 90).fillAndStroke(colors.cardBg, colors.gold);
    
    // Tarja decorativa esquerda
    doc.rect(leftMargin, y, 6, 90).fill(colors.primary);

    doc.fillColor(colors.primary)
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('BIBLIOTECH • LIVRARIA & CLUBE LITERÁRIO', leftMargin + 20, y + 16);

    doc.fillColor(colors.gold)
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('ESTUDO DE MODELAGEM E ARQUITETURA DO BANCO DE DADOS', leftMargin + 20, y + 38);

    doc.fillColor(colors.muted)
      .fontSize(9)
      .font('Helvetica')
      .text('Documento de especificação técnica, regras de integridade, dicionário de dados e roadmap de implementação.', leftMargin + 20, y + 56, { width: contentWidth - 30 });

    doc.fontSize(8)
      .font('Helvetica-Oblique')
      .fillColor(colors.primaryDark)
      .text('Status: Aprovado para Estudo & Implementação  |  SGBD Alvo: MySQL 8.x / PostgreSQL  |  Versão: 1.0', leftMargin + 20, y + 74);

    y += 105;

    // ==========================================
    // SEÇÃO 1: VISÃO GERAL & PRINCÍPIOS
    // ==========================================
    doc.rect(leftMargin, y, contentWidth, 24).fill(colors.primary);
    doc.fillColor(colors.white).fontSize(10).font('Helvetica-Bold').text('1. VISÃO GERAL E DIRETRIZES DA MODELAGEM', leftMargin + 10, y + 7);
    y += 32;

    doc.fillColor(colors.dark).fontSize(9).font('Helvetica').lineGap(3).text(
      'O presente estudo estabelece a fundação de dados para suportar a plataforma Bibliotech em produção. ' +
      'A arquitetura foi projetada para garantir alta performance de leitura no catálogo, consistência transacional rígida ' +
      'nas compras/estoque, proteção de histórico de faturamento e engajamento dinâmico no Salão Literário (Comunidade).',
      leftMargin, y, { width: contentWidth, align: 'justify' }
    );
    y += 38;

    // 4 Pilares em caixas
    const pilarWidth = (contentWidth - 15) / 2;
    const pilares = [
      { title: 'Normalização 3FN Balanceada', desc: 'Elimina redundâncias e anomalias de atualização em usuários, pedidos e itens de venda.' },
      { title: 'Preservação Histórica (Snapshot)', desc: 'Preços de livros e dados de entrega são gravados no pedido, protegendo auditorias.' },
      { title: 'Integridade Referencial Forte', desc: 'Chaves estrangeiras com regras explícitas (CASCADE em comentários/reações, RESTRICT em pedidos).' },
      { title: 'Otimização de Consultas (Índices)', desc: 'Índices dedicados para buscas rápidas por autor, título, e-mail de login e slug de canais.' }
    ];

    pilares.forEach((p, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const px = leftMargin + (col * (pilarWidth + 15));
      const py = y + (row * 44);

      doc.rect(px, py, pilarWidth, 38).fillAndStroke(colors.cardBg, colors.border);
      doc.rect(px, py, 3, 38).fill(colors.gold);
      doc.fillColor(colors.primary).fontSize(8.5).font('Helvetica-Bold').text(p.title, px + 8, py + 6);
      doc.fillColor(colors.muted).fontSize(7.5).font('Helvetica').text(p.desc, px + 8, py + 18, { width: pilarWidth - 14 });
    });

    y += 98;

    // ==========================================
    // SEÇÃO 2: ARQUITETURA MULTI-TENANCY
    // ==========================================
    ensureSpace(120);
    doc.rect(leftMargin, y, contentWidth, 24).fill(colors.primary);
    doc.fillColor(colors.white).fontSize(10).font('Helvetica-Bold').text('2. DECISÃO ARQUITETURAL: MULTI-TENANCY & FRANQUIAS', leftMargin + 10, y + 7);
    y += 32;

    doc.fillColor(colors.dark).fontSize(9).font('Helvetica').lineGap(2.5).text(
      'O sistema prevê suporte à expansão da livraria física para filiais/franquias. Foram analisados dois modelos técnicos:',
      leftMargin, y, { width: contentWidth }
    );
    y += 20;

    // Caixa Comparativa
    const boxW = (contentWidth - 10) / 2;
    
    // Opção A
    doc.rect(leftMargin, y, boxW, 80).fillAndStroke('#f0fdf4', '#86efac');
    doc.fillColor('#166534').fontSize(8.5).font('Helvetica-Bold').text('RECOMENDADO: Banco Único + tenant_id', leftMargin + 8, y + 8);
    doc.fillColor('#14532d').fontSize(7.5).font('Helvetica').lineGap(2).text(
      '• Todas as lojas operam no mesmo banco com coluna tenant_id indexada.\n' +
      '• Migrações e manutenções ocorrem em uma única operação.\n' +
      '• Relatórios consolidados da rede inteira com queries simples.\n' +
      '• Menor consumo de conexões e custo de hospedagem reduzido.',
      leftMargin + 8, y + 22, { width: boxW - 16 }
    );

    // Opção B
    doc.rect(leftMargin + boxW + 10, y, boxW, 80).fillAndStroke('#fff7ed', '#fdba74');
    doc.fillColor('#9a3412').fontSize(8.5).font('Helvetica-Bold').text('ALTERNATIVA: Database-per-tenant', leftMargin + boxW + 18, y + 8);
    doc.fillColor('#7c2d12').fontSize(7.5).font('Helvetica').lineGap(2).text(
      '• Um banco físico individual para cada filial (ex: tenant_sp, matriz).\n' +
      '• Isolamento físico rígido entre franquias.\n' +
      '• Alta complexidade: precisa migrar N bancos a cada novo deploy.\n' +
      '• Pool dinâmico de conexões exige mais memória e monitoramento.',
      leftMargin + boxW + 18, y + 22, { width: boxW - 16 }
    );

    y += 92;

    // Conclusão
    doc.rect(leftMargin, y, contentWidth, 22).fillAndStroke(colors.cardBg, colors.gold);
    doc.fillColor(colors.primaryDark).fontSize(8).font('Helvetica-Bold')
      .text('Decisão Técnica: ', leftMargin + 8, y + 6, { continued: true })
      .font('Helvetica').fillColor(colors.dark)
      .text('Iniciar com a loja matriz consolidada, já estruturando as tabelas preparadas para segregação lógica.');
    
    y += 35;

    // ==========================================
    // SEÇÃO 3: DICIONÁRIO DE DADOS COMPLETO
    // ==========================================
    ensureSpace(140);
    doc.rect(leftMargin, y, contentWidth, 24).fill(colors.primary);
    doc.fillColor(colors.white).fontSize(10).font('Helvetica-Bold').text('3. DICIONÁRIO DE DADOS & ESPECIFICAÇÃO DE TABELAS', leftMargin + 10, y + 7);
    y += 32;

    // Função para desenhar uma tabela estilizada
    function renderTableCard({ tableName, moduleName, description, columns }) {
      const estimatedHeight = 52 + (columns.length * 16.5);
      ensureSpace(estimatedHeight + 10);

      // Card container
      doc.rect(leftMargin, y, contentWidth, estimatedHeight).fillAndStroke(colors.cardBg, colors.border);

      // Top bar
      doc.rect(leftMargin, y, contentWidth, 22).fill(colors.tagBg);
      doc.fillColor(colors.primary).fontSize(9.5).font('Helvetica-Bold').text(tableName, leftMargin + 8, y + 6, { continued: true });
      doc.fillColor(colors.muted).fontSize(8).font('Helvetica').text(`  [Módulo: ${moduleName}]`);

      // Descrição
      doc.fillColor(colors.dark).fontSize(7.5).font('Helvetica-Oblique').text(description, leftMargin + 8, y + 26, { width: contentWidth - 16 });

      // Cabeçalho da tabela de campos
      const tableHeadY = y + 38;
      doc.rect(leftMargin, tableHeadY, contentWidth, 14).fill('#eae4d7');
      doc.fillColor(colors.primaryDark).fontSize(7).font('Helvetica-Bold');
      doc.text('CAMPO', leftMargin + 8, tableHeadY + 4);
      doc.text('TIPO SQL', leftMargin + 140, tableHeadY + 4);
      doc.text('CHAVES / REGRAS', leftMargin + 250, tableHeadY + 4);
      doc.text('DESCRIÇÃO / FINALIDADE', leftMargin + 360, tableHeadY + 4);

      let rowY = tableHeadY + 15;
      columns.forEach((col, idx) => {
        if (idx % 2 === 1) {
          doc.rect(leftMargin, rowY - 1, contentWidth, 15).fill('#f5f1e8');
        }

        // Nome do campo
        doc.fillColor(colors.dark).fontSize(7.5).font('Helvetica-Bold').text(col.name, leftMargin + 8, rowY + 3);

        // Tipo SQL
        doc.fillColor(colors.typeColor).fontSize(7).font('Courier-Bold').text(col.type, leftMargin + 140, rowY + 3);

        // Chave/Regra
        let ruleColor = colors.muted;
        if (col.rule.includes('PK')) ruleColor = colors.pkColor;
        else if (col.rule.includes('FK')) ruleColor = colors.fkColor;
        doc.fillColor(ruleColor).fontSize(7).font('Helvetica-Bold').text(col.rule, leftMargin + 250, rowY + 3);

        // Descrição
        doc.fillColor(colors.dark).fontSize(7).font('Helvetica').text(col.desc, leftMargin + 360, rowY + 3, { width: contentWidth - 365, lineBreak: false });

        rowY += 15.5;
      });

      y += estimatedHeight + 12;
    }

    // 1. Tabela USERS
    renderTableCard({
      tableName: 'users',
      moduleName: 'Identidade & Acesso',
      description: 'Armazena as contas de leitores, administradores e moderadores da plataforma.',
      columns: [
        { name: 'id', type: 'INT AUTO_INC', rule: 'PRIMARY KEY', desc: 'Identificador único do usuário' },
        { name: 'email', type: 'VARCHAR(191)', rule: 'UNIQUE, NOT NULL, INDEX', desc: 'E-mail para login e notificações' },
        { name: 'full_name', type: 'VARCHAR(191)', rule: 'NOT NULL', desc: 'Nome completo do leitor' },
        { name: 'password_hash', type: 'VARCHAR(255)', rule: 'NOT NULL', desc: 'Hash criptográfico (Bcrypt)' },
        { name: 'role', type: 'ENUM(...)', rule: "DEFAULT 'user'", desc: "'user', 'admin', 'moderator'" },
        { name: 'plano_id', type: 'VARCHAR(50)', rule: "FK -> plans(id)", desc: "Plano do clube ativo no momento" },
        { name: 'avatar_url', type: 'VARCHAR(500)', rule: 'NULLABLE', desc: 'Link da foto de perfil' },
        { name: 'created_at', type: 'TIMESTAMP', rule: 'CURRENT_TIMESTAMP', desc: 'Data de cadastro do leitor' }
      ]
    });

    // 2. Tabela PLANS
    renderTableCard({
      tableName: 'plans',
      moduleName: 'Clube de Assinaturas',
      description: 'Catálogo de modalidades de assinatura do clube de leitura literário.',
      columns: [
        { name: 'id', type: 'VARCHAR(50)', rule: 'PRIMARY KEY', desc: "'visitante', 'digital', 'box_vip', 'master'" },
        { name: 'name', type: 'VARCHAR(100)', rule: 'NOT NULL', desc: "Nome comercial do plano" },
        { name: 'price', type: 'DECIMAL(10,2)', rule: 'NOT NULL', desc: "Valor da mensalidade recorrente" },
        { name: 'has_vip_access', type: 'BOOLEAN', rule: 'DEFAULT FALSE', desc: "Habilita acesso a canais VIP da comunidade" },
        { name: 'discount_books', type: 'INT', rule: 'DEFAULT 0', desc: "Percentual fixo de desconto na livraria" },
        { name: 'is_active', type: 'BOOLEAN', rule: 'DEFAULT TRUE', desc: "Se o plano está disponível para adesão" }
      ]
    });

    // 3. Tabela SUBSCRIPTIONS
    renderTableCard({
      tableName: 'subscriptions',
      moduleName: 'Clube de Assinaturas',
      description: 'Controle de ciclos de faturamento e vigência das assinaturas dos membros.',
      columns: [
        { name: 'id', type: 'INT AUTO_INC', rule: 'PRIMARY KEY', desc: 'Código de controle da assinatura' },
        { name: 'user_id', type: 'INT', rule: 'FK -> users(id)', desc: 'Leitor titular da assinatura' },
        { name: 'plan_id', type: 'VARCHAR(50)', rule: 'FK -> plans(id)', desc: 'Plano contratado' },
        { name: 'status', type: 'ENUM(...)', rule: "DEFAULT 'active'", desc: "'active', 'past_due', 'canceled'" },
        { name: 'current_period_end', type: 'DATETIME', rule: 'NOT NULL', desc: 'Data de expiração/próxima cobrança' },
        { name: 'canceled_at', type: 'DATETIME', rule: 'NULLABLE', desc: 'Data do cancelamento voluntário' }
      ]
    });

    // 4. Tabela BOOKS
    renderTableCard({
      tableName: 'books',
      moduleName: 'Catálogo & Livraria',
      description: 'Acervo principal de obras à venda e disponíveis para resenhas comunitárias.',
      columns: [
        { name: 'id', type: 'INT AUTO_INC', rule: 'PRIMARY KEY', desc: 'Identificador do livro' },
        { name: 'title', type: 'VARCHAR(255)', rule: 'NOT NULL, INDEX', desc: 'Título da obra' },
        { name: 'author', type: 'VARCHAR(255)', rule: 'NOT NULL, INDEX', desc: 'Autor ou tradutor' },
        { name: 'genre', type: 'VARCHAR(100)', rule: 'NOT NULL, INDEX', desc: 'Ficção, Fantasia, Tech, Distopia' },
        { name: 'price', type: 'DECIMAL(10,2)', rule: 'NOT NULL', desc: 'Preço atual praticado na loja' },
        { name: 'original_price', type: 'DECIMAL(10,2)', rule: 'NOT NULL', desc: 'Preço de capa original de referência' },
        { name: 'discount_percent', type: 'INT', rule: 'DEFAULT 0', desc: 'Percentual de desconto visual' },
        { name: 'stock', type: 'INT', rule: 'DEFAULT 0', desc: 'Quantidade em estoque para entrega' },
        { name: 'badge', type: 'VARCHAR(50)', rule: 'NULLABLE', desc: "Tag ('Mais Vendido', 'Destaque', 'Oferta')" },
        { name: 'format', type: 'VARCHAR(50)', rule: "DEFAULT 'Brochura'", desc: 'Capa Dura, Brochura, Edição Especial' },
        { name: 'synopsis', type: 'TEXT', rule: 'NULLABLE', desc: 'Sinopse editorial completa' },
        { name: 'year', type: 'INT', rule: 'NOT NULL', desc: 'Ano de publicação' },
        { name: 'pages', type: 'INT', rule: 'NOT NULL', desc: 'Número total de páginas' },
        { name: 'cover_image', type: 'VARCHAR(500)', rule: 'NOT NULL', desc: 'URL da capa (OpenLibrary / Cloudinary)' },
        { name: 'rating', type: 'DECIMAL(2,1)', rule: 'DEFAULT 5.0', desc: 'Média de estrelas dos leitores' },
        { name: 'status', type: 'VARCHAR(50)', rule: "DEFAULT 'Disponível'", desc: "'Disponível', 'Esgotado', 'Pré-venda'" }
      ]
    });

    // 5. Tabela ORDERS
    renderTableCard({
      tableName: 'orders',
      moduleName: 'E-commerce & Checkout',
      description: 'Cabeçalho de pedidos de compra realizados com frete e cálculo financeiro.',
      columns: [
        { name: 'id', type: 'INT AUTO_INC', rule: 'PRIMARY KEY', desc: 'Número do pedido' },
        { name: 'user_id', type: 'INT', rule: 'FK -> users(id), RESTRICT', desc: 'Cliente que comprou' },
        { name: 'coupon_id', type: 'INT', rule: 'FK -> coupons(id), NULL', desc: 'Cupom aplicado na compra' },
        { name: 'subtotal', type: 'DECIMAL(10,2)', rule: 'NOT NULL', desc: 'Soma dos livros comprados' },
        { name: 'shipping_fee', type: 'DECIMAL(10,2)', rule: 'DEFAULT 0.00', desc: 'Valor cobrado pelo frete' },
        { name: 'discount_amount', type: 'DECIMAL(10,2)', rule: 'DEFAULT 0.00', desc: 'Valor abatido por cupom/clube' },
        { name: 'total_final', type: 'DECIMAL(10,2)', rule: 'NOT NULL', desc: 'Valor total a pagar' },
        { name: 'status', type: 'ENUM(...)', rule: "DEFAULT 'pending'", desc: "'pending', 'paid', 'shipped', 'delivered'" },
        { name: 'payment_method', type: 'ENUM(...)', rule: "NOT NULL", desc: "'pix', 'credit_card', 'boleto'" },
        { name: 'shipping_address', type: 'JSON', rule: 'NOT NULL', desc: 'Snapshot do endereço completo de entrega' },
        { name: 'tracking_code', type: 'VARCHAR(100)', rule: 'NULLABLE', desc: 'Código de rastreio postal' },
        { name: 'created_at', type: 'TIMESTAMP', rule: 'CURRENT_TIMESTAMP', desc: 'Data e hora do fechamento' }
      ]
    });

    // 6. Tabela ORDER_ITEMS
    renderTableCard({
      tableName: 'order_items',
      moduleName: 'E-commerce & Checkout',
      description: 'Itens individuais de cada pedido com snapshot irrevogável de preço histórico.',
      columns: [
        { name: 'id', type: 'INT AUTO_INC', rule: 'PRIMARY KEY', desc: 'Identificador do item de venda' },
        { name: 'order_id', type: 'INT', rule: 'FK -> orders(id), CASCADE', desc: 'Pedido ao qual pertence' },
        { name: 'book_id', type: 'INT', rule: 'FK -> books(id), RESTRICT', desc: 'Livro adquirido' },
        { name: 'unit_price', type: 'DECIMAL(10,2)', rule: 'NOT NULL', desc: 'Preço unitário exato na hora da compra' },
        { name: 'quantity', type: 'INT', rule: 'NOT NULL, CHECK(>0)', desc: 'Quantidade de exemplares' }
      ]
    });

    // 7. Tabela COMMUNITY_POSTS
    renderTableCard({
      tableName: 'community_posts',
      moduleName: 'Comunidade & Clube',
      description: 'Publicações, resenhas críticas e discussões do Salão Literário.',
      columns: [
        { name: 'id', type: 'INT AUTO_INC', rule: 'PRIMARY KEY', desc: 'Identificador do tópico' },
        { name: 'user_id', type: 'INT', rule: 'FK -> users(id), CASCADE', desc: 'Autor da publicação' },
        { name: 'channel', type: 'VARCHAR(50)', rule: 'NOT NULL, INDEX', desc: "'resenhas', 'teorias', 'indicacoes', 'vip'" },
        { name: 'is_vip', type: 'BOOLEAN', rule: 'DEFAULT FALSE', desc: 'Post exclusivo para membros VIP' },
        { name: 'book_id', type: 'INT', rule: 'FK -> books(id), NULL', desc: 'Livro citado/resenhado (opcional)' },
        { name: 'title', type: 'VARCHAR(255)', rule: 'NOT NULL', desc: 'Título chamativo da discussão' },
        { name: 'content', type: 'TEXT', rule: 'NOT NULL', desc: 'Texto da resenha ou debate' },
        { name: 'quote', type: 'TEXT', rule: 'NULLABLE', desc: 'Frase favorita em destaque' },
        { name: 'rating', type: 'INT', rule: 'CHECK(rating BETWEEN 1 AND 5)', desc: 'Nota de 1 a 5 estrelas' },
        { name: 'has_spoiler', type: 'BOOLEAN', rule: 'DEFAULT FALSE', desc: 'Oculta texto com aviso prévio' },
        { name: 'likes_count', type: 'INT', rule: 'DEFAULT 0', desc: 'Contador de curtidas (otimização)' },
        { name: 'created_at', type: 'TIMESTAMP', rule: 'CURRENT_TIMESTAMP', desc: 'Data e hora da publicação' }
      ]
    });

    // 8. Tabela POST_COMMENTS & POST_REACTIONS
    renderTableCard({
      tableName: 'post_comments & post_reactions',
      moduleName: 'Comunidade & Clube',
      description: 'Respostas aos tópicos e reações interativas de membros (aplausos, chamas, corações).',
      columns: [
        { name: 'post_comments.id', type: 'INT AUTO_INC', rule: 'PRIMARY KEY', desc: 'ID do comentário' },
        { name: 'post_comments.post_id', type: 'INT', rule: 'FK -> community_posts(id)', desc: 'Tópico comentado (CASCADE)' },
        { name: 'post_comments.user_id', type: 'INT', rule: 'FK -> users(id)', desc: 'Autor da resposta' },
        { name: 'post_comments.content', type: 'TEXT', rule: 'NOT NULL', desc: 'Texto do comentário' },
        { name: 'post_reactions.user_id', type: 'INT', rule: 'FK -> users(id)', desc: 'Usuário que reagiu' },
        { name: 'post_reactions.type', type: 'ENUM(...)', rule: "'applaud', 'fire', 'heart'", desc: 'Tipo da reação emotiva' },
        { name: 'UNIQUE KEY', type: 'INDEX', rule: '(post_id, user_id, type)', desc: 'Impede duplicação de reações' }
      ]
    });

    // ==========================================
    // SEÇÃO 4: INTEGRIDADE & REGRAS DE NEGÓCIO
    // ==========================================
    ensureSpace(120);
    doc.rect(leftMargin, y, contentWidth, 24).fill(colors.primary);
    doc.fillColor(colors.white).fontSize(10).font('Helvetica-Bold').text('4. REGRAS DE INTEGRIDADE REFERENCIAL & SEGURANÇA', leftMargin + 10, y + 7);
    y += 32;

    const rules = [
      {
        title: 'Histórico Imutável de Vendas',
        text: 'A tabela order_items nunca referencia dinamicamente o preço da tabela books. Ela copia o unit_price no exato segundo da compra. Se o livro mudar de preço depois, o pedido histórico não é afetado.'
      },
      {
        title: 'Proteção contra Exclusão Acidental (RESTRICT)',
        text: 'Não é permitido deletar um usuário que possua pedidos pagos (ON DELETE RESTRICT), mantendo conformidade contábil e fiscal. Já em posts e comentários da comunidade, utiliza-se CASCADE para limpeza completa.'
      },
      {
        title: 'Controle de Acesso em Nível de Linha (Paywall VIP)',
        text: 'Posts com is_vip = TRUE só devem ser retornados na API pública após validação do claims do JWT que confirme status de assinatura ativa em planos com has_vip_access = TRUE.'
      },
      {
        title: 'Transação Atômica no Checkout (ACID)',
        text: 'A rota POST /api/orders deve executar em transação única (START TRANSACTION): 1) Verifica estoque de cada livro; 2) Cria registro em orders; 3) Insere order_items; 4) Decrementa stock em books; 5) COMMIT.'
      }
    ];

    rules.forEach((r, idx) => {
      ensureSpace(42);
      doc.rect(leftMargin, y, contentWidth, 36).fillAndStroke(colors.cardBg, colors.border);
      doc.rect(leftMargin, y, 4, 36).fill(colors.gold);
      doc.fillColor(colors.primary).fontSize(8.5).font('Helvetica-Bold').text(`${idx + 1}. ${r.title}`, leftMargin + 10, y + 6);
      doc.fillColor(colors.dark).fontSize(7.5).font('Helvetica').text(r.text, leftMargin + 10, y + 18, { width: contentWidth - 20 });
      y += 42;
    });

    // ==========================================
    // SEÇÃO 5: ROTEIRO PRÁTICO DE IMPLEMENTAÇÃO
    // ==========================================
    ensureSpace(130);
    doc.rect(leftMargin, y, contentWidth, 24).fill(colors.primary);
    doc.fillColor(colors.white).fontSize(10).font('Helvetica-Bold').text('5. ROTEIRO DE IMPLEMENTAÇÃO NAS SPRINTS', leftMargin + 10, y + 7);
    y += 32;

    const steps = [
      { step: 'Fase 1', name: 'Geração do Script DDL', desc: 'Criar backend/database/schema.sql com todas as instruções CREATE TABLE, FOREIGN KEYS e INDEXES.' },
      { step: 'Fase 2', name: 'Script de Migração & Seeds', desc: 'Atualizar setupDatabase.js para criar as tabelas e semear o administrador padrão e o acervo inicial de livros.' },
      { step: 'Fase 3', name: 'Refatoração dos Serviços (Backend)', desc: 'Substituir a persistência em memória/JSON local por queries com pool MySQL (users, books, community, orders).' },
      { step: 'Fase 4', name: 'Conexão com Formulários (Frontend)', desc: 'Ligar páginas de login.js, comunidade.js e carrinho de compras às rotas REST protegidas.' }
    ];

    steps.forEach((s) => {
      ensureSpace(32);
      doc.rect(leftMargin, y, 50, 26).fill(colors.tagBg);
      doc.fillColor(colors.primaryDark).fontSize(8).font('Helvetica-Bold').text(s.step, leftMargin + 6, y + 8, { width: 38, align: 'center' });

      doc.rect(leftMargin + 55, y, contentWidth - 55, 26).fillAndStroke(colors.cardBg, colors.border);
      doc.fillColor(colors.primary).fontSize(8).font('Helvetica-Bold').text(s.name, leftMargin + 65, y + 5, { continued: true });
      doc.fillColor(colors.muted).fontSize(7.5).font('Helvetica').text(`  —  ${s.desc}`);

      y += 32;
    });

    // ==========================================
    // RODAPÉ COM NUMERAÇÃO DE PÁGINAS
    // ==========================================
    const totalPages = doc.bufferedPageRange().count;
    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(i);
      doc.rect(leftMargin, pageHeight - 35, contentWidth, 0.5).fill(colors.border);
      doc.fillColor(colors.muted).fontSize(7.5).font('Helvetica')
        .text('Bibliotech • Documentação Técnica de Engenharia de Software', leftMargin, pageHeight - 26, { align: 'left' });
      doc.text(`Página ${i + 1} de ${totalPages}`, leftMargin, pageHeight - 26, { align: 'right' });
    }

    doc.end();

    writeStream.on('finish', () => resolve(outputPath));
    writeStream.on('error', (err) => reject(err));
  });
}

const targetPath = path.resolve(__dirname, '../../../ESTUDO_MODELAGEM_BANCO_DE_DADOS_BIBLIOTECH.pdf');
console.log(`Gerando PDF em: ${targetPath}...`);

generateDatabaseStudyPDF(targetPath)
  .then((file) => {
    console.log(`✅ PDF gerado com sucesso em: ${file}`);
  })
  .catch((err) => {
    console.error('❌ Erro ao gerar PDF:', err);
    process.exit(1);
  });
