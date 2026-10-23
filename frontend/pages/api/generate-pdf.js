import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';

export default async function handler(req, res) {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const contentWidth = pageWidth - (margin * 2);

    // Paleta de Cores
    const colors = {
      primary: [142, 31, 31],     // Carmesim lacre (#8e1f1f)
      gold: [198, 146, 56],       // Ouro antigo (#c69238)
      dark: [30, 24, 19],         // Marrom/Carvão profundo (#1e1813)
      muted: [92, 82, 72],        // Texto secundário (#5c5248)
      cardBg: [250, 246, 238],    // Fundo pergaminho suave (#faf6ee)
      cardHeader: [242, 232, 216],// Destaque cabeçalho card (#f2e8d8)
      border: [215, 202, 180]     // Borda pergaminho
    };

    // Header Principal (Pergaminho Nobre)
    doc.setFillColor(...colors.cardBg);
    doc.setDrawColor(...colors.gold);
    doc.setLineWidth(1.5);
    doc.roundedRect(margin, 35, contentWidth, 75, 6, 6, 'FD');

    // Faixa dourada decorativa no topo do card
    doc.setFillColor(...colors.gold);
    doc.rect(margin, 35, contentWidth, 5, 'F');

    doc.setTextColor(...colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('BIBLIOTECH • LIVRARIA & CLUBE LITERÁRIO', margin + 16, 62);

    doc.setTextColor(...colors.gold);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('PLANO DE AÇÃO & ROADMAP EM SPRINTS DE 2 DIAS', margin + 16, 80);

    doc.setTextColor(...colors.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text('Cronograma ágil de 12 dias para estabilização, banco de dados, assinaturas VIP e deploy.', margin + 16, 96);

    let y = 125;

    const sprints = [
      {
        num: 'SPRINT 1 (DIAS 1 E 2)',
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
        num: 'SPRINT 2 (DIAS 3 E 4)',
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
        num: 'SPRINT 3 (DIAS 5 E 6)',
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
        num: 'SPRINT 4 (DIAS 7 E 8)',
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
        num: 'SPRINT 5 (DIAS 9 E 10)',
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
        num: 'SPRINT 6 (DIAS 11 E 12)',
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

    sprints.forEach((sprint, idx) => {
      const cardHeight = 205;

      // Se não couber na página, cria nova página
      if (y + cardHeight > pageHeight - 45) {
        doc.addPage();
        y = 40;
      }

      // Card de Fundo
      doc.setFillColor(...colors.cardBg);
      doc.setDrawColor(...colors.border);
      doc.setLineWidth(1);
      doc.roundedRect(margin, y, contentWidth, cardHeight, 4, 4, 'FD');

      // Topo do Card
      doc.setFillColor(...colors.cardHeader);
      doc.rect(margin, y, contentWidth, 24, 'F');
      doc.setDrawColor(...colors.border);
      doc.line(margin, y + 24, margin + contentWidth, y + 24);

      // Título da Sprint
      doc.setTextColor(...colors.primary);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text(sprint.num, margin + 12, y + 16);

      doc.setTextColor(...colors.dark);
      doc.text(`-  ${sprint.title}`, margin + 140, y + 16);

      // Badge
      doc.setTextColor(...colors.gold);
      doc.setFontSize(7.5);
      doc.text(`[ ${sprint.badge} ]`, margin + contentWidth - 110, y + 16);

      let curY = y + 36;

      // Objetivo
      doc.setTextColor(...colors.primary);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('OBJETIVO:', margin + 12, curY);

      doc.setTextColor(...colors.dark);
      doc.setFont('helvetica', 'normal');
      doc.text(sprint.goal, margin + 70, curY, { width: contentWidth - 85 });

      curY += 18;

      // Tarefas Frontend
      doc.setTextColor(...colors.gold);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('FRONTEND:', margin + 12, curY);

      curY += 11;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.dark);
      doc.setFontSize(7.5);
      sprint.frontend.forEach((item) => {
        doc.text(`• ${item}`, margin + 20, curY, { width: contentWidth - 35 });
        curY += 10.5;
      });

      curY += 3;

      // Tarefas Backend
      doc.setTextColor(...colors.primary);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('BACKEND:', margin + 12, curY);

      curY += 11;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.dark);
      doc.setFontSize(7.5);
      sprint.backend.forEach((item) => {
        doc.text(`• ${item}`, margin + 20, curY, { width: contentWidth - 35 });
        curY += 10.5;
      });

      curY += 3;

      // Critério de Aceite (DoD)
      doc.setTextColor(...colors.muted);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('CRITÉRIO DE ACEITE (DOD):', margin + 12, curY);

      doc.setFont('helvetica', 'oblique');
      doc.setTextColor(...colors.dark);
      doc.text(sprint.dod, margin + 135, curY, { width: contentWidth - 148 });

      y += cardHeight + 14;
    });

    // Numeração de páginas no rodapé
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setTextColor(...colors.muted);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(
        `Bibliotech - Livraria & Clube Literário • Planejamento Ágil de Sprints • Página ${i} de ${totalPages}`,
        pageWidth / 2,
        pageHeight - 20,
        { align: 'center' }
      );
    }

    // Salva o PDF no disco em múltiplos locais para conveniência do usuário:
    // 1. Na raiz do projeto: c:\Users\Elza-002\Desktop\modelo\PLANEJAMENTO_SPRINTS_BIBLIOTECH.pdf
    // 2. Na pasta public do frontend para acesso web imediato
    const arrayBuffer = doc.output('arraybuffer');
    const buffer = Buffer.from(arrayBuffer);

    const rootPath = path.resolve(process.cwd(), '../PLANEJAMENTO_SPRINTS_BIBLIOTECH.pdf');
    const publicPath = path.resolve(process.cwd(), 'public/PLANEJAMENTO_SPRINTS_BIBLIOTECH.pdf');

    try {
      fs.writeFileSync(rootPath, buffer);
    } catch (e) {
      console.error('Erro ao salvar na raiz:', e);
    }

    try {
      fs.writeFileSync(publicPath, buffer);
    } catch (e) {
      console.error('Erro ao salvar em public:', e);
    }

    // Retorna o PDF no response ou JSON
    if (req.query.download === 'true') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="PLANEJAMENTO_SPRINTS_BIBLIOTECH.pdf"');
      return res.send(buffer);
    }

    return res.status(200).json({
      success: true,
      message: 'PDF das Sprints gerado com sucesso!',
      filesCreated: [
        rootPath,
        publicPath
      ],
      publicDownloadUrl: 'http://localhost:3000/PLANEJAMENTO_SPRINTS_BIBLIOTECH.pdf'
    });
  } catch (err) {
    console.error('Erro ao gerar PDF:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
