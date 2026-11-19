import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Library,
  MessageCircle,
  MessageSquare,
  Users,
  Search,
  Star,
  Heart,
  Send,
  Plus,
  Sparkles,
  Flame,
  Award,
  BookOpen,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ThumbsUp,
  Bookmark,
  Coffee,
  Quote,
  LogIn,
  LogOut,
  ChevronDown,
  ChevronUp,
  Share2,
  Calendar,
  Shield,
  ShieldCheck,
  TrendingUp,
  Filter,
  Lock,
  Unlock,
  Crown,
  Package,
  Smartphone,
  Gift,
  Check,
  Copy,
  Zap,
  Tag,
  Edit2
} from 'lucide-react';
import ThemeToggle from '../components/menu/ThemeToggle';
import styles from '../styles/comunidade.module.css';

// Otimizador de URL de imagem de capas (converte para tamanho médio -M.jpg reduzindo 90%+ do peso da imagem)
export const getOptimizedCoverUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('covers.openlibrary.org') && url.includes('-L.jpg')) {
    return url.replace('-L.jpg', '-M.jpg');
  }
  return url;
};

// Planos de Assinatura do Clube Literário (Honras do Clã)
const CLUB_PLANS = {
  digital: {
    id: 'digital',
    name: 'Bardo Digital',
    badge: '📱 Bardo do Clã Digital',
    monthlyPrice: 24.90,
    annualPrice: 19.90,
    color: '#8c5627',
    rune: 'ᛞ',
    description: 'Acesso ilimitado a +5.000 e-books, debates digitais e pergaminhos sagrados em PDF.',
    perks: [
      'Acesso à câmara #bardo-digital-ebooks',
      'Tributo de 10% OFF permanente na livraria',
      'Download de guias e mapas literários em PDF',
      'Votação mensal nos conselhos do clube'
    ]
  },
  'box-vip': {
    id: 'box-vip',
    name: 'Guarda do Box Nobre',
    badge: '📦 Guarda do Box VIP',
    monthlyPrice: 69.90,
    annualPrice: 59.90,
    color: '#8e1f1f',
    rune: 'ᚺ',
    description: '1 Tomo surpresa em capa dura nobre por mês, 3 relíquias colecionáveis e spoilers liberados.',
    perks: [
      'Acesso ao #salão-box-capa-dura e à câmara digital',
      'Debates com revelações e profecias liberadas',
      'Tributo de 20% OFF permanente em todo o acervo',
      'Unboxing exclusivo e votação do próximo tomo'
    ]
  },
  master: {
    id: 'master',
    name: 'Mestre do Conselho Supremo',
    badge: '👑 Mestre Colecionador',
    monthlyPrice: 119.90,
    annualPrice: 99.90,
    color: '#c69238',
    rune: 'ᛟ',
    description: 'Passe de Honra Total: 2 edições de luxo numeradas por mês e encontros fechados com bardos e autores.',
    perks: [
      'Passe de Honra Total: Acesso a TODAS as câmaras e lounges sagrados',
      'Audiência no Zoom com autores e tradutores das obras',
      'Tributo VIP de 30% OFF vitalício em qualquer tomo',
      'Voz direta com os mestres curadores do acervo'
    ]
  }
};

// Canais Públicos Abertos (Tábua de Runas dos Clãs)
const PUBLIC_CHANNELS = [
  { id: 'all', label: 'Todos os Canais', vikingLabel: 'Todos os Pergaminhos', rune: 'ᛟ', icon: MessageSquare, desc: 'Feed unificado dos clãs' },
  { id: 'geral', label: '#geral-leituras', vikingLabel: '#crônicas-gerais', rune: 'ᚲ', icon: MessageCircle, desc: 'Bate-papo livre sobre suas leituras atuais' },
  { id: 'resenhas', label: '#resenhas-e-criticas', vikingLabel: '#resenhas-dos-bardos', rune: 'ᛒ', icon: Star, desc: 'Avaliações detalhadas, honras e resenhas críticas' },
  { id: 'teorias', label: '#teorias-e-spoilers', vikingLabel: '#profecias-e-spoilers', rune: 'ᚦ', icon: AlertTriangle, desc: 'Debates sobre reviravoltas com selo de spoiler' },
  { id: 'indicacoes', label: '#indicacoes-literarias', vikingLabel: '#indicações-sagradas', rune: 'ᛉ', icon: Lightbulb, desc: 'Dicas de livros e recomendações entre leitores' },
  { id: 'citacoes', label: '#citacoes-marcantes', vikingLabel: '#versos-e-citações', rune: 'ᚨ', icon: Quote, desc: 'Trechos marcantes e versos imortais' },
];

// Canais VIP Exclusivos Mediante Assinatura (Câmaras Nobres)
const VIP_CHANNELS = [
  {
    id: 'vip-assinantes',
    label: '#sala-assinantes-vip',
    vikingLabel: '#câmara-senhores-vip',
    rune: 'ᚠ',
    icon: Gift,
    tier: 'all-vip',
    requiredPlanName: 'Qualquer Assinatura Ativa (Bardo, Guarda ou Mestre)',
    badge: 'Membros de Honra',
    desc: 'Cupons exclusivos de 20% a 30% OFF, sorteios mensais e pré-vendas de tomos',
    perks: [
      'Cupons secretos mensais para compra de livros no acervo',
      'Sorteios de caixas nórdicas e relíquias de colecionador',
      'Votação aberta para a temática do próximo solstício'
    ]
  },
  {
    id: 'vip-digital',
    label: '#leitor-digital-ebooks',
    vikingLabel: '#bardo-digital-ebooks',
    rune: 'ᛞ',
    icon: Smartphone,
    tier: 'digital',
    requiredPlanName: 'Plano Bardo Digital ou Mestre',
    badge: 'Bardo Digital',
    desc: 'Discussões dos pergaminhos digitais, guias em PDF e metas de leitura',
    perks: [
      'Debates dos e-books mensais da biblioteca sagrada',
      'Download de mapas, árvores genealógicas e crônicas em PDF',
      'Anotações e notas históricas dos clássicos'
    ]
  },
  {
    id: 'vip-box',
    label: '#espaco-box-capa-dura',
    vikingLabel: '#salão-box-capa-dura',
    rune: 'ᚺ',
    icon: Package,
    tier: 'box-vip',
    requiredPlanName: 'Plano Guarda do Box Nobre ou Mestre',
    badge: 'Guarda do Box',
    desc: 'Revelações do Tomo do Mês, unboxing dos mimos de metal e votações',
    perks: [
      'Debate completo com spoilers liberados da caixa do mês',
      'Galeria de fotos do unboxing das relíquias colecionáveis',
      'Enquete decisória do tomo que virá na próxima remessa'
    ]
  },
  {
    id: 'vip-master',
    label: '#lounge-colecionador-master',
    vikingLabel: '#lounge-mestre-supremo',
    rune: '👑',
    icon: Crown,
    tier: 'master',
    requiredPlanName: 'Plano Mestre do Conselho Supremo',
    badge: 'Mestre Supremo',
    desc: 'Audiências virtuais com bardos, autores, tradutores e tomos numerados',
    perks: [
      'Audiência direta no Zoom com autores e tradutores',
      'Galeria de fotos das edições de luxo numeradas exclusivas',
      'Voz ativa junto aos mestres curadores da Bibliotech'
    ]
  }
];

// Catálogo base de livros para vincular nas publicações
const STORE_BOOKS = [
  { id: 1, title: 'Duna', author: 'Frank Herbert', cover: 'https://covers.openlibrary.org/b/id/11149234-L.jpg', price: 59.9 },
  { id: 2, title: 'O Senhor dos Anéis: A Sociedade do Anel', author: 'J.R.R. Tolkien', cover: 'https://covers.openlibrary.org/b/id/14547565-L.jpg', price: 69.9 },
  { id: 3, title: '1984', author: 'George Orwell', cover: 'https://covers.openlibrary.org/b/id/9267242-L.jpg', price: 34.9 },
  { id: 4, title: 'Código Limpo (Clean Code)', author: 'Robert C. Martin', cover: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg', price: 84.9 },
  { id: 5, title: 'Sapiens: Uma Breve História da Humanidade', author: 'Yuval Noah Harari', cover: 'https://covers.openlibrary.org/b/id/8448746-L.jpg', price: 54.9 },
  { id: 6, title: 'Harry Potter e a Pedra Filosofal', author: 'J.K. Rowling', cover: 'https://covers.openlibrary.org/b/id/10521270-L.jpg', price: 49.9 },
  { id: 7, title: 'O Pequeno Príncipe', author: 'Antoine de Saint-Exupéry', cover: 'https://covers.openlibrary.org/b/id/12833521-L.jpg', price: 29.9 },
  { id: 8, title: 'Dom Casmurro', author: 'Machado de Assis', cover: 'https://covers.openlibrary.org/b/id/10041492-L.jpg', price: 32.9 },
  { id: 9, title: 'Orgulho e Preconceito', author: 'Jane Austen', cover: 'https://covers.openlibrary.org/b/id/12833446-L.jpg', price: 42.9 },
  { id: 10, title: 'O Iluminado (The Shining)', author: 'Stephen King', cover: 'https://covers.openlibrary.org/b/id/8235114-L.jpg', price: 58.9 },
];

// Postagens Iniciais (Públicas + VIPs)
const INITIAL_POSTS = [
  // Posts Públicos
  {
    id: 1,
    channel: 'resenhas',
    isVip: false,
    authorName: 'Mariana Silva',
    authorAvatar: 'M',
    authorBadge: 'Compra Verificada',
    createdAt: 'há 2 horas',
    timestamp: Date.now() - 2 * 3600 * 1000,
    bookId: 1,
    bookTitle: 'Duna',
    bookAuthor: 'Frank Herbert',
    bookCover: 'https://covers.openlibrary.org/b/id/11149234-L.jpg',
    category: 'Resenha Completa',
    rating: 5,
    title: 'Uma obra-prima visceral que redefine a ficção científica moderna!',
    content: 'Recebi a edição em capa dura aqui pela Bibliotech em 2 dias com entrega impecável. A construção minuciosa do ecossistema de Arrakis, a política das grandes casas e a evolução de Paul Atreides te prendem a cada linha. Vale cada centavo investido!',
    quote: 'Não devo ter medo. O medo é o assassino da mente.',
    hasSpoiler: false,
    likes: 28,
    reactions: { love: 18, fire: 7, bulb: 3, agree: 12 },
    replies: [
      {
        id: 101,
        authorName: 'Pedro Alencar',
        authorAvatar: 'P',
        createdAt: 'há 1 hora',
        content: 'Concordo plenamente, Mariana! O segundo livro, O Messias de Duna, consegue expandir essa filosofia de forma brilhante.'
      }
    ]
  },
  {
    id: 2,
    channel: 'teorias',
    isVip: false,
    authorName: 'Lucas Ferreira',
    authorAvatar: 'L',
    authorBadge: 'Leitor Voraz',
    createdAt: 'há 4 horas',
    timestamp: Date.now() - 4 * 3600 * 1000,
    bookId: 3,
    bookTitle: '1984',
    bookAuthor: 'George Orwell',
    bookCover: 'https://covers.openlibrary.org/b/id/9267242-L.jpg',
    category: 'Discussão & Teorias',
    rating: 5,
    title: 'O simbolismo oculto do Quarto 101 e o controle da linguagem',
    content: 'O ponto mais aterrador da releitura é perceber que o Quarto 101 não é apenas uma câmara física, mas a quebra da última fronteira individual. O Grande Irmão não quer apenas submissão, quer que você realmente o ame.',
    quote: 'Guerra é paz. Liberdade é escravidão. Ignorância é força.',
    hasSpoiler: true,
    likes: 45,
    reactions: { love: 14, fire: 19, bulb: 12, agree: 15 },
    replies: []
  },

  // Posts VIP 1: Sala Geral de Assinantes
  {
    id: 10,
    channel: 'vip-assinantes',
    isVip: true,
    authorName: 'Equipe Curadoria Bibliotech',
    authorAvatar: 'B',
    authorBadge: 'Curadoria Oficial',
    createdAt: 'há 30 min',
    timestamp: Date.now() - 30 * 60 * 1000,
    bookId: null,
    bookTitle: null,
    category: 'Aviso aos Assinantes',
    rating: 0,
    title: '🎟️ Cupom Secreto de Assinante Ativo: use "CLUBE20" para 20% OFF!',
    content: 'Olá membros do Clube Bibliotech! Como benefício exclusivo da assinatura deste mês, liberamos o cupom especial CLUBE20 que garante 20% de desconto adicional cumulativo em qualquer livro físico da livraria. Válido até o fim do mês.',
    quote: null,
    hasSpoiler: false,
    likes: 54,
    reactions: { love: 36, fire: 18, bulb: 12, agree: 24 },
    replies: [
      {
        id: 1001,
        authorName: 'Carla Nogueira',
        authorAvatar: 'C',
        createdAt: 'há 10 min',
        content: 'Já garanti O Iluminado em edição especial com o desconto! Muito obrigada equipe!'
      }
    ]
  },

  // Posts VIP 2: Espaço Box VIP Capa Dura
  {
    id: 11,
    channel: 'vip-box',
    isVip: true,
    authorName: 'Renata Vasconcelos',
    authorAvatar: 'R',
    authorBadge: 'Membro Box VIP',
    createdAt: 'há 1 hora',
    timestamp: Date.now() - 60 * 60 * 1000,
    bookId: 1,
    bookTitle: 'Duna (Edição Especial Box VIP)',
    bookAuthor: 'Frank Herbert',
    bookCover: 'https://covers.openlibrary.org/b/id/11149234-L.jpg',
    category: 'Debate do Livro do Mês',
    rating: 5,
    title: '📦 Unboxing da Caixa do Mês: A edição em Capa Dura e a ecobag de Arrakis!',
    content: 'Pessoal, a caixa acabou de chegar aqui em casa! A sobrecapa metalizada ficou espetacular e o pin dos Fremen é de metal pesado, acabamento impecável de colecionador. Quem já começou o capítulo 5? A cena do teste do Gom Jabbar foi de tirar o fôlego!',
    quote: 'Um mundo é sustentado por quatro coisas: o saber dos sábios, a justiça dos grandes, as preces dos justos e a bravura dos valorosos.',
    hasSpoiler: true,
    likes: 38,
    reactions: { love: 29, fire: 15, bulb: 6, agree: 18 },
    replies: [
      {
        id: 1101,
        authorName: 'Gabriel Siqueira',
        authorAvatar: 'G',
        createdAt: 'há 20 min',
        content: 'Minha ecobag já está sendo usada hoje! A qualidade do acabamento aveludado da caixa deste mês foi a melhor do ano.'
      }
    ]
  },

  // Posts VIP 3: Lounge Colecionador Master
  {
    id: 12,
    channel: 'vip-master',
    isVip: true,
    authorName: 'Curadoria Bibliotech',
    authorAvatar: 'B',
    authorBadge: 'Lounge Master',
    createdAt: 'há 3 horas',
    timestamp: Date.now() - 3 * 3600 * 1000,
    bookId: 2,
    bookTitle: 'O Senhor dos Anéis (Edição de Luxo Numerada)',
    bookAuthor: 'J.R.R. Tolkien',
    bookCover: 'https://covers.openlibrary.org/b/id/14547565-L.jpg',
    category: 'Encontro Fechado com Tradutor',
    rating: 5,
    title: '👑 Link Secreto: Encontro no Zoom com o Tradutor de Tolkien (Sexta 20h)',
    content: 'Estimados membros Colecionadores Master: nesta sexta-feira às 20h realizaremos nossa roda de conversa exclusiva e fechada via Zoom com o tradutor da nova edição de O Senhor dos Anéis. Abordaremos as escolhas de versos élficos e termos toponímicos da Terra-média. O link direto para acesso à sala está ativo.',
    quote: null,
    hasSpoiler: false,
    likes: 62,
    reactions: { love: 48, fire: 22, bulb: 19, agree: 30 },
    replies: [
      {
        id: 1201,
        authorName: 'Dr. Roberto Fontes',
        authorAvatar: 'R',
        createdAt: 'há 1 hora',
        content: 'Presença confirmadíssima! Separei três passagens do Conselho de Elrond para discutir.'
      }
    ]
  },

  // Posts VIP 4: Leitor Digital E-books
  {
    id: 13,
    channel: 'vip-digital',
    isVip: true,
    authorName: 'Felipe Cardoso',
    authorAvatar: 'F',
    authorBadge: 'Leitor Digital',
    createdAt: 'ontem',
    timestamp: Date.now() - 22 * 3600 * 1000,
    bookId: 3,
    bookTitle: '1984',
    bookAuthor: 'George Orwell',
    bookCover: 'https://covers.openlibrary.org/b/id/9267242-L.jpg',
    category: 'Guia de Leitura Digital',
    rating: 5,
    title: '📱 Guia de Leitura Interativo da Novilíngua em PDF disponível para download',
    content: 'Galera do plano digital: o curador disponibilizou no drive do clube o mapa mental interativo com a gramática e os apêndices de 1984. Ajudou demais a compreender a estrutura do vocabulário B e C. Recomendo muito baixarem!',
    quote: null,
    hasSpoiler: false,
    likes: 41,
    reactions: { love: 25, fire: 8, bulb: 18, agree: 14 },
    replies: []
  }
];

export default function ComunidadePage({ auth }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [userPlan, setUserPlan] = useState('none'); // 'none' | 'digital' | 'box-vip' | 'master'
  const [activeChannel, setActiveChannel] = useState('all');
  const [selectedBookFilter, setSelectedBookFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [userLikes, setUserLikes] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [revealedSpoilers, setRevealedSpoilers] = useState([]);
  const [openThreadPostId, setOpenThreadPostId] = useState(null);
  const [replyInputText, setReplyInputText] = useState({});

  // Estados da Enquete VIP
  const [pollVotes, setPollVotes] = useState({
    opt1: 42, // Fahrenheit 451
    opt2: 68, // Neuromancer
    opt3: 55, // Fundação (Isaac Asimov)
  });
  const [userPollChoice, setUserPollChoice] = useState(null);

  // Estados do Modal de Assinatura
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState('mensal'); // 'mensal' | 'anual'

  // Estados do Composer
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostChannel, setNewPostChannel] = useState('geral');
  const [newPostBookId, setNewPostBookId] = useState(1);
  const [newPostRating, setNewPostRating] = useState(5);
  const [newPostQuote, setNewPostQuote] = useState('');
  const [newPostSpoiler, setNewPostSpoiler] = useState(false);

  const composerRef = useRef(null);

  // Exibir Toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Carregar dados e sincronizar sessão de autenticação
  useEffect(() => {
    if (auth?.user) {
      setCurrentUser(auth.user);
      if (auth.user.plano_id && auth.user.plano_id !== 'visitante') {
        setUserPlan(auth.user.plano_id);
      }
    } else {
      try {
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setCurrentUser(parsed);
          if (parsed.plano_id && parsed.plano_id !== 'visitante') {
            setUserPlan(parsed.plano_id);
          }
        } else {
          setCurrentUser(null);
        }
      } catch (e) {
        setCurrentUser(null);
      }
    }

    try {
      // Ler plano salvo do usuário
      const savedSub = localStorage.getItem('bibliotech_user_subscription');
      if (savedSub) {
        const parsedSub = JSON.parse(savedSub);
        if (parsedSub.planId) {
          setUserPlan(parsedSub.planId);
        }
      }
    } catch (e) {}

    try {
      const savedPosts = localStorage.getItem('bibliotech_community_posts_v2');
      if (savedPosts) {
        const parsed = JSON.parse(savedPosts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPosts(parsed);
        }
      }

      const savedLikes = localStorage.getItem('bibliotech_community_likes');
      if (savedLikes) {
        setUserLikes(JSON.parse(savedLikes));
      }

      const savedPoll = localStorage.getItem('bibliotech_poll_choice');
      if (savedPoll) {
        setUserPollChoice(savedPoll);
      }
    } catch (e) {}
  }, [auth?.user]);

  // Salvar posts sincronizando com localStorage
  const savePosts = (newPosts) => {
    setPosts(newPosts);
    try {
      localStorage.setItem('bibliotech_community_posts_v2', JSON.stringify(newPosts));
    } catch (e) {}
  };

  // Checar permissão de acesso a um canal
  const hasAccessToChannel = (channelId) => {
    const vipChannel = VIP_CHANNELS.find((ch) => ch.id === channelId);
    if (!vipChannel) return true; // Canal público: acesso livre

    if (!userPlan || userPlan === 'none') return false;
    if (userPlan === 'master') return true; // Master tem acesso ilimitado

    if (vipChannel.tier === 'all-vip') return ['digital', 'box-vip', 'master'].includes(userPlan);
    if (vipChannel.tier === 'digital') return ['digital', 'master'].includes(userPlan);
    if (vipChannel.tier === 'box-vip') return ['box-vip', 'master'].includes(userPlan);
    if (vipChannel.tier === 'master') return userPlan === 'master';

    return false;
  };

  // Troca rápida de plano / Simulador VIP
  const handleSelectSimulatedPlan = async (planId) => {
    setUserPlan(planId);
    try {
      const subData = {
        planId,
        planName: CLUB_PLANS[planId]?.name || 'Visitante',
        updatedAt: Date.now()
      };
      localStorage.setItem('bibliotech_user_subscription', JSON.stringify(subData));
      if (currentUser) {
        const updated = { ...currentUser, plano_id: planId };
        setCurrentUser(updated);
        localStorage.setItem('userData', JSON.stringify(updated));
      }
    } catch (e) {}

    if (auth?.updatePlan && currentUser) {
      await auth.updatePlan(planId);
    }

    if (planId === 'none') {
      showToast('Visualizando como leitor visitante (canais VIP restritos).');
    } else {
      showToast(`🎉 Plano "${CLUB_PLANS[planId].name}" ativado com sucesso! Canais correspondentes desbloqueados.`);
    }
  };

  // Logout
  const handleLogout = () => {
    if (auth?.logout) {
      auth.logout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
    }
    window.dispatchEvent(new Event('storage'));
    setCurrentUser(null);
    setUserPlan('none');
    showToast('Você saiu da sua conta.');
  };

  // Acesso Rápido de Testes (1 Clique com credenciais oficiais)
  const handleQuickDemoLogin = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'elza@bibliotech.com', password: 'admin123' })
      });
      const data = await res.json();
      if (res.ok && data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        setCurrentUser(data.user);
        setUserPlan(data.user.plano_id || 'master');
        window.dispatchEvent(new Event('storage'));
        showToast(`👤 Conectado como ${data.user.full_name} (Mestre Supremo / Master)!`);
        return;
      }
    } catch (e) {}

    const demo = {
      id: 1795090887963,
      full_name: 'Elza',
      email: 'elza@bibliotech.com',
      plano_id: 'master',
      role: 'user'
    };
    localStorage.setItem('userData', JSON.stringify(demo));
    localStorage.setItem('token', 'demo-token');
    setCurrentUser(demo);
    setUserPlan('master');
    window.dispatchEvent(new Event('storage'));
    showToast('👤 Conectado como Elza (Mestre Supremo)!');
  };

  // Alterar Nome de Exibição do Usuário Ativo
  const handleEditUserName = () => {
    const currentName = currentUser?.full_name || 'Patrick Genovez';
    const newName = window.prompt('Digite o nome que deseja exibir na comunidade:', currentName);
    if (newName && newName.trim()) {
      const updated = {
        ...(currentUser || {}),
        id: currentUser?.id || 1,
        email: currentUser?.email || 'patrick@bibliotech.com',
        full_name: newName.trim()
      };
      localStorage.setItem('userData', JSON.stringify(updated));
      setCurrentUser(updated);
      showToast(`✨ Nome alterado com sucesso para "${newName.trim()}"!`);
    }
  };

  // Copiar Cupom
  const handleCopyCoupon = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      showToast(`🎟️ Cupom "${code}" copiado para a área de transferência!`);
    } else {
      showToast(`Cupom: ${code}`);
    }
  };

  // Votar na Enquete VIP
  const handleVotePoll = (optionKey) => {
    if (userPlan === 'none') {
      showToast('🔒 Enquete exclusiva para membros assinantes do Clube Bibliotech.');
      setIsSubscribeModalOpen(true);
      return;
    }

    if (userPollChoice === optionKey) return;

    setPollVotes((prev) => ({
      ...prev,
      [optionKey]: prev[optionKey] + 1
    }));
    setUserPollChoice(optionKey);
    try {
      localStorage.setItem('bibliotech_poll_choice', optionKey);
    } catch (e) {}
    showToast('🗳️ Seu voto foi computado na enquete da próxima caixa!');
  };

  // Reação com Emojis
  const handleReaction = (postId, reactionType) => {
    if (!currentUser) {
      showToast('Faça login para interagir com a comunidade.');
      return;
    }

    const likeKey = `${postId}_${reactionType}`;
    const hasReacted = userLikes.includes(likeKey);
    const updatedLikes = hasReacted
      ? userLikes.filter((key) => key !== likeKey)
      : [...userLikes, likeKey];

    setUserLikes(updatedLikes);
    try {
      localStorage.setItem('bibliotech_community_likes', JSON.stringify(updatedLikes));
    } catch (e) {}

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const currentReactions = post.reactions || { love: 0, fire: 0, bulb: 0, agree: 0 };
        const currentVal = currentReactions[reactionType] || 0;
        const newVal = hasReacted ? Math.max(0, currentVal - 1) : currentVal + 1;
        return {
          ...post,
          likes: hasReacted ? Math.max(0, (post.likes || 1) - 1) : (post.likes || 0) + 1,
          reactions: {
            ...currentReactions,
            [reactionType]: newVal
          }
        };
      }
      return post;
    });

    savePosts(updatedPosts);
  };

  // Alternar Revelação de Spoiler
  const toggleSpoiler = (postId) => {
    setRevealedSpoilers((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  // Enviar Nova Resposta na Thread
  const handleSendReply = (postId, e) => {
    e.preventDefault();
    const text = replyInputText[postId];
    if (!text || !text.trim()) return;

    if (!currentUser) {
      showToast('Faça login para responder aos leitores no canal.');
      return;
    }

    const authorName = currentUser.full_name || currentUser.name || currentUser.email.split('@')[0];
    const newReply = {
      id: Date.now(),
      authorName,
      authorAvatar: authorName[0].toUpperCase(),
      createdAt: 'agora mesmo',
      content: text.trim()
    };

    const updated = posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          replies: [...(p.replies || []), newReply]
        };
      }
      return p;
    });

    savePosts(updated);
    setReplyInputText((prev) => ({ ...prev, [postId]: '' }));
    showToast('💬 Resposta publicada na thread!');
  };

  // Publicar Novo Tópico / Mensagem
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Faça login para compartilhar no canal.');
      router.push('/login?tab=login');
      return;
    }

    if (!newPostTitle.trim() || !newPostContent.trim()) {
      showToast('Por favor, preencha o título e o conteúdo da mensagem.');
      return;
    }

    // Se for postar em canal VIP, valida permissão
    const isChannelVip = VIP_CHANNELS.some((ch) => ch.id === newPostChannel);
    if (isChannelVip && !hasAccessToChannel(newPostChannel)) {
      showToast('🔒 Você precisa ter a assinatura correspondente para postar nesta sala VIP.');
      setIsSubscribeModalOpen(true);
      return;
    }

    const attachedBook = STORE_BOOKS.find((b) => b.id === Number(newPostBookId));
    const authorName = currentUser.full_name || currentUser.name || currentUser.email.split('@')[0];

    // Badge VIP no autor se for assinante
    let authorBadge = 'Leitor Ativo';
    if (userPlan === 'master') authorBadge = '👑 Colecionador Master';
    else if (userPlan === 'box-vip') authorBadge = '📦 Membro Box VIP';
    else if (userPlan === 'digital') authorBadge = '📱 Leitor Digital';

    const newPost = {
      id: Date.now(),
      channel: newPostChannel,
      isVip: isChannelVip,
      authorName,
      authorAvatar: authorName[0].toUpperCase(),
      authorBadge,
      createdAt: 'agora mesmo',
      timestamp: Date.now(),
      bookId: attachedBook ? attachedBook.id : null,
      bookTitle: attachedBook ? attachedBook.title : null,
      bookAuthor: attachedBook ? attachedBook.author : null,
      bookCover: attachedBook ? attachedBook.cover : null,
      category: isChannelVip ? 'Debate Exclusivo de Assinante' : newPostChannel === 'resenhas' ? 'Resenha Completa' : 'Discussão Literária',
      rating: newPostRating,
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      quote: newPostQuote.trim() || null,
      hasSpoiler: newPostSpoiler,
      likes: 1,
      reactions: { love: 1, fire: 0, bulb: 0, agree: 0 },
      replies: []
    };

    const updated = [newPost, ...posts];
    savePosts(updated);

    // Limpar formulário
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostQuote('');
    setNewPostSpoiler(false);
    showToast('🎉 Mensagem publicada com sucesso no canal!');
  };

  // Filtragem dos Posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Filtro por canal
      if (activeChannel !== 'all' && post.channel !== activeChannel) {
        return false;
      }

      // Filtro por obra
      if (selectedBookFilter !== 'all' && post.bookId !== Number(selectedBookFilter)) {
        return false;
      }

      // Filtro por termo de busca
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = post.title?.toLowerCase().includes(query);
        const matchesContent = post.content?.toLowerCase().includes(query);
        const matchesAuthor = post.authorName?.toLowerCase().includes(query);
        const matchesBook = post.bookTitle?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesContent && !matchesAuthor && !matchesBook) {
          return false;
        }
      }

      return true;
    });
  }, [posts, activeChannel, selectedBookFilter, searchQuery]);

  // Obter canal VIP ativo atualmente (se houver)
  const currentVipChannel = VIP_CHANNELS.find((ch) => ch.id === activeChannel);
  const isCurrentChannelLocked = currentVipChannel && !hasAccessToChannel(activeChannel);

  // Total de votos na enquete
  const totalPollVotes = pollVotes.opt1 + pollVotes.opt2 + pollVotes.opt3;

  return (
    <div className={styles.pageWrapper}>
      <Head>
        <title>Canal de Comunicação dos Leitores & Área VIP • Bibliotech</title>
        <meta
          name="description"
          content="Conecte-se com milhares de leitores nos Canais Abertos e nas Salas VIP exclusivas de assinantes do Clube Bibliotech."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Toast de Feedback */}
      {toastMessage && (
        <div className={styles.toast}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Unificado da Bibliotech */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            {/* Logo */}
            <Link href="/" className={styles.logoGroup}>
              <div className={styles.logoBadge}>
                <Library size={22} className={styles.logoIcon} />
              </div>
              <div className={styles.logoTitleBlock}>
                <span className={styles.logoTitle}>BIBLIOTECH</span>
                <span className={styles.logoSubtitle}>Livraria & Clube Literário</span>
              </div>
            </Link>

            {/* Menu Nav Links */}
            <nav className={styles.navLinks}>
              <Link
                href="/"
                className={`${styles.navItem} ${router.pathname === '/' ? styles.navItemActive : ''}`}
              >
                Início
              </Link>
              <Link
                href="/catalogo"
                className={`${styles.navItem} ${router.pathname === '/catalogo' ? styles.navItemActive : ''}`}
              >
                Catálogo
              </Link>
              <Link
                href="/#planos-section"
                className={`${styles.navItem} ${router.asPath === '/#planos-section' ? styles.navItemActive : ''}`}
              >
                Clube do Livro
              </Link>
              <Link
                href="/comunidade"
                className={`${styles.navItem} ${router.pathname === '/comunidade' ? styles.navItemActive : ''}`}
              >
                <Users size={16} />
                <span>Comunidade</span>
                <span className={styles.navBadge}>Canal</span>
              </Link>
            </nav>

            {/* Ações: Perfil + Tema */}
            <div className={styles.headerActions}>
              {!currentUser ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    className={styles.btnQuickDemo}
                    title="Entrar com 1 clique usando perfil de teste para postar e responder"
                  >
                    <Sparkles size={14} />
                    <span>Acesso Rápido de Teste</span>
                  </button>
                  <Link href="/login?tab=login" className={styles.btnLogin}>
                    <LogIn size={15} />
                    <span>Entrar</span>
                  </Link>
                </div>
              ) : (
                <div className={styles.userLoggedGroup}>
                  <div
                    className={styles.userBadge}
                    onClick={handleEditUserName}
                    title="Clique para alterar seu nome de exibição na comunidade"
                  >
                    <div className={styles.userAvatar}>
                      {currentUser.full_name
                        ? currentUser.full_name[0].toUpperCase()
                        : currentUser.name
                        ? currentUser.name[0].toUpperCase()
                        : 'P'}
                    </div>
                    <span className={styles.userName}>
                      {currentUser.full_name
                        ? currentUser.full_name.split(' ')[0]
                        : currentUser.name
                        ? currentUser.name.split(' ')[0]
                        : 'Patrick'}
                    </span>
                    {userPlan && userPlan !== 'none' && (
                      <span className={styles.vipBadgeCurrent} style={{ padding: '2px 8px', fontSize: '0.68rem', borderRadius: '6px' }}>
                        {CLUB_PLANS[userPlan]?.name || userPlan}
                      </span>
                    )}
                    <Edit2 size={12} style={{ opacity: 0.6, marginLeft: '2px' }} />
                  </div>

                  <button
                    className={styles.btnLogout}
                    onClick={handleLogout}
                    title="Sair da conta"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              )}

              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* BARRA DE STATUS VIP DO ASSINANTE & SELETOR DE SIMULAÇÃO */}
      <div className={styles.vipStatusStrip}>
        <div className={styles.container}>
          <div className={styles.vipStatusContent}>
            <div className={styles.vipStatusLeft}>
              {userPlan !== 'none' ? (
                <span className={styles.vipBadgeCurrent}>
                  <Crown size={14} />
                  <span>{CLUB_PLANS[userPlan]?.name} Ativo</span>
                </span>
              ) : (
                <span className={`${styles.vipBadgeCurrent} ${styles.vipBadgeFree}`}>
                  <span>Forasteiro / Visitante</span>
                </span>
              )}

              <span className={styles.vipStatusText}>
                {userPlan === 'none'
                  ? 'Una-se aos Clãs Literários para desbloquear as Câmaras Secretas e tributos especiais.'
                  : `Sua honra de membro desbloqueia câmaras exclusivas e tributos de ouro na comunidade.`}
              </span>
            </div>

            {/* Simulador rápido para alternar/testar cada assinatura */}
            <div className={styles.vipSimulatorGroup}>
              <span className={styles.simulatorLabel}>Honra do Clã:</span>
              <button
                type="button"
                className={`${styles.btnSimulatorPill} ${userPlan === 'none' ? styles.btnSimulatorPillActive : ''}`}
                onClick={() => handleSelectSimulatedPlan('none')}
                title="Ver como Visitante"
              >
                Forasteiro
              </button>
              <button
                type="button"
                className={`${styles.btnSimulatorPill} ${userPlan === 'digital' ? styles.btnSimulatorPillActive : ''}`}
                onClick={() => handleSelectSimulatedPlan('digital')}
                title="Simular Plano Bardo Digital"
              >
                📱 Bardo
              </button>
              <button
                type="button"
                className={`${styles.btnSimulatorPill} ${userPlan === 'box-vip' ? styles.btnSimulatorPillActive : ''}`}
                onClick={() => handleSelectSimulatedPlan('box-vip')}
                title="Simular Plano Guarda do Box"
              >
                📦 Guarda Box
              </button>
              <button
                type="button"
                className={`${styles.btnSimulatorPill} ${userPlan === 'master' ? styles.btnSimulatorPillActive : ''}`}
                onClick={() => handleSelectSimulatedPlan('master')}
                title="Simular Mestre do Conselho"
              >
                👑 Mestre Supremo
              </button>

              <button
                type="button"
                className={styles.btnManagePlan}
                onClick={() => setIsSubscribeModalOpen(true)}
              >
                <Crown size={14} />
                <span>Honras & Alianças</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Banner do Salão dos Clãs Nórdicos */}
      <section className={styles.communityHero}>
        <div className={styles.container}>
          <div className={styles.heroCard}>
            {/* Runa nórdica ribbon */}
            <div className={styles.vikingRuneRibbon}>
              ᛟ • ᚲ • ᛒ • ᛉ • ᚠ • ᚦ • ᚺ • ᚨ • ᛗ • ᛞ
            </div>

            <div className={styles.heroTopRow}>
              <div className={styles.heroTagGroup}>
                <span className={styles.heroPillBadge}>
                  <Shield size={14} />
                  <span>Círculo dos Clãs & Salão de Debates</span>
                </span>
                <div className={styles.onlineBadge}>
                  <span className={styles.onlinePulse}></span>
                  <span>842 bardos conectados agora</span>
                </div>
              </div>

              <button
                type="button"
                className={styles.btnNewPostHero}
                onClick={() => {
                  composerRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Plus size={16} />
                <span>Registrar Pergaminho no Salão</span>
              </button>
            </div>

            <div className={styles.heroMainContent}>
              <div className={styles.heroTextGroup}>
                <h1 className={styles.heroTitle}>Círculo dos Clãs Literários</h1>
                <p className={styles.heroDesc}>
                  O santuário dos bardos, sábios e guardiões da palavra escrita. Compartilhe suas crônicas,
                  debata os segredos e profecias das obras, ou acesse as
                  <strong> Câmaras Secretas dos Clãs de Honra</strong> para conferir unboxings, spoilers liberados e audiências com autores.
                </p>
              </div>

              <div className={styles.heroStatsRow}>
                <div className={styles.heroStatBox}>
                  <span className={styles.heroStatNum}>+3.400</span>
                  <span className={styles.heroStatLabel}>Crônicas</span>
                </div>
                <div className={styles.heroStatBox}>
                  <span className={styles.heroStatNum}>4 Câmaras</span>
                  <span className={styles.heroStatLabel}>Exclusivas (VIP)</span>
                </div>
                <div className={styles.heroStatBox}>
                  <span className={styles.heroStatNum}>30% OFF</span>
                  <span className={styles.heroStatLabel}>Moedas de Honra</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Principal do Canal */}
      <main className={styles.container}>
        <div className={styles.communityGrid}>
          {/* COLUNA 1: TÁBUA DE RUNAS & CÂMARAS NOBRES */}
          <aside className={styles.leftSidebar}>
            {/* TÁBUA DE RUNAS (CANAIS PÚBLICOS) */}
            <div className={styles.channelsCard}>
              <div className={styles.channelsCardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className={styles.vikingShieldIcon}>
                    <Shield size={18} />
                  </div>
                  <div>
                    <span className={styles.channelsCardTitle}>Tábua de Runas</span>
                    <span style={{ fontSize: '0.70rem', color: 'var(--color-text-muted)', display: 'block' }}>Canais Abertos da Guilda</span>
                  </div>
                </div>
              </div>

              <div className={styles.channelsList}>
                {PUBLIC_CHANNELS.map((ch) => {
                  const Icon = ch.icon;
                  const isActive = activeChannel === ch.id;
                  const count =
                    ch.id === 'all'
                      ? posts.length
                      : posts.filter((p) => p.channel === ch.id).length;

                  return (
                    <button
                      key={ch.id}
                      type="button"
                      className={`${styles.channelItem} ${isActive ? styles.channelItemActive : ''}`}
                      onClick={() => setActiveChannel(ch.id)}
                      title={ch.desc}
                    >
                      <div className={styles.channelLeftGroup}>
                        <span className={styles.vikingRuneGlyph}>{ch.rune}</span>
                        <Icon size={16} />
                        <span>{ch.vikingLabel || ch.label}</span>
                      </div>
                      <span className={styles.channelBadgeCount}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CÂMARAS NOBRES (SALAS VIP) */}
            <div className={styles.vipChannelsCard}>
              <div className={styles.vipChannelsHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className={styles.vikingShieldIcon}>
                    <Crown size={18} />
                  </div>
                  <div>
                    <span className={styles.vipChannelsTitle}>Câmaras Nobres</span>
                    <span style={{ fontSize: '0.70rem', color: 'var(--color-text-muted)', display: 'block' }}>Salas Exclusivas dos Clãs</span>
                  </div>
                </div>
                <span className={styles.vipSectionBadge}>Honra VIP</span>
              </div>

              <div className={styles.channelsList}>
                {VIP_CHANNELS.map((ch) => {
                  const Icon = ch.icon;
                  const isActive = activeChannel === ch.id;
                  const isUnlocked = hasAccessToChannel(ch.id);
                  const count = posts.filter((p) => p.channel === ch.id).length;

                  return (
                    <button
                      key={ch.id}
                      type="button"
                      className={`${styles.vipChannelItem} ${isActive ? styles.vipChannelItemActive : ''}`}
                      onClick={() => setActiveChannel(ch.id)}
                      title={ch.desc}
                    >
                      <div className={styles.channelLeftGroup}>
                        <span className={styles.vikingRuneGlyph}>{ch.rune}</span>
                        <Icon size={16} />
                        <span>{ch.vikingLabel || ch.label}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={styles.channelBadgeCount}>{count}</span>
                        {isUnlocked ? (
                          <Unlock size={14} className={styles.vipUnlockIcon} title="Honra Liberada" />
                        ) : (
                          <Lock size={14} className={styles.vipLockIcon} title={`Requer aliança: ${ch.requiredPlanName}`} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filtro por Obra do Acervo */}
            <div className={styles.bookFilterCard}>
              <span className={styles.filterCardTitle}>
                <BookOpen size={14} />
                <span>Filtrar por Tomo do Acervo</span>
              </span>
              <select
                className={styles.bookSelect}
                value={selectedBookFilter}
                onChange={(e) => setSelectedBookFilter(e.target.value)}
              >
                <option value="all">Todos os Tomos ({posts.length} crônicas)</option>
                {STORE_BOOKS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} — {b.author}
                  </option>
                ))}
              </select>
            </div>

            {/* Selo Nórdico de Convivência */}
            <div className={styles.vikingSealNotice}>
              <ShieldCheck size={24} style={{ color: 'var(--color-gold-accent, #c69238)' }} />
              <span className={styles.vikingSealNoticeTitle}>Código dos Bardos</span>
              <p className={styles.vikingSealNoticeText}>
                Toda crônica compartilhada neste salão enriquece o saber dos clãs. Honre seus companheiros de leitura e mantenha os selos de spoiler intactos.
              </p>
            </div>
          </aside>

          {/* COLUNA 2: FEED CENTRAL DE MENSAGENS */}
          <section className={styles.feedColumn}>
            {/* Se o canal selecionado for VIP e estiver desbloqueado, exibe banner de boas-vindas */}
            {currentVipChannel && !isCurrentChannelLocked && (
              <div className={styles.vipActiveBanner}>
                <div className={styles.vipActiveBannerLeft}>
                  <div className={styles.vipActiveIconCircle}>
                    <Crown size={20} />
                  </div>
                  <div>
                    <h3 className={styles.vipActiveTitle}>
                      {currentVipChannel.label} • Acesso Liberado
                    </h3>
                    <p className={styles.vipActiveDesc}>
                      Você tem passe VIP nesta sala como membro <strong>{CLUB_PLANS[userPlan]?.name}</strong>.
                    </p>
                  </div>
                </div>

                <div className={styles.vipPerkPills}>
                  <span className={styles.vipPerkPill}>💬 Debate Restrito</span>
                  <span className={styles.vipPerkPill}>🎟️ Cupons Ativos</span>
                </div>
              </div>
            )}

            {/* SE O CANAL FOR VIP E ESTIVER BLOQUEADO: EXIBE A TELA DE PAYWALL ELEGANTE */}
            {isCurrentChannelLocked ? (
              <div className={styles.vipPaywallCard}>
                <div className={styles.vipLockAura}>
                  <Lock size={36} />
                </div>

                <span className={styles.vipPaywallReqBadge}>
                  <Shield size={13} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                  {currentVipChannel.requiredPlanName}
                </span>

                <h2 className={styles.vipPaywallTitle}>
                  Câmara Nobre dos Assinantes do Clã
                </h2>

                <p className={styles.vipPaywallDesc}>
                  O santuário <strong>{currentVipChannel.vikingLabel || currentVipChannel.label}</strong> é um espaço fechado para membros do Clube Bibliotech.
                  {' '}{currentVipChannel.desc}.
                </p>

                <div className={styles.vipPerksList}>
                  {currentVipChannel.perks.map((perk, i) => (
                    <div key={i} className={styles.vipPerkItem}>
                      <CheckCircle2 size={16} color="#e5b352" style={{ flexShrink: 0 }} />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.vipPaywallActions}>
                  <button
                    type="button"
                    className={styles.btnSubscribeVip}
                    onClick={() => setIsSubscribeModalOpen(true)}
                  >
                    <Crown size={17} />
                    <span>Conhecer Alianças & Forjar Pacto</span>
                  </button>

                  <button
                    type="button"
                    className={styles.btnSimulateVip}
                    onClick={() => {
                      // Ativa o plano necessário para simular teste imediato
                      const requiredTier = currentVipChannel.tier === 'all-vip' ? 'digital' : currentVipChannel.tier;
                      handleSelectSimulatedPlan(requiredTier);
                    }}
                  >
                    <Zap size={16} />
                    <span>Provar Honra do Canal (Simular Acesso)</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Barra de Busca */}
                <div className={styles.feedControlBar}>
                  <div className={styles.searchWrapper}>
                    <Search size={17} className={styles.searchIcon} />
                    <input
                      type="text"
                      placeholder="Buscar pergaminhos, profecias, bardos ou tomos sagrados..."
                      className={styles.searchInput}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* COMPOSER DE MENSAGEM / TÓPICO */}
                <div className={styles.composerCard} ref={composerRef}>
                  {currentUser ? (
                    <form onSubmit={handleCreatePost}>
                      <div className={styles.composerHeader}>
                        <div className={styles.composerAuthorGroup}>
                          <div className={styles.composerAuthorAvatar}>
                            {(currentUser.full_name || currentUser.name || 'U')[0].toUpperCase()}
                          </div>
                          <span className={styles.composerAuthorName}>
                            {currentUser.full_name || currentUser.name || 'Bardo do Clã'}
                          </span>
                        </div>

                        <span className={styles.composerChannelTag}>
                          Gravar em #{newPostChannel}
                        </span>
                      </div>

                      <input
                        type="text"
                        placeholder="Título da sua crônica ou resenha..."
                        className={styles.composerTitleInput}
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        required
                      />

                      <textarea
                        placeholder="Compartilhe suas palavras com os clãs: o que achou da trama, dos personagens, dos segredos ou do desfecho?"
                        className={styles.composerTextarea}
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        required
                      />

                      <div className={styles.composerOptionsRow}>
                        <div className={styles.composerSelectors}>
                          {/* Selecionar Canal */}
                          <select
                            className={styles.composerMiniSelect}
                            value={newPostChannel}
                            onChange={(e) => setNewPostChannel(e.target.value)}
                          >
                            <optgroup label="📜 Canais Públicos do Salão">
                              <option value="geral">ᚲ #crônicas-gerais</option>
                              <option value="resenhas">ᛒ #resenhas-dos-bardos</option>
                              <option value="teorias">ᛉ #profecias-e-spoilers</option>
                              <option value="indicacoes">ᚠ #indicações-sagradas</option>
                              <option value="citacoes">ᚦ #versos-e-citações</option>
                            </optgroup>
                            <optgroup label="👑 Câmaras Nobres (Guardiões & Mestres)">
                              <option value="vip-assinantes">🎟️ ᛟ #câmara-senhores-vip</option>
                              <option value="vip-digital">📱 ᛞ #bardo-digital-ebooks</option>
                              <option value="vip-box">📦 ᚺ #salão-box-capa-dura</option>
                              <option value="vip-master">👑 ᚨ #lounge-mestre-supremo</option>
                            </optgroup>
                          </select>

                          {/* Selecionar Livro */}
                          <select
                            className={styles.composerMiniSelect}
                            value={newPostBookId}
                            onChange={(e) => setNewPostBookId(Number(e.target.value))}
                          >
                            {STORE_BOOKS.map((b) => (
                              <option key={b.id} value={b.id}>
                                📜 {b.title}
                              </option>
                            ))}
                          </select>

                          {/* Avaliação em Estrelas */}
                          <div className={styles.composerRatingRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                fill={star <= newPostRating ? '#e5b352' : 'transparent'}
                                color={star <= newPostRating ? '#e5b352' : '#8c7b6c'}
                                onClick={() => setNewPostRating(star)}
                              />
                            ))}
                          </div>

                          {/* Toggle Spoiler */}
                          <label className={styles.composerSpoilerToggle}>
                            <input
                              type="checkbox"
                              checked={newPostSpoiler}
                              onChange={(e) => setNewPostSpoiler(e.target.checked)}
                            />
                            <span>⚠️ Runa de Revelação (Spoiler)</span>
                          </label>
                        </div>

                        <button type="submit" className={styles.btnSubmitPost}>
                          <Send size={15} />
                          <span>Selar & Publicar Pergaminho</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className={styles.guestNoticeCard}>
                      <div className={styles.guestNoticeText}>
                        <span className={styles.guestNoticeTitle}>
                          Participe do Salão dos Bardos e Leitores!
                        </span>
                        <span className={styles.guestNoticeDesc}>
                          Registre sua presença para compartilhar crônicas, desvendar profecias e debater com os clãs literários.
                        </span>
                      </div>
                      <Link href="/login?tab=login" className={styles.btnLogin}>
                        <LogIn size={15} />
                        <span>Apresentar-se ao Salão (Entrar)</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* LISTA DE POSTAGENS DO FEED */}
                <div className={styles.postsList}>
                  {filteredPosts.length === 0 ? (
                    <div className={styles.guestNoticeCard}>
                      <div className={styles.guestNoticeText}>
                        <span className={styles.guestNoticeTitle}>Nenhum pergaminho encontrado no salão</span>
                        <span className={styles.guestNoticeDesc}>
                          Não há crônicas gravadas neste canal ou com as runas pesquisadas. Seja o primeiro bardo a registrar suas palavras!
                        </span>
                      </div>
                    </div>
                  ) : (
                    filteredPosts.map((post) => {
                      const isSpoilerRevealed = revealedSpoilers.includes(post.id);
                      const isThreadOpen = openThreadPostId === post.id;
                      const replyText = replyInputText[post.id] || '';

                      return (
                        <article
                          key={post.id}
                          className={`${styles.postCard} ${post.isVip ? styles.postCardVip : ''}`}
                        >
                          {/* Cabeçalho do Post */}
                          <div className={styles.postHeader}>
                            <div className={styles.postAuthorBlock}>
                              <div className={styles.authorAvatar}>
                                {post.authorAvatar || post.authorName[0].toUpperCase()}
                              </div>
                              <div className={styles.authorMeta}>
                                <div className={styles.authorNameRow}>
                                  <span className={styles.authorName}>{post.authorName}</span>
                                  {post.authorBadge && (
                                    <span
                                      className={`${styles.authorBadge} ${
                                        post.isVip ? styles.authorBadgeVip : ''
                                      }`}
                                    >
                                      {post.authorBadge}
                                    </span>
                                  )}
                                </div>
                                <span className={styles.postTime}>{post.createdAt}</span>
                              </div>
                            </div>

                            <span
                              className={`${styles.postChannelPill} ${
                                post.isVip ? styles.postChannelPillVip : ''
                              }`}
                            >
                              #{post.channel || 'geral'}
                            </span>
                          </div>

                          {/* Livro Vinculado */}
                          {post.bookTitle && (
                            <div className={styles.postBookAttachment}>
                              {post.bookCover && (
                                <img
                                  src={getOptimizedCoverUrl(post.bookCover)}
                                  alt={post.bookTitle}
                                  className={styles.attachedCover}
                                  loading="lazy"
                                  decoding="async"
                                />
                              )}
                              <div className={styles.attachedBookInfo}>
                                <h4 className={styles.attachedTitle}>{post.bookTitle}</h4>
                                <p className={styles.attachedAuthor}>{post.bookAuthor}</p>
                              </div>
                              <Link href="/catalogo" className={styles.btnViewBookStore}>
                                Explorar Tomo no Acervo
                              </Link>
                            </div>
                          )}

                          {/* Conteúdo do Post */}
                          <div className={styles.postContentBlock}>
                            <h3 className={styles.postTitle}>{post.title}</h3>

                            {post.rating > 0 && (
                              <div className={styles.postRatingStars}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    size={14}
                                    fill={star <= post.rating ? '#e5b352' : 'transparent'}
                                    color={star <= post.rating ? '#e5b352' : '#695745'}
                                  />
                                ))}
                              </div>
                            )}

                            {/* Spoiler Box ou Conteúdo Aberto */}
                            {post.hasSpoiler && !isSpoilerRevealed ? (
                              <div
                                className={styles.spoilerBox}
                                onClick={() => toggleSpoiler(post.id)}
                                title="Romper o selo para ler a profecia"
                              >
                                ⚠️ Pergaminho lacrado com Runa de Segredo (SPOILERS). Toque para romper o selo e revelar a profecia.
                              </div>
                            ) : (
                              <p
                                className={`${styles.postText} ${
                                  post.hasSpoiler ? styles.spoilerRevealed : ''
                                }`}
                              >
                                {post.content}
                              </p>
                            )}

                            {/* Citação Destacada */}
                            {post.quote && (
                              <blockquote className={styles.quoteBlock}>
                                "{post.quote}"
                              </blockquote>
                            )}
                          </div>

                          {/* Barra de Reações e Botão de Respostas */}
                          <div className={styles.postActionBar}>
                            <div className={styles.reactionGroup}>
                              {/* ❤️ Honra */}
                              <button
                                type="button"
                                className={`${styles.btnReaction} ${
                                  userLikes.includes(`${post.id}_love`) ? styles.btnReactionActive : ''
                                }`}
                                onClick={() => handleReaction(post.id, 'love')}
                                title="Tributo de Honra"
                              >
                                <span>❤️</span>
                                <span>{post.reactions?.love || 0}</span>
                              </button>

                              {/* 🔥 Fogo Sagrado */}
                              <button
                                type="button"
                                className={`${styles.btnReaction} ${
                                  userLikes.includes(`${post.id}_fire`) ? styles.btnReactionActive : ''
                                }`}
                                onClick={() => handleReaction(post.id, 'fire')}
                                title="Fogo Sagrado do Debate"
                              >
                                <span>🔥</span>
                                <span>{post.reactions?.fire || 0}</span>
                              </button>

                              {/* 💡 Sabedoria */}
                              <button
                                type="button"
                                className={`${styles.btnReaction} ${
                                  userLikes.includes(`${post.id}_bulb`) ? styles.btnReactionActive : ''
                                }`}
                                onClick={() => handleReaction(post.id, 'bulb')}
                                title="Sabedoria Ancestral"
                              >
                                <span>💡</span>
                                <span>{post.reactions?.bulb || 0}</span>
                              </button>

                              {/* 👏 Glória */}
                              <button
                                type="button"
                                className={`${styles.btnReaction} ${
                                  userLikes.includes(`${post.id}_agree`) ? styles.btnReactionActive : ''
                                }`}
                                onClick={() => handleReaction(post.id, 'agree')}
                                title="Glória & Concordância Plena"
                              >
                                <span>👏</span>
                                <span>{post.reactions?.agree || 0}</span>
                              </button>
                            </div>

                            <button
                              type="button"
                              className={styles.btnToggleReplies}
                              onClick={() =>
                                setOpenThreadPostId(isThreadOpen ? null : post.id)
                              }
                            >
                              <MessageCircle size={15} />
                              <span>
                                {post.replies?.length || 0} ecos de resposta{' '}
                                {isThreadOpen ? '▲' : '▼'}
                              </span>
                            </button>
                          </div>

                          {/* Thread de Respostas Expansível */}
                          {isThreadOpen && (
                            <div className={styles.threadSection}>
                              {post.replies && post.replies.length > 0 && (
                                <div className={styles.repliesList}>
                                  {post.replies.map((reply) => (
                                    <div key={reply.id} className={styles.replyItem}>
                                      <div className={styles.replyAvatar}>
                                        {reply.authorAvatar || reply.authorName[0].toUpperCase()}
                                      </div>
                                      <div className={styles.replyBody}>
                                        <div className={styles.replyHeader}>
                                          <span className={styles.replyAuthor}>
                                            {reply.authorName}
                                          </span>
                                          <span className={styles.replyTime}>
                                            {reply.createdAt}
                                          </span>
                                        </div>
                                        <p className={styles.replyText}>{reply.content}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Input de Enviar Resposta */}
                              <form
                                onSubmit={(e) => handleSendReply(post.id, e)}
                                className={styles.replyInputForm}
                              >
                                <input
                                  type="text"
                                  placeholder={`Gravar resposta para @${post.authorName}...`}
                                  className={styles.replyInput}
                                  value={replyText}
                                  onChange={(e) =>
                                    setReplyInputText({
                                      ...replyInputText,
                                      [post.id]: e.target.value
                                    })
                                  }
                                />
                                <button type="submit" className={styles.btnSendReply}>
                                  Ecoar Resposta
                                </button>
                              </form>
                            </div>
                          )}
                        </article>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </section>

          {/* COLUNA 3: WIDGETS DA COMUNIDADE & BENEFÍCIOS DOS ASSINANTES */}
          <aside className={styles.rightSidebar}>
            {/* ENQUETE EXCLUSIVA DOS ASSINANTES */}
            <div className={`${styles.widgetCard} ${styles.widgetCardGold}`}>
              <span className={`${styles.widgetTitle} ${styles.widgetTitleGold}`}>
                <Crown size={16} />
                <span>Enquete dos Senhores do Clã</span>
              </span>

              <p className={styles.pollQuestion}>
                🗳️ <strong>Qual clássico em Edição de Luxo com encadernação nobre você quer na próxima remessa do Clube?</strong>
              </p>

              <div className={styles.pollOptionsList}>
                {/* Opção 1: Fahrenheit 451 */}
                <button
                  type="button"
                  className={`${styles.pollOptionBtn} ${userPollChoice === 'opt1' ? styles.pollOptionSelected : ''}`}
                  onClick={() => handleVotePoll('opt1')}
                >
                  <div className={styles.pollOptionHeader}>
                    <span className={styles.pollOptionLabel}>Fahrenheit 451</span>
                    <span className={styles.pollOptionVotes}>
                      {Math.round((pollVotes.opt1 / totalPollVotes) * 100)}% ({pollVotes.opt1})
                    </span>
                  </div>
                  <div
                    className={styles.pollProgressBar}
                    style={{ width: `${(pollVotes.opt1 / totalPollVotes) * 100}%` }}
                  />
                </button>

                {/* Opção 2: Neuromancer */}
                <button
                  type="button"
                  className={`${styles.pollOptionBtn} ${userPollChoice === 'opt2' ? styles.pollOptionSelected : ''}`}
                  onClick={() => handleVotePoll('opt2')}
                >
                  <div className={styles.pollOptionHeader}>
                    <span className={styles.pollOptionLabel}>Neuromancer</span>
                    <span className={styles.pollOptionVotes}>
                      {Math.round((pollVotes.opt2 / totalPollVotes) * 100)}% ({pollVotes.opt2})
                    </span>
                  </div>
                  <div
                    className={styles.pollProgressBar}
                    style={{ width: `${(pollVotes.opt2 / totalPollVotes) * 100}%` }}
                  />
                </button>

                {/* Opção 3: Fundação */}
                <button
                  type="button"
                  className={`${styles.pollOptionBtn} ${userPollChoice === 'opt3' ? styles.pollOptionSelected : ''}`}
                  onClick={() => handleVotePoll('opt3')}
                >
                  <div className={styles.pollOptionHeader}>
                    <span className={styles.pollOptionLabel}>Fundação (Asimov)</span>
                    <span className={styles.pollOptionVotes}>
                      {Math.round((pollVotes.opt3 / totalPollVotes) * 100)}% ({pollVotes.opt3})
                    </span>
                  </div>
                  <div
                    className={styles.pollProgressBar}
                    style={{ width: `${(pollVotes.opt3 / totalPollVotes) * 100}%` }}
                  />
                </button>
              </div>

              <div className={styles.pollFooter}>
                <span>Total de {totalPollVotes} votos dos membros do clã</span>
              </div>
            </div>

            {/* MURAL DE CUPONS DOS ASSINANTES */}
            <div className={`${styles.widgetCard} ${styles.widgetCardGold}`}>
              <span className={`${styles.widgetTitle} ${styles.widgetTitleGold}`}>
                <Tag size={16} />
                <span>Mural de Cupons de Honra</span>
              </span>

              <div className={styles.couponBox}>
                <div>
                  <div className={styles.couponCode}>CLUBE20</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                    20% OFF em qualquer tomo do acervo
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.btnCopyCoupon}
                  onClick={() => handleCopyCoupon('CLUBE20')}
                >
                  Copiar Código
                </button>
              </div>

              <div className={styles.couponBox}>
                <div>
                  <div className={styles.couponCode}>MASTER30</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                    30% OFF (Exclusivo Mestre do Conselho)
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.btnCopyCoupon}
                  onClick={() => handleCopyCoupon('MASTER30')}
                >
                  Copiar Código
                </button>
              </div>
            </div>

            {/* Top Leitores da Semana */}
            <div className={styles.widgetCard}>
              <span className={styles.widgetTitle}>
                <Award size={16} />
                <span>Bardos em Destaque na Semana</span>
              </span>

              <div className={styles.rankingList}>
                <div className={styles.rankingItem}>
                  <div className={styles.rankingLeft}>
                    <span className={styles.rankingPosition}>🥇</span>
                    <span className={styles.rankingName}>Mariana Silva</span>
                  </div>
                  <span className={styles.rankingPoints}>1.420 runas</span>
                </div>

                <div className={styles.rankingItem}>
                  <div className={styles.rankingLeft}>
                    <span className={styles.rankingPosition}>🥈</span>
                    <span className={styles.rankingName}>Lucas Ferreira</span>
                  </div>
                  <span className={styles.rankingPoints}>1.180 runas</span>
                </div>

                <div className={styles.rankingItem}>
                  <div className={styles.rankingLeft}>
                    <span className={styles.rankingPosition}>🥉</span>
                    <span className={styles.rankingName}>Camila Rocha</span>
                  </div>
                  <span className={styles.rankingPoints}>940 runas</span>
                </div>

                <div className={styles.rankingItem}>
                  <div className={styles.rankingLeft}>
                    <span className={styles.rankingPosition}>4º</span>
                    <span className={styles.rankingName}>Thiago Mendes</span>
                  </div>
                  <span className={styles.rankingPoints}>820 runas</span>
                </div>
              </div>
            </div>

            {/* Livro do Mês no Clube VIP */}
            <div className={styles.widgetCard}>
              <span className={styles.widgetTitle}>
                <Coffee size={16} />
                <span>Tomo Sagrado do Mês no Clã</span>
              </span>

              <div className={styles.clubSpotlightCard}>
                <img
                  src={getOptimizedCoverUrl("https://covers.openlibrary.org/b/id/11149234-M.jpg")}
                  alt="Duna"
                  className={styles.clubSpotlightCover}
                  loading="lazy"
                  decoding="async"
                />
                <div className={styles.clubSpotlightInfo}>
                  <h4 className={styles.clubSpotlightTitle}>Duna</h4>
                  <p className={styles.clubSpotlightAuthor}>Frank Herbert</p>
                  <span className={styles.clubSpotlightGoal}>
                    Meta do Clã: Capítulos 1 a 12
                  </span>
                </div>
              </div>
            </div>

            {/* Diretrizes de Boa Convivência */}
            <div className={styles.widgetCard}>
              <span className={styles.widgetTitle}>
                <ShieldCheck size={16} />
                <span>Código de Honra do Salão</span>
              </span>

              <div className={styles.guidelineItem}>
                <span>🤝</span>
                <span>Respeito sagrado com as interpretações e visões de todos os bardos.</span>
              </div>
              <div className={styles.guidelineItem}>
                <span>⚠️</span>
                <span>Sempre sele com a Runa de Spoiler os trechos que revelam o clímax e finais.</span>
              </div>
              <div className={styles.guidelineItem}>
                <span>🔒</span>
                <span>Sigilo absoluto nas deliberações das Câmaras Nobres com autores.</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ===== MODAL DE ASSINATURA / UPGRADE DO CLUBE LITERÁRIO ===== */}
      {isSubscribeModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsSubscribeModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <h2 className={styles.modalTitle}>
                  <Crown size={24} color="#e5b352" />
                  <span>Alianças & Ordens do Clube Bibliotech</span>
                </h2>
                <p className={styles.modalSubtitle}>
                  Escolha o seu grau de honra e desbloqueie acesso imediato às Câmaras Secretas dos Clãs Literários.
                </p>
              </div>

              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsSubscribeModalOpen(false)}
                title="Fechar"
              >
                ✕
              </button>
            </div>

            {/* Grid dos 3 Planos */}
            <div className={styles.modalPlansGrid}>
              {/* 1. Leitor Digital */}
              <div
                className={`${styles.modalPlanCard} ${
                  userPlan === 'digital' ? styles.modalPlanCardFeatured : ''
                }`}
              >
                <div>
                  <span className={styles.modalPlanBadge}>ᛞ Bardo Digital</span>
                  <h3 className={styles.modalPlanName}>Bardo Digital</h3>
                  <div className={styles.modalPlanPriceRow}>
                    <span className={styles.modalPlanPriceCurrency}>R$</span>
                    <span className={styles.modalPlanPriceValue}>24,90</span>
                    <span className={styles.modalPlanPricePeriod}>/mês</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
                    Acesso a debates de e-books, clube mensal digital e tomos sagrados em formato digital.
                  </p>

                  <div className={styles.modalPlanPerksList}>
                    <div className={styles.modalPlanPerkItem}>
                      <Check size={16} />
                      <span>Desbloqueia ᛞ #bardo-digital-ebooks</span>
                    </div>
                    <div className={styles.modalPlanPerkItem}>
                      <Check size={16} />
                      <span>Desbloqueia ᛟ #câmara-senhores-vip</span>
                    </div>
                    <div className={styles.modalPlanPerkItem}>
                      <Check size={16} />
                      <span>Tributo de 10% OFF vitalício no acervo</span>
                    </div>
                    <div className={styles.modalPlanPerkItem}>
                      <Check size={16} />
                      <span>Acesso aos pergaminhos e guias de leitura</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`${styles.btnConfirmPlanChoice} ${
                    userPlan === 'digital' ? styles.btnPlanCurrent : ''
                  }`}
                  onClick={() => {
                    handleSelectSimulatedPlan('digital');
                    setIsSubscribeModalOpen(false);
                  }}
                  disabled={userPlan === 'digital'}
                >
                  {userPlan === 'digital' ? 'Seu Pacto Atual' : 'Forjar Aliança Bardo Digital'}
                </button>
              </div>

              {/* 2. Box VIP Capa Dura */}
              <div
                className={`${styles.modalPlanCard} ${styles.modalPlanCardFeatured}`}
              >
                <div>
                  <span className={`${styles.modalPlanBadge} ${styles.modalPlanBadgeGold}`}>
                    Mais Escolhido • Ordem do Box Nobre
                  </span>
                  <h3 className={styles.modalPlanName}>Guarda do Box Nobre</h3>
                  <div className={styles.modalPlanPriceRow}>
                    <span className={styles.modalPlanPriceCurrency}>R$</span>
                    <span className={styles.modalPlanPriceValue}>69,90</span>
                    <span className={styles.modalPlanPricePeriod}>/mês</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
                    1 Tomo sagrado surpresa em capa dura por mês, 3 relíquias colecionáveis e câmara com spoilers liberados.
                  </p>

                  <div className={styles.modalPlanPerksList}>
                    <div className={styles.modalPlanPerkItem}>
                      <Check size={16} />
                      <span>Desbloqueia ᚺ #salão-box-capa-dura</span>
                    </div>
                    <div className={styles.modalPlanPerkItem}>
                      <Check size={16} />
                      <span>Desbloqueia ᛟ #câmara-senhores-vip</span>
                    </div>
                    <div className={styles.modalPlanPerkItem}>
                      <Check size={16} />
                      <span>Tributo de 20% OFF vitalício no acervo</span>
                    </div>
                    <div className={styles.modalPlanPerkItem}>
                      <Check size={16} />
                      <span>Voto na escolha da próxima remessa de tomos</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`${styles.btnConfirmPlanChoice} ${styles.btnConfirmPlanChoiceGold} ${
                    userPlan === 'box-vip' ? styles.btnPlanCurrent : ''
                  }`}
                  onClick={() => {
                    handleSelectSimulatedPlan('box-vip');
                    setIsSubscribeModalOpen(false);
                  }}
                  disabled={userPlan === 'box-vip'}
                >
                  {userPlan === 'box-vip' ? 'Seu Pacto Atual' : 'Selar Pacto do Box Nobre'}
                </button>
              </div>

              {/* 3. Colecionador Master */}
              <div
                className={`${styles.modalPlanCard} ${
                  userPlan === 'master' ? styles.modalPlanCardFeatured : ''
                }`}
              >
                <div>
                  <span className={`${styles.modalPlanBadge} ${styles.modalPlanBadgeGold}`}>
                    Grau Máximo • Ordem Suprema
                  </span>
                  <h3 className={styles.modalPlanName}>Mestre do Conselho Supremo</h3>
                  <div className={styles.modalPlanPriceRow}>
                    <span className={styles.modalPlanPriceCurrency}>R$</span>
                    <span className={styles.modalPlanPriceValue}>119,90</span>
                    <span className={styles.modalPlanPricePeriod}>/mês</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
                    Passe supremo a todas as câmaras, 2 tomos sagrados numerados e audiências virtuais com grandes autores.
                  </p>

                  <div className={styles.modalPlanPerksList}>
                    <div className={styles.modalPlanPerkItem}>
                      <Check size={16} />
                      <span>Passe Supremo: Acesso a TODAS as câmaras nobres</span>
                    </div>
                    <div className={styles.modalPlanPerkItem}>
                      <Check size={16} />
                      <span>Audiências exclusivas com autores consagrados</span>
                    </div>
                    <div className={styles.modalPlanPerkItem}>
                      <Check size={16} />
                      <span>Tributo Supremo de 30% OFF vitalício</span>
                    </div>
                    <div className={styles.modalPlanPerkItem}>
                      <Check size={16} />
                      <span>Conselho direto com os curadores da Bibliotech</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`${styles.btnConfirmPlanChoice} ${styles.btnConfirmPlanChoiceGold} ${
                    userPlan === 'master' ? styles.btnPlanCurrent : ''
                  }`}
                  onClick={() => {
                    handleSelectSimulatedPlan('master');
                    setIsSubscribeModalOpen(false);
                  }}
                  disabled={userPlan === 'master'}
                >
                  {userPlan === 'master' ? 'Seu Pacto Atual' : 'Ascender a Mestre Supremo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <span>
              &copy; {new Date().getFullYear()} Bibliotech Livraria & Clube Literário • Salão dos Clãs, Câmaras Nobres & Pergaminhos de Leitores.
            </span>
            <Link href="/catalogo" className={styles.footerLink}>
              ← Retornar ao Grande Salão da Loja & Catálogo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
