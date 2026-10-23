const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const SPRINTS_DATA = [
  {
    num: 'Sprint 1 (Dias 1 e 2)',
    title: 'Catálogo Leve, Paginação e Limpeza de Recomendações',
    badge: 'FRONTEND & PERFORMANCE',
    goal: 'Eliminar gargalos de carregamento, implementar paginação com debounce e remover módulos legados.',
    frontend: [
      'Remover definitivamente as rotas e componentes órfãos de recomendações (recomendacoes.js e RelevantBooksCarousel.js).',
      'Implementar paginação no catálogo (8 a 12 livros por página ou infinite-scroll suave).',
      'Aplicar debounce de 300ms na barra de busca e filtros de categoria.',
      'Garantir carregamento otimizado de capas (-M.jpg com lazy loading e decoding async).'
    ],
    backend: [
      'Adicionar suporte a query params (?page=1&limit=12&search=) na rota GET /books.',
      'Criar resposta paginada estruturada: { total, page, totalPages, data: [...] }.'
    ],
    dod: 'Catálogo carrega em menos de 1 segundo, sem travamentos na busca e sem chamadas de recomendações.'
  },
  {
    num: 'Sprint 2 (Dias 3 e 4)',
    title: 'Banco de Dados & Autenticação Segura de Leitores',
    badge: 'BACKEND & AUTENTICAÇÃO',
    goal: 'Trocar estados mockados por persistência real de usuários com hash de senha e JWT.',
    frontend: [
      'Conectar formulários de Login e Cadastro (login.js) à API do backend.',
      'Armazenar token JWT com segurança (localStorage/Cookie) e criar estado global do usuário logado.',
      'Atualizar cabeçalho da loja e da comunidade com nome e avatar dinâmicos do leitor.'
    ],
    backend: [
      'Criar tabelas no MySQL/PostgreSQL (users: id, nome, email, senha_hash, plano_id, avatar).',
      'Implementar rotas seguras: POST /auth/register, POST /auth/login com bcrypt e JWT.',
      'Criar middleware de autenticação e endpoint GET /auth/me para validação de sessão.'
    ],
    dod: 'Usuário consegue se cadastrar, logar, recarregar a página e continuar autenticado.'
  },
  {
    num: 'Sprint 3 (Dias 5 e 6)',
    title: 'API da Comunidade & Acesso Real às Salas VIP',
    badge: 'COMUNIDADE & CLUBE',
    goal: 'Conectar o Salão Literário ao banco de dados com postagens reais e controle de acesso aos canais VIP.',
    frontend: [
      'Integrar página da Comunidade (comunidade.js) com as rotas REST do backend.',
      'Implementar criação de posts, reações (aplausos, chamas) e comentários com atualização otimista.',
      'Bloquear navegação nas Salas VIP quando o usuário não tiver o plano correspondente.'
    ],
    backend: [
      'Criar tabelas: community_posts, post_reactions, post_comments e poll_votes.',
      'Criar rotas: GET/POST /api/community/posts, POST /posts/:id/react e POST /posts/:id/comments.',
      'Adicionar verificação de nível de assinatura no token JWT antes de liberar posts VIP.'
    ],
    dod: 'Membros publicam e reagem a posts em tempo real; visitantes são direcionados ao paywall nas salas VIP.'
  },
  {
    num: 'Sprint 4 (Dias 7 e 8)',
    title: 'Carrinho de Compras, Frete e Fluxo de Checkout',
    badge: 'E-COMMERCE & CHECKOUT',
    goal: 'Permitir que o leitor monte a cesta de livros físicos, aplique cupons e finalize pedidos.',
    frontend: [
      'Persistir itens do carrinho no localStorage com sincronização na conta do usuário.',
      'Implementar modal/tela de Checkout com resumo de itens, cálculo de frete por CEP e aplicação de cupom (CLUBE20).',
      'Adicionar tela de confirmação com chave Pix (QR Code gerado) e simulação de cartão.'
    ],
    backend: [
      'Criar tabela orders e order_items vinculadas ao id do usuário.',
      'Criar rota POST /api/orders para registrar pedidos e abater estoque dos livros comprados.',
      'Criar validação de cupons ativos no backend.'
    ],
    dod: 'Fluxo ponta a ponta: adicionar ao carrinho -> aplicar cupom -> preencher entrega -> gerar pedido.'
  },
  {
    num: 'Sprint 5 (Dias 9 e 10)',
    title: 'Clube de Assinaturas & Painel do Leitor (Minha Conta)',
    badge: 'GESTÃO & ASSINATURAS',
    goal: 'Gerenciar planos literários (Digital, Box VIP, Colecionador Master) e criar área do cliente.',
    frontend: [
      'Desenvolver fluxo de adesão e troca de plano com modal de confirmação.',
      'Criar página/aba "Minha Conta": livros favoritos, pedidos realizados e código de rastreio.',
      'Painel simples de administração para cadastro e edição de livros no estoque.'
    ],
    backend: [
      'Tabela subscriptions com status (ativa, cancelada, pendente) e data de renovação.',
      'Rotas de gestão: POST /api/subscriptions/subscribe e GET /api/user/orders.',
      'Proteção de rotas administrativas com verificação de role === "admin".'
    ],
    dod: 'Assinante consegue gerenciar seu plano, visualizar histórico de pedidos e editar perfil.'
  },
  {
    num: 'Sprint 6 (Dias 11 e 12)',
    title: 'Auditoria de Performance, SEO, Segurança e Deploy',
    badge: 'QUALIDADE & PRODUÇÃO',
    goal: 'Homologar todo o sistema, otimizar Core Web Vitals e publicar em servidores de produção.',
    frontend: [
      'Auditoria Lighthouse: atingir notas verdes em Performance, Acessibilidade e SEO.',
      'Configurar meta tags Open Graph e favicon em todas as rotas.',
      'Deploy do Frontend na Vercel conectado ao repositório GitHub.'
    ],
    backend: [
      'Configurar variáveis de produção no .env.production com senhas fortes e URLs corretas.',
      'Deploy do Backend no Render / Railway com banco de dados MySQL na nuvem.',
      'Habilitar CORS restrito para o domínio de produção.'
    ],
    dod: 'Aplicação 100% online em URLs públicas, responsiva, rápida e operando sem erros no console.'
  }
];

const COLORS = {
  primary: '#8e1f1f',
  gold: '#c69238',
  dark: '#1e1813',
  muted: '#5c5248',
  cardBg: '#faf6ee',
  border: '#dfd5c4',
  accentBg: '#f2e8d8'
};

/**
 * Serviço gerador de documento PDF de planejamento de Sprints
 */
class SprintPdfService {
  /**
   * Constrói e escreve o PDF em disco
   */
  static generateToFile(outputPath) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        bufferPages: true,
        margins: { top: 40, bottom: 45, left: 45, right: 45 },
        info: {
          Title: 'Planejamento de Sprints - Bibliotech',
          Author: 'Bibliotech Dev Team',
          Subject: 'Roadmap em Sprints de 2 Dias'
        }
      });

      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);

      this._buildPdfContent(doc);

      doc.end();

      writeStream.on('finish', () => resolve(outputPath));
      writeStream.on('error', (err) => reject(err));
    });
  }

  /**
   * Constrói e direciona o fluxo diretamente para uma stream de resposta HTTP
   */
  static pipeToStream(outputStream) {
    const doc = new PDFDocument({
      size: 'A4',
      bufferPages: true,
      margins: { top: 40, bottom: 45, left: 45, right: 45 },
      info: {
        Title: 'Planejamento de Sprints - Bibliotech',
        Author: 'Bibliotech Dev Team',
        Subject: 'Roadmap em Sprints de 2 Dias'
      }
    });

    doc.pipe(outputStream);
    this._buildPdfContent(doc);
    doc.end();
  }

  /**
   * Constrói o layout completo das páginas do PDF
   */
  static _buildPdfContent(doc) {
    // Header decorativo
    doc.rect(45, 40, 505, 75).fillAndStroke(COLORS.cardBg, COLORS.gold);

    doc
      .fillColor(COLORS.primary)
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('BIBLIOTECH • LIVRARIA & CLUBE LITERÁRIO', 60, 52);

    doc
      .fillColor(COLORS.gold)
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('PLANO DE AÇÃO & ROADMAP EM SPRINTS DE 2 DIAS', 60, 72);

    doc
      .fillColor(COLORS.muted)
      .fontSize(9)
      .font('Helvetica')
      .text('Cronograma ágil de 12 dias para finalização, persistência e deploy em produção.', 60, 90);

    let y = 130;

    SPRINTS_DATA.forEach((sprint) => {
      if (y + 180 > 790) {
        doc.addPage();
        y = 45;
      }

      const cardHeight = 175;
      doc.rect(45, y, 505, cardHeight).fillAndStroke(COLORS.cardBg, COLORS.border);
      doc.rect(45, y, 505, 26).fill(COLORS.accentBg);

      doc
        .fillColor(COLORS.primary)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(sprint.num.toUpperCase(), 55, y + 8);

      doc
        .fillColor(COLORS.dark)
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(`-  ${sprint.title}`, 180, y + 8);

      doc
        .fillColor(COLORS.gold)
        .fontSize(7.5)
        .font('Helvetica-Bold')
        .text(`[ ${sprint.badge} ]`, 420, y + 9, { align: 'right', width: 120 });

      let contentY = y + 34;

      // Objetivo
      doc
        .fillColor(COLORS.primary)
        .fontSize(8.5)
        .font('Helvetica-Bold')
        .text('OBJETIVO: ', 55, contentY);

      doc
        .fillColor(COLORS.dark)
        .fontSize(8.5)
        .font('Helvetica')
        .text(sprint.goal, 115, contentY, { width: 425 });

      contentY += 18;

      // Tarefas Frontend
      doc
        .fillColor(COLORS.gold)
        .fontSize(8.5)
        .font('Helvetica-Bold')
        .text('FRONTEND:', 55, contentY);

      contentY += 12;
      sprint.frontend.forEach(item => {
        doc
          .fillColor(COLORS.dark)
          .fontSize(7.8)
          .font('Helvetica')
          .text(`• ${item}`, 65, contentY, { width: 475 });
        contentY += 11;
      });

      // Tarefas Backend
      contentY += 3;
      doc
        .fillColor(COLORS.primary)
        .fontSize(8.5)
        .font('Helvetica-Bold')
        .text('BACKEND:', 55, contentY);

      contentY += 12;
      sprint.backend.forEach(item => {
        doc
          .fillColor(COLORS.dark)
          .fontSize(7.8)
          .font('Helvetica')
          .text(`• ${item}`, 65, contentY, { width: 475 });
        contentY += 11;
      });

      // Critério de Aceite
      contentY += 3;
      doc
        .fillColor(COLORS.muted)
        .fontSize(7.8)
        .font('Helvetica-Bold')
        .text('CRITÉRIO DE ACEITE (DOD): ', 55, contentY);

      doc
        .fillColor(COLORS.dark)
        .fontSize(7.8)
        .font('Helvetica-Oblique')
        .text(sprint.dod, 185, contentY, { width: 355 });

      y += cardHeight + 15;
    });

    // Rodapé em todas as páginas
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      doc
        .fillColor(COLORS.muted)
        .fontSize(7.5)
        .font('Helvetica')
        .text(
          `Bibliotech - Livraria & Clube Literário • Planejamento Ágil • Página ${i + 1} de ${pages.count}`,
          45,
          805,
          { align: 'center', width: 505 }
        );
    }
  }
}

module.exports = SprintPdfService;
