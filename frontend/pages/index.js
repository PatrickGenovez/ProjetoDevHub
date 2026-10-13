import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Library,
  BookOpen,
  Star,
  Search,
  Plus,
  Minus,
  Filter,
  CheckCircle2,
  Bookmark,
  Calendar,
  User,
  FileText,
  X,
  ChevronRight,
  Sparkles,
  Heart,
  ArrowUpDown,
  Globe,
  Download,
  ExternalLink,
  Wand2,
  Loader2,
  LogIn,
  LogOut,
  UserPlus,
  BookMarked,
  Layers,
  ArrowRight,
  Shield,
  Zap,
  Users,
  Compass,
  Quote,
  Clock,
  Award,
  SlidersHorizontal,
  Film,
  Check,
  ShoppingBag,
  ShoppingCart,
  Truck,
  CreditCard,
  Tag,
  Package,
  Trash2,
  Gift,
  ShieldCheck,
  Percent,
  CheckCircle,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import ThemeToggle from '../components/menu/ThemeToggle';
import styles from '../styles/index.module.css';

// Catálogo inicial padrão da livraria com atributos de e-commerce
const DEFAULT_BOOKS = [
  {
    id: 1,
    title: 'Duna',
    author: 'Frank Herbert',
    genre: 'Ficção Científica',
    rating: 4.9,
    reviewsCount: 1840,
    price: 59.90,
    originalPrice: 89.90,
    discountPercent: 33,
    stock: 24,
    badge: 'Mais Vendido',
    format: 'Capa Dura',
    synopsis: 'Em um futuro distante, o jovem Paul Atreides é herdeiro de uma família nobre enviada para governar o inóspito planeta desértico Arrakis, a única fonte da substância mais valiosa do universo, a especiaria mélange.',
    year: 1965,
    pages: 680,
    status: 'Disponível',
    coverImage: 'https://books.google.com/books/content?id=B1hSGwAACAAJ&printsec=frontcover&img=1&zoom=1',
    coverGradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #064e3b 100%)',
    accentColor: '#10b981'
  },
  {
    id: 2,
    title: 'O Senhor dos Anéis: A Sociedade do Anel',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasia',
    rating: 5.0,
    reviewsCount: 2410,
    price: 69.90,
    originalPrice: 99.90,
    discountPercent: 30,
    stock: 18,
    badge: 'Destaque',
    format: 'Edição Especial',
    synopsis: 'Frodo Bolseiro, um hobbit da pacata Comarca, herda um anel mágico ancestral e descobre que ele tem o poder de escravizar toda a Terra-média nas mãos do Senhor do Escuro, Sauron.',
    year: 1954,
    pages: 576,
    status: 'Disponível',
    coverImage: 'https://covers.openlibrary.org/b/id/14547565-M.jpg',
    coverGradient: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #064e3b 100%)',
    accentColor: '#34d399'
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    genre: 'Distopia',
    rating: 4.8,
    reviewsCount: 3150,
    price: 34.90,
    originalPrice: 49.90,
    discountPercent: 30,
    stock: 45,
    badge: 'Super Oferta',
    format: 'Brochura',
    synopsis: 'Em uma sociedade totalitária dominada pelo Partido e pelo onipresente Grande Irmão, Winston Smith trabalha no Ministério da Verdade reescrevendo a história, mas começa secretamente a questionar o regime.',
    year: 1949,
    pages: 336,
    status: 'Disponível',
    coverImage: 'https://covers.openlibrary.org/b/id/7222246-M.jpg',
    coverGradient: 'linear-gradient(135deg, #059669 0%, #047857 50%, #022c22 100%)',
    accentColor: '#059669'
  },
  {
    id: 4,
    title: 'Código Limpo (Clean Code)',
    author: 'Robert C. Martin',
    genre: 'Tecnologia',
    rating: 4.7,
    reviewsCount: 980,
    price: 84.90,
    originalPrice: 119.00,
    discountPercent: 28,
    stock: 12,
    badge: 'Mais Vendido',
    format: 'Brochura Premium',
    synopsis: 'Um guia fundamental sobre boas práticas de engenharia de software, mostrando como escrever código legível, modular e de fácil manutenção através de princípios de refatoração, nomes significativos e testes automatizados.',
    year: 2008,
    pages: 464,
    status: 'Disponível',
    coverImage: '',
    coverGradient: 'linear-gradient(135deg, #10b981 0%, #047857 50%, #064e3b 100%)',
    accentColor: '#10b981'
  },
  {
    id: 5,
    title: 'O Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasia',
    rating: 4.9,
    reviewsCount: 1620,
    price: 49.90,
    originalPrice: 65.00,
    discountPercent: 23,
    stock: 22,
    badge: 'Lançamento',
    format: 'Capa Dura',
    synopsis: 'Bilbo Bolseiro vive uma vida tranquila no Condado até ser surpreendido pelo mago Gandalf e uma companhia de treze anões para recuperar um tesouro guardado pelo temível dragão Smaug.',
    year: 1937,
    pages: 310,
    status: 'Disponível',
    coverImage: 'https://covers.openlibrary.org/b/id/12003528-M.jpg',
    coverGradient: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 50%, #134e4a 100%)',
    accentColor: '#14b8a6'
  },
  {
    id: 6,
    title: 'Neuromancer',
    author: 'William Gibson',
    genre: 'Ficção Científica',
    rating: 4.6,
    reviewsCount: 890,
    price: 44.90,
    originalPrice: 59.90,
    discountPercent: 25,
    stock: 15,
    badge: 'Clássico Cyberpunk',
    format: 'Brochura',
    synopsis: 'Case é um cowboy do ciberespaço que foi banido da rede neural após trair seus empregadores. Uma oportunidade misteriosa surge para recuperar sua conexão em troca de uma última invasão hacker de alto risco.',
    year: 1984,
    pages: 320,
    status: 'Disponível',
    coverImage: '',
    coverGradient: 'linear-gradient(135deg, #059669 0%, #047857 50%, #064e3b 100%)',
    accentColor: '#059669'
  },
  {
    id: 7,
    title: 'O Silêncio dos Inocentes',
    author: 'Thomas Harris',
    genre: 'Suspense',
    rating: 4.8,
    reviewsCount: 1120,
    price: 39.90,
    originalPrice: 54.90,
    discountPercent: 27,
    stock: 30,
    badge: 'Adaptação de Sucesso',
    format: 'Brochura',
    synopsis: 'A jovem estagiária do FBI Clarice Starling deve interrogar o brilhante psiquiatra e assassino em série Dr. Hannibal Lecter para obter pistas sobre um novo criminoso que aterroriza o país.',
    year: 1988,
    pages: 368,
    status: 'Disponível',
    coverImage: '',
    coverGradient: 'linear-gradient(135deg, #047857 0%, #065f46 50%, #022c22 100%)',
    accentColor: '#047857'
  },
  {
    id: 8,
    title: 'O Pequeno Príncipe',
    author: 'Antoine de Saint-Exupéry',
    genre: 'Clássicos',
    rating: 4.9,
    reviewsCount: 4300,
    price: 24.90,
    originalPrice: 35.00,
    discountPercent: 28,
    stock: 60,
    badge: 'Mais Vendido',
    format: 'Capa Dura Ilustrada',
    synopsis: 'Um piloto cai no deserto do Saara e encontra um menino misterioso vindo de um asteroide distante. Uma fábula poética sobre amizade, amor, perda e o que é verdadeiramente essencial aos olhos.',
    year: 1943,
    pages: 96,
    status: 'Disponível',
    coverImage: 'https://covers.openlibrary.org/b/id/10574187-M.jpg',
    coverGradient: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #065f46 100%)',
    accentColor: '#10b981'
  }
];

// Planos de Assinatura do Clube Literário
const SUBSCRIPTION_PLANS = [
  {
    id: 'digital',
    name: 'Leitor Digital',
    badge: 'Iniciante',
    monthlyPrice: 24.90,
    annualPrice: 19.90,
    description: 'Ideal para quem ama ler no Kindle, tablet ou celular onde quer que vá.',
    features: [
      'Acesso ilimitado a +5.000 e-books no app',
      'Clube de debate literário online mensal',
      '10% de desconto em qualquer livro físico da loja',
      'Newsletter semanal com recomendações de curadores',
      'Cancelamento fácil a qualquer momento'
    ],
    popular: false,
    ctaText: 'Assinar Leitor Digital'
  },
  {
    id: 'box-vip',
    name: 'Box VIP Capa Dura',
    badge: 'Mais Popular • Clube do Livro',
    monthlyPrice: 69.90,
    annualPrice: 59.90,
    description: 'A experiência literária mais amada: livro surpresa selecionado a dedo e mimos colecionáveis.',
    features: [
      '1 Livro físico surpresa em Capa Dura por mês',
      '3 Mimos literários colecionáveis (pin, marcador, ecobag)',
      'Revista guia de leitura exclusiva com entrevistas',
      '20% de desconto em todo o catálogo da livraria',
      'Frete Grátis nacional garantido',
      'Acesso antecipado a pré-vendas de grandes autores'
    ],
    popular: true,
    ctaText: 'Quero o Box VIP'
  },
  {
    id: 'master',
    name: 'Colecionador Master',
    badge: 'Edição Premium',
    monthlyPrice: 119.90,
    annualPrice: 99.90,
    description: 'Para bibliófilos exigentes que buscam edições de luxo numeradas e itens de coleção.',
    features: [
      '2 Livros físicos em Edições Especiais / Luxo numeradas',
      'Kit completo com 5 brindes premium temáticos',
      'Encontros virtuais fechados com autores e tradutores',
      '30% de desconto vitalício em qualquer livro da loja',
      'Frete Expresso Grátis prioritário',
      'Embalagem de luxo rígida com acabamento aveludado'
    ],
    popular: false,
    ctaText: 'Assinar Colecionador Master'
  }
];

// Gêneros disponíveis para pesquisa e recomendações
const AVAILABLE_GENRES = [
  { id: 'Ficção Científica', name: 'Ficção Científica', icon: '🚀', desc: 'Exploração espacial, futuros e distopias' },
  { id: 'Fantasia', name: 'Fantasia', icon: '🧙‍♂️', desc: 'Mundos mágicos, seres épicos e lendas' },
  { id: 'Distopia', name: 'Distopia', icon: '🏙️', desc: 'Sociedades futuristas e regimes totalitários' },
  { id: 'Tecnologia', name: 'Tecnologia & Código', icon: '💻', desc: 'Programação, engenharia de software e IA' },
  { id: 'Suspense', name: 'Suspense & Mistério', icon: '🕵️', desc: 'Investigações, thrillers e enigmas' },
  { id: 'Clássicos', name: 'Clássicos da Literatura', icon: '📜', desc: 'Obras fundamentais e imortais' },
  { id: 'Cinema & Adaptações', name: 'Cinema & Adaptações', icon: '🎬', desc: 'Grandes obras adaptadas para filmes e séries' },
  { id: 'Romance', name: 'Romance & Paixão', icon: '💖', desc: 'Relações humanas, dramas e sentimentos' },
  { id: 'Aventura', name: 'Ação & Aventura', icon: '🧭', desc: 'Jornadas eletrizantes e grandes expedições' }
];

export default function BookStore() {
  const [books, setBooks] = useState(DEFAULT_BOOKS);
  const [searchSource, setSearchSource] = useState('local'); // 'local' | 'google' | 'openlibrary'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [sortBy, setSortBy] = useState('sales'); // 'sales' | 'price-asc' | 'price-desc' | 'rating' | 'title'
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Estados do Carrinho / Sacola de Compras
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Estados de Checkout Simulado
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('form'); // 'form' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('pix'); // 'pix' | 'credit' | 'boleto'
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    cep: '01310-100',
    address: 'Av. Paulista, 1000 - Apto 42',
    city: 'São Paulo - SP'
  });

  // Estados dos Planos de Assinatura
  const [billingCycle, setBillingCycle] = useState('mensal'); // 'mensal' | 'anual'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planForm, setPlanForm] = useState({ name: '', email: '' });

  // Estados de Pesquisa de Gêneros & Sistema de Recomendações
  const [preferredGenres, setPreferredGenres] = useState([]);
  const [preferredFormat, setPreferredFormat] = useState('Todos');
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [hasAnsweredSurvey, setHasAnsweredSurvey] = useState(false);
  const [filterOnlyPreferred, setFilterOnlyPreferred] = useState(false);

  // Estados de APIs Externas
  const [apiBooks, setApiBooks] = useState([]);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [autofillQuery, setAutofillQuery] = useState('');
  const [isAutofilling, setIsAutofilling] = useState(false);

  // Form para cadastro de novo livro para venda
  const [newBookForm, setNewBookForm] = useState({
    title: '',
    author: '',
    genre: 'Ficção Científica',
    rating: '5.0',
    price: '49.90',
    originalPrice: '69.90',
    format: 'Capa Dura',
    stock: '20',
    badge: 'Novidade',
    synopsis: '',
    year: '2024',
    pages: '320',
    coverImage: ''
  });

  // Carregar dados salvos no localStorage e disparar a pesquisa de preferências se for nova visita
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/books`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            setBooks(json.data);
            return;
          }
        }
      } catch (err) {}

      const saved = localStorage.getItem('bibliotech_books');
      if (saved) {
        try {
          setBooks(JSON.parse(saved));
        } catch (e) {}
      }
    };

    fetchBooks();

    try {
      const savedFavs = JSON.parse(localStorage.getItem('bibliotech_favs') || '[]');
      setFavorites(savedFavs);
    } catch (e) {}

    try {
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (e) {}

    try {
      const savedPrefs = JSON.parse(localStorage.getItem('bibliotech_preferred_genres') || '[]');
      if (Array.isArray(savedPrefs) && savedPrefs.length > 0) {
        setPreferredGenres(savedPrefs);
      }
      const savedFmt = localStorage.getItem('bibliotech_preferred_format');
      if (savedFmt) setPreferredFormat(savedFmt);

      const answered = localStorage.getItem('bibliotech_survey_answered');
      if (answered === 'true') {
        setHasAnsweredSurvey(true);
      } else {
        // Dispara a pesquisa de boas-vindas automaticamente para o usuário
        const timer = setTimeout(() => {
          setIsSurveyModalOpen(true);
        }, 850);
        return () => clearTimeout(timer);
      }
    } catch (e) {}

    try {
      const savedCart = JSON.parse(localStorage.getItem('bibliotech_cart') || '[]');
      if (Array.isArray(savedCart)) {
        setCart(savedCart);
      }
    } catch (e) {}
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem('bibliotech_cart', JSON.stringify(newCart));
    } catch (e) {}
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setCurrentUser(null);
    showToast('Você saiu da sua conta.');
  };

  const updateBooks = (updatedList) => {
    setBooks(updatedList);
    try {
      localStorage.setItem('bibliotech_books', JSON.stringify(updatedList));
    } catch (e) {}
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Favoritar
  const toggleFavorite = (bookId, e) => {
    if (e) e.stopPropagation();
    const isFav = favorites.includes(bookId);
    const updated = isFav ? favorites.filter((id) => id !== bookId) : [...favorites, bookId];
    setFavorites(updated);
    try {
      localStorage.setItem('bibliotech_favs', JSON.stringify(updated));
    } catch (e) {}
    showToast(isFav ? 'Removido dos favoritos' : 'Salvo na sua lista de desejos!');
  };

  // Gerenciamento da Sacola de Compras (Cart)
  const addToCart = (book, quantity = 1, e) => {
    if (e) e.stopPropagation();

    const existingIndex = cart.findIndex((item) => item.book.id === book.id);
    let newCart;

    if (existingIndex > -1) {
      newCart = cart.map((item, idx) =>
        idx === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [
        ...cart,
        {
          book: {
            ...book,
            price: book.price || 49.90,
            originalPrice: book.originalPrice || 69.90,
            format: book.format || 'Capa Dura'
          },
          quantity,
          format: book.format || 'Capa Dura'
        }
      ];
    }

    saveCart(newCart);
    showToast(`"${book.title}" adicionado à sacola!`);
  };

  const updateCartQuantity = (bookId, delta) => {
    const updated = cart
      .map((item) => {
        if (item.book.id === bookId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    saveCart(updated);
  };

  const removeFromCart = (bookId) => {
    const updated = cart.filter((item) => item.book.id !== bookId);
    saveCart(updated);
    showToast('Item removido da sacola.');
  };

  // Cálculos do Carrinho
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.book.price || 49.90) * item.quantity, 0);
  }, [cart]);

  const cartTotalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const freeShippingThreshold = 99.0;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const missingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((cartSubtotal / freeShippingThreshold) * 100)
  );

  const cartDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return (cartSubtotal * appliedCoupon.discountPercent) / 100;
  }, [cartSubtotal, appliedCoupon]);

  const shippingCost = cart.length === 0 || isFreeShipping ? 0 : 14.90;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + shippingCost);

  // Aplicação de Cupom
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (code === 'BIBLIO10') {
      setAppliedCoupon({ code: 'BIBLIO10', discountPercent: 10 });
      showToast('Cupom BIBLIO10 aplicado: 10% de desconto!');
    } else if (code === 'LEITORVIP') {
      setAppliedCoupon({ code: 'LEITORVIP', discountPercent: 15 });
      showToast('Cupom LEITORVIP aplicado: 15% de desconto!');
    } else {
      showToast('Cupom inválido. Experimente usar: BIBLIO10');
    }
    setCouponInput('');
  };

  // Finalizar Compra Simulação
  const handleStartCheckout = () => {
    if (cart.length === 0) {
      showToast('Sua sacola está vazia.');
      return;
    }
    setIsCartOpen(false);
    setCheckoutStep('form');
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    const orderNumber = `BLT-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalValue = paymentMethod === 'pix' ? cartTotal * 0.95 : cartTotal;

    const order = {
      orderNumber,
      date: new Date().toLocaleDateString('pt-BR'),
      items: cart,
      subtotal: cartSubtotal,
      discount: cartDiscount + (paymentMethod === 'pix' ? cartTotal * 0.05 : 0),
      shipping: shippingCost,
      total: finalValue,
      paymentMethod:
        paymentMethod === 'pix'
          ? 'PIX (5% OFF Adicional)'
          : paymentMethod === 'credit'
          ? 'Cartão de Crédito (até 6x s/ juros)'
          : 'Boleto Bancário',
      address: `${checkoutForm.address}, ${checkoutForm.city}`
    };

    setConfirmedOrder(order);
    setCheckoutStep('success');
    saveCart([]); // Limpa a sacola
  };

  // Assinatura de Planos Simulação
  const handleOpenPlanModal = (plan) => {
    setSelectedPlan(plan);
    setIsPlanModalOpen(true);
  };

  const handleConfirmPlanSubscription = (e) => {
    e.preventDefault();
    if (!planForm.email) {
      showToast('Por favor, informe seu e-mail para assinar.');
      return;
    }
    const currentPrice =
      billingCycle === 'mensal' ? selectedPlan.monthlyPrice : selectedPlan.annualPrice;

    showToast(
      `🎉 Parabéns! Você assinou o "${selectedPlan.name}" (${billingCycle === 'mensal' ? 'Mensal' : 'Anual - 2 Meses Grátis'}) por R$ ${currentPrice.toFixed(2)}/mês!`
    );
    setIsPlanModalOpen(false);
  };

  // Lógica de Seleção de Gêneros da Pesquisa
  const togglePreferredGenre = (genreId) => {
    const isSelected = preferredGenres.includes(genreId);
    const updated = isSelected
      ? preferredGenres.filter((g) => g !== genreId)
      : [...preferredGenres, genreId];
    setPreferredGenres(updated);
  };

  // Salvar a Pesquisa e Gerar Recomendações
  const handleSaveSurvey = () => {
    if (preferredGenres.length === 0) {
      showToast('Selecione pelo menos um gênero para personalizarmos suas recomendações!');
      return;
    }
    try {
      localStorage.setItem('bibliotech_preferred_genres', JSON.stringify(preferredGenres));
      localStorage.setItem('bibliotech_preferred_format', preferredFormat);
      localStorage.setItem('bibliotech_survey_answered', 'true');
    } catch (e) {}
    setHasAnsweredSurvey(true);
    setIsSurveyModalOpen(false);
    showToast(`🎉 Recomendações personalizadas geradas com base em ${preferredGenres.length} temas!`);
    const recSection = document.getElementById('recomendados-section');
    if (recSection) recSection.scrollIntoView({ behavior: 'smooth' });
  };

  // Pular Pesquisa por Enquanto
  const handleSkipSurvey = () => {
    setIsSurveyModalOpen(false);
    showToast('Você pode definir seus gostos a qualquer momento no botão "Recomendações" no topo!');
  };

  // Limpar Preferências
  const clearPreferredGenres = () => {
    setPreferredGenres([]);
    setFilterOnlyPreferred(false);
    try {
      localStorage.removeItem('bibliotech_preferred_genres');
      localStorage.removeItem('bibliotech_survey_answered');
    } catch (e) {}
    setHasAnsweredSurvey(false);
    showToast('Pesquisa de gostos reiniciada.');
  };

  // Livros Recomendados com Base nas Preferências
  const recommendedBooks = useMemo(() => {
    if (preferredGenres.length === 0) {
      return books.filter((b) => b.rating >= 4.8).slice(0, 4);
    }
    const matched = books.filter((book) => {
      return preferredGenres.some((g) => {
        const gLower = g.toLowerCase();
        const bLower = book.genre.toLowerCase();
        if (bLower === gLower) return true;
        if (g === 'Cinema & Adaptações' && (bLower.includes('ficção') || bLower.includes('fantasia') || bLower.includes('distopia') || bLower.includes('suspense') || bLower.includes('clássicos'))) return true;
        if (g === 'Suspense' && (bLower.includes('suspense') || bLower.includes('terror') || bLower.includes('mistério'))) return true;
        if (g === 'Aventura' && (bLower.includes('aventura') || bLower.includes('fantasia'))) return true;
        return false;
      });
    });

    if (matched.length < 3) {
      const remaining = books.filter((b) => !matched.some((m) => m.id === b.id));
      return [...matched, ...remaining].slice(0, 4);
    }
    return matched;
  }, [books, preferredGenres]);

  // 1. INTEGRAÇÃO GOOGLE BOOKS API
  const searchGoogleBooks = useCallback(async (query) => {
    if (!query.trim()) {
      setApiBooks([]);
      return;
    }
    setIsApiLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=16`
      );
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        const formatted = data.items.map((item, idx) => {
          const info = item.volumeInfo || {};
          const categories = info.categories ? info.categories[0] : 'Literatura';
          const thumbnail = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || '';
          const safeThumbnail = thumbnail.replace(/^http:\/\//i, 'https://');

          const basePrice = 39.90 + ((idx * 7) % 35);
          const originalPrice = parseFloat((basePrice * 1.35).toFixed(2));
          const price = parseFloat(basePrice.toFixed(2));
          const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

          return {
            id: `gb-${item.id || idx}`,
            title: info.title || 'Título Desconhecido',
            author: info.authors ? info.authors.join(', ') : 'Autor Desconhecido',
            genre: categories.split('/')[0].trim(),
            rating: info.averageRating || 4.7,
            reviewsCount: info.ratingsCount || 65,
            price,
            originalPrice,
            discountPercent,
            stock: 15,
            badge: idx % 3 === 0 ? 'Promoção' : 'Disponível',
            format: info.pageCount && info.pageCount > 400 ? 'Capa Dura' : 'Brochura',
            synopsis: info.description || 'Sinopse não informada pelo Google Books.',
            year: info.publishedDate ? parseInt(info.publishedDate.substring(0, 4)) : 2022,
            pages: info.pageCount || 260,
            status: 'Disponível',
            coverImage: safeThumbnail,
            coverGradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #064e3b 100%)',
            accentColor: '#10b981',
            externalLink: info.infoLink || info.previewLink || ''
          };
        });
        setApiBooks(formatted);
      } else {
        setApiBooks([]);
      }
    } catch (err) {
      showToast('Erro ao buscar no Google Books');
    } finally {
      setIsApiLoading(false);
    }
  }, []);

  // 2. INTEGRAÇÃO OPEN LIBRARY API
  const searchOpenLibrary = useCallback(async (query) => {
    if (!query.trim()) {
      setApiBooks([]);
      return;
    }
    setIsApiLoading(true);
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=16`);
      const data = await res.json();
      if (data.docs && data.docs.length > 0) {
        const formatted = data.docs.map((doc, idx) => {
          const coverUrl = doc.cover_i
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
            : '';
          const subject = doc.subject && doc.subject.length > 0 ? doc.subject[0] : 'Geral';

          const basePrice = 34.90 + ((idx * 8) % 40);
          const originalPrice = parseFloat((basePrice * 1.3).toFixed(2));
          const price = parseFloat(basePrice.toFixed(2));
          const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

          return {
            id: `ol-${doc.key || idx}`,
            title: doc.title || 'Título Desconhecido',
            author: doc.author_name ? doc.author_name.join(', ') : 'Autor Desconhecido',
            genre: subject.split(',')[0].trim(),
            rating: doc.ratings_average ? parseFloat(doc.ratings_average.toFixed(1)) : 4.6,
            reviewsCount: doc.ratings_count || 110,
            price,
            originalPrice,
            discountPercent,
            stock: 20,
            badge: 'Edição Catalogada',
            format: 'Brochura',
            synopsis:
              doc.first_sentence && doc.first_sentence.length > 0
                ? doc.first_sentence[0]
                : `Obra catalogada na Open Library. Edições disponíveis: ${doc.edition_count || 1}.`,
            year: doc.first_publish_year || 2000,
            pages: doc.number_of_pages_median || 280,
            status: 'Disponível',
            coverImage: coverUrl,
            coverGradient: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #064e3b 100%)',
            accentColor: '#34d399',
            externalLink: doc.key ? `https://openlibrary.org${doc.key}` : ''
          };
        });
        setApiBooks(formatted);
      } else {
        setApiBooks([]);
      }
    } catch (err) {
      showToast('Erro ao buscar na Open Library');
    } finally {
      setIsApiLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchSource === 'local') return;
    if (!searchTerm.trim()) {
      setApiBooks([]);
      return;
    }
    const timer = setTimeout(() => {
      if (searchSource === 'google') searchGoogleBooks(searchTerm);
      else if (searchSource === 'openlibrary') searchOpenLibrary(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, searchSource, searchGoogleBooks, searchOpenLibrary]);

  const importBookToLocal = (book) => {
    const newBook = {
      ...book,
      id: Date.now(),
      status: 'Disponível',
      price: book.price || 49.90,
      originalPrice: book.originalPrice || 69.90,
      discountPercent: book.discountPercent || 28,
      stock: 20,
      format: book.format || 'Brochura',
      badge: 'Lançamento Loja',
      coverGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    };
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      fetch(`${apiUrl}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      }).catch(() => {});
    } catch (e) {}

    updateBooks([newBook, ...books]);
    showToast(`"${book.title}" adicionado ao catálogo da livraria!`);
  };

  const handleAutofillForm = async (e) => {
    e.preventDefault();
    if (!autofillQuery.trim()) return;
    setIsAutofilling(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(autofillQuery)}&maxResults=1`
      );
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        const info = data.items[0].volumeInfo || {};
        const thumbnail = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || '';
        const safeThumbnail = thumbnail.replace(/^http:\/\//i, 'https://');

        setNewBookForm({
          title: info.title || '',
          author: info.authors ? info.authors.join(', ') : '',
          genre: info.categories ? info.categories[0].split('/')[0].trim() : 'Ficção Científica',
          rating: info.averageRating ? info.averageRating.toString() : '4.8',
          price: '49.90',
          originalPrice: '69.90',
          format: info.pageCount && info.pageCount > 400 ? 'Capa Dura' : 'Brochura',
          stock: '25',
          badge: 'Destaque',
          synopsis: info.description || '',
          year: info.publishedDate ? info.publishedDate.substring(0, 4) : '2024',
          pages: info.pageCount ? info.pageCount.toString() : '300',
          coverImage: safeThumbnail
        });
        showToast('Dados do livro preenchidos via Google Books!');
      } else {
        showToast('Nenhum resultado encontrado para autopreencher.');
      }
    } catch (err) {
      showToast('Erro ao buscar dados do livro.');
    } finally {
      setIsAutofilling(false);
    }
  };

  const handleCreateBook = async (e) => {
    e.preventDefault();
    if (!newBookForm.title || !newBookForm.author || !newBookForm.synopsis) {
      alert('Por favor, preencha o título, autor e sinopse.');
      return;
    }

    const price = parseFloat(newBookForm.price) || 49.90;
    const originalPrice = parseFloat(newBookForm.originalPrice) || (price * 1.3);
    const discountPercent = originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

    const newBook = {
      id: Date.now(),
      title: newBookForm.title,
      author: newBookForm.author,
      genre: newBookForm.genre,
      rating: parseFloat(newBookForm.rating) || 5.0,
      reviewsCount: 1,
      price,
      originalPrice,
      discountPercent,
      stock: parseInt(newBookForm.stock) || 15,
      badge: newBookForm.badge || 'Novo',
      format: newBookForm.format || 'Capa Dura',
      synopsis: newBookForm.synopsis,
      year: parseInt(newBookForm.year) || new Date().getFullYear(),
      pages: parseInt(newBookForm.pages) || 280,
      status: 'Disponível',
      coverImage: newBookForm.coverImage || '',
      coverGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      accentColor: '#10b981'
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      fetch(`${apiUrl}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      }).catch(() => {});
    } catch (e) {}

    updateBooks([newBook, ...books]);
    setIsAddModalOpen(false);
    setNewBookForm({
      title: '',
      author: '',
      genre: 'Ficção Científica',
      rating: '5.0',
      price: '49.90',
      originalPrice: '69.90',
      format: 'Capa Dura',
      stock: '20',
      badge: 'Novidade',
      synopsis: '',
      year: '2024',
      pages: '320',
      coverImage: ''
    });
    setAutofillQuery('');
    showToast(`Livro "${newBook.title}" cadastrado à venda com sucesso!`);
  };

  const genresList = useMemo(() => {
    const set = new Set(books.map((b) => b.genre));
    return ['Todos', ...Array.from(set)];
  }, [books]);

  const filteredLocalBooks = useMemo(() => {
    return books
      .filter((book) => {
        if (filterOnlyPreferred && preferredGenres.length > 0) {
          const matchPref = preferredGenres.some((g) => {
            const gLower = g.toLowerCase();
            const bLower = book.genre.toLowerCase();
            if (bLower === gLower) return true;
            if (g === 'Cinema & Adaptações' && (bLower.includes('ficção') || bLower.includes('fantasia') || bLower.includes('distopia') || bLower.includes('suspense') || bLower.includes('clássicos'))) return true;
            if (g === 'Suspense' && (bLower.includes('suspense') || bLower.includes('terror') || bLower.includes('mistério'))) return true;
            if (g === 'Aventura' && (bLower.includes('aventura') || bLower.includes('fantasia'))) return true;
            return false;
          });
          if (!matchPref) return false;
        }

        const matchesGenre =
          selectedGenre === 'Todos' || book.genre.toLowerCase() === selectedGenre.toLowerCase();
        const q = searchTerm.toLowerCase();
        const matchesSearch =
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          book.synopsis.toLowerCase().includes(q);
        return matchesGenre && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'sales') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
        if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [books, selectedGenre, searchTerm, sortBy, filterOnlyPreferred, preferredGenres]);

  const displayedBooks = searchSource === 'local' ? filteredLocalBooks : apiBooks;

  const stats = useMemo(() => {
    const total = books.length;
    const avgRating =
      total > 0 ? (books.reduce((acc, b) => acc + b.rating, 0) / total).toFixed(1) : '4.9';
    const genresCount = new Set(books.map((b) => b.genre)).size;
    return { total, avgRating, genresCount };
  }, [books]);

  const featuredBook = books[0] || DEFAULT_BOOKS[0];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          className={i <= fullStars ? styles.starFilled : styles.starEmpty}
        />
      );
    }
    return stars;
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalogo-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPlans = () => {
    const el = document.getElementById('planos-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToRecs = () => {
    const el = document.getElementById('recomendados-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.pageWrapper}>
      <Head>
        <title>Bibliotech • Livraria Online & Recomendações Personalizadas</title>
        <meta
          name="description"
          content="Bibliotech: Compre livros incríveis com base nos seus gêneros favoritos. Descubra recomendações sob medida e caixas exclusivas com mimos literários."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toast}>
          <CheckCircle2 size={18} className={styles.toastIcon} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header com Navegação e Sacola */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            {/* Logo */}
            <div className={styles.logoGroup}>
              <div className={styles.logoBadge}>
                <Library size={24} className={styles.logoIcon} />
              </div>
              <div className={styles.logoTitleBlock}>
                <span className={styles.logoTitle}>BIBLIOTECH</span>
                <span className={styles.logoSubtitle}>Livraria & Clube Literário</span>
              </div>
            </div>

            {/* Menu Nav Links */}
            <nav className={styles.navLinks}>
              <a href="#recomendados-section" className={styles.navItem} onClick={scrollToRecs}>
                <span className={styles.navRecTag}>⭐</span>
                Recomendações
              </a>
              <a href="#catalogo-section" className={styles.navItem}>Livraria Online</a>
              <a href="#planos-section" className={styles.navItem}>
                <span className={styles.navPlanTag}>NOVO</span>
                Clube & Planos
              </a>
              <a href="#como-funciona" className={styles.navItem}>Como Funciona</a>
              <a href="#beneficios" className={styles.navItem}>Diferenciais</a>
            </nav>

            {/* Header Actions: Pesquisa de Gostos + Sacola + Auth + Theme */}
            <div className={styles.headerActions}>
              {/* Botão de Pesquisa de Gêneros Favoritos */}
              <button
                className={styles.btnSurveyHeader}
                onClick={() => setIsSurveyModalOpen(true)}
                title="Personalizar meus gêneros favoritos"
                id="btn-open-survey"
              >
                <Sparkles size={15} />
                <span className={styles.btnSurveyLabel}>Pesquisa de Gostos</span>
                {preferredGenres.length > 0 && (
                  <span className={styles.surveyActiveDot} title={`${preferredGenres.length} gêneros ativos`}></span>
                )}
              </button>

              {/* Botão de Sacola de Compras */}
              <button
                className={styles.btnCart}
                onClick={() => setIsCartOpen(true)}
                title="Abrir sacola de compras"
                id="btn-cart-toggle"
              >
                <ShoppingBag size={18} />
                <span className={styles.btnCartLabel}>Sacola</span>
                {cartTotalItems > 0 && (
                  <span className={styles.cartBadge}>{cartTotalItems}</span>
                )}
              </button>

              {!currentUser ? (
                <div className={styles.authButtonGroup}>
                  <Link href="/login?tab=login" className={styles.btnLogin} id="btn-login">
                    <LogIn size={15} />
                    <span>Entrar</span>
                  </Link>
                  <Link href="/login?tab=signup" className={styles.btnSignup} id="btn-signup">
                    <UserPlus size={15} />
                    <span>Cadastrar</span>
                  </Link>
                </div>
              ) : (
                <div className={styles.userLoggedGroup}>
                  <div className={styles.userBadge}>
                    <div className={styles.userAvatar}>
                      {currentUser.full_name
                        ? currentUser.full_name[0].toUpperCase()
                        : currentUser.email
                        ? currentUser.email[0].toUpperCase()
                        : 'U'}
                    </div>
                    <span className={styles.userName}>
                      {currentUser.full_name || currentUser.email}
                    </span>
                  </div>

                  <button
                    className={styles.btnAddBook}
                    onClick={() => setIsAddModalOpen(true)}
                    id="btn-add-book"
                    title="Cadastrar novo livro para venda"
                  >
                    <Plus size={15} />
                    <span>Cadastrar Livro</span>
                  </button>

                  <button
                    className={styles.btnLogout}
                    onClick={handleLogout}
                    title="Sair da conta"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              )}

              <div className={styles.themeToggleWrapper}>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* BARRA DE VANTAGENS E-COMMERCE (TRUST BAR) */}
      <section className={styles.trustBarSection}>
        <div className={styles.container}>
          <div className={styles.trustBarGrid}>
            <div className={styles.trustItem}>
              <div className={styles.trustIconCircle}>
                <Sparkles size={18} />
              </div>
              <div className={styles.trustText}>
                <strong>Recomendações IA</strong>
                <span>Livros baseados nos seus gostos</span>
              </div>
            </div>

            <div className={styles.trustItem}>
              <div className={styles.trustIconCircle}>
                <Truck size={18} />
              </div>
              <div className={styles.trustText}>
                <strong>Frete Grátis</strong>
                <span>Em compras acima de R$ 99</span>
              </div>
            </div>

            <div className={styles.trustItem}>
              <div className={styles.trustIconCircle}>
                <Zap size={18} />
              </div>
              <div className={styles.trustText}>
                <strong>Envio Rápido 24h</strong>
                <span>Rastreamento em tempo real</span>
              </div>
            </div>

            <div className={styles.trustItem}>
              <div className={styles.trustIconCircle}>
                <CreditCard size={18} />
              </div>
              <div className={styles.trustText}>
                <strong>Até 6x Sem Juros</strong>
                <span>Ou 5% de desconto no PIX</span>
              </div>
            </div>

            <div className={styles.trustItem}>
              <div className={styles.trustIconCircle}>
                <ShieldCheck size={18} />
              </div>
              <div className={styles.trustText}>
                <strong>Compra Segura</strong>
                <span>Garantia de 30 dias na entrega</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main>
        {/* ===== 1. HERO SECTION ===== */}
        <section className={styles.heroSection}>
          <div className={styles.heroGlow}></div>
          <div className={styles.container}>
            <div className={styles.heroGrid}>
              {/* Coluna Esquerda: Texto e Chamadas para Ação */}
              <div className={styles.heroTextCol}>
                <div className={styles.heroBadge} onClick={() => setIsSurveyModalOpen(true)} style={{ cursor: 'pointer' }}>
                  <Sparkles size={15} />
                  <span>
                    {preferredGenres.length > 0
                      ? `Recomendações ativas para: ${preferredGenres.slice(0, 2).join(', ')}...`
                      : 'Descubra livros perfeitos para você • Iniciar Pesquisa'}
                  </span>
                </div>

                <h1 className={styles.heroTitle}>
                  Compre seus livros favoritos ou assine nosso{' '}
                  <span className={styles.gradientText}>Clube de Leitura</span>
                </h1>

                <p className={styles.heroDescription}>
                  Conte-nos os gêneros que você mais gosta e receba recomendações feitas sob medida para o seu estilo de leitura, com até <strong>40% OFF</strong> e frete grátis.
                </p>

                <div className={styles.heroCtaGroup}>
                  <button onClick={() => setIsSurveyModalOpen(true)} className={styles.btnCtaPrimary}>
                    <Sparkles size={18} />
                    <span>Pesquisar Meus Gêneros Favoritos</span>
                  </button>
                  <button onClick={scrollToCatalog} className={styles.btnCtaSecondary}>
                    <ShoppingBag size={18} />
                    <span>Ver Todos os Livros</span>
                  </button>
                </div>

                {/* Métricas Rápidas */}
                <div className={styles.heroStatsRow}>
                  <div className={styles.heroStatItem}>
                    <span className={styles.heroStatValue}>10.000+</span>
                    <span className={styles.heroStatLabel}>Livros Entregues</span>
                  </div>
                  <div className={styles.heroStatDivider}></div>
                  <div className={styles.heroStatItem}>
                    <span className={styles.heroStatValue}>★ {stats.avgRating}</span>
                    <span className={styles.heroStatLabel}>Avaliações 5 Estrelas</span>
                  </div>
                  <div className={styles.heroStatDivider}></div>
                  <div className={styles.heroStatItem}>
                    <span className={styles.heroStatValue}>98%</span>
                    <span className={styles.heroStatLabel}>Recomendações Aprovadas</span>
                  </div>
                </div>
              </div>

              {/* Coluna Direita: Card de Livro em Oferta Especial */}
              <div className={styles.heroCardCol}>
                <div className={styles.featuredCard}>
                  <div className={styles.featuredBadgeTop}>
                    <Award size={14} />
                    <span>Oferta da Semana • {featuredBook.badge || 'Mais Vendido'}</span>
                  </div>

                  <div
                    className={styles.featuredCoverWrapper}
                    onClick={() => setSelectedBook(featuredBook)}
                  >
                    {featuredBook.coverImage ? (
                      <img
                        src={featuredBook.coverImage}
                        alt={featuredBook.title}
                        className={styles.featuredCoverImg}
                      />
                    ) : (
                      <div className={styles.featuredCoverGradient} style={{ background: featuredBook.coverGradient }}>
                        <BookOpen size={48} />
                        <h4>{featuredBook.title}</h4>
                        <p>{featuredBook.author}</p>
                      </div>
                    )}
                    <span className={styles.heroCardDiscountBadge}>
                      -{featuredBook.discountPercent || 33}% OFF
                    </span>
                  </div>

                  <div className={styles.featuredContent}>
                    <div className={styles.featuredTagsRow}>
                      <span className={styles.genreBadge}>
                        <Bookmark size={12} />
                        {featuredBook.genre}
                      </span>
                      <span className={styles.formatTagBadge}>{featuredBook.format || 'Capa Dura'}</span>
                    </div>

                    <h3 className={styles.featuredTitle} onClick={() => setSelectedBook(featuredBook)}>
                      {featuredBook.title}
                    </h3>
                    <p className={styles.featuredAuthor}>Por {featuredBook.author}</p>

                    <div className={styles.ratingSection}>
                      <div className={styles.starsWrapper}>{renderStars(featuredBook.rating)}</div>
                      <span className={styles.ratingNumber}>{featuredBook.rating.toFixed(1)}</span>
                      <span className={styles.reviewsCount}>({featuredBook.reviewsCount} vendas)</span>
                    </div>

                    {/* Preço e Botão de Comprar Direto */}
                    <div className={styles.heroPriceRow}>
                      <div className={styles.heroPriceBox}>
                        <div className={styles.oldPriceText}>
                          De R$ {(featuredBook.originalPrice || 89.90).toFixed(2).replace('.', ',')}
                        </div>
                        <div className={styles.mainPriceText}>
                          Por <strong>R$ {(featuredBook.price || 59.90).toFixed(2).replace('.', ',')}</strong>
                        </div>
                        <div className={styles.installmentsText}>
                          ou 3x de R$ {((featuredBook.price || 59.90) / 3).toFixed(2).replace('.', ',')} s/ juros
                        </div>
                      </div>

                      <button
                        className={styles.btnHeroBuy}
                        onClick={() => {
                          addToCart(featuredBook, 1);
                          setIsCartOpen(true);
                        }}
                      >
                        <ShoppingBag size={17} />
                        <span>Comprar Agora</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 2. SEÇÃO DE RECOMENDAÇÕES PERSONALIZADAS (BASEADA NA PESQUISA DE GÊNEROS) ===== */}
        <section id="recomendados-section" className={styles.recommendedSection}>
          <div className={styles.container}>
            {preferredGenres.length > 0 ? (
              <>
                <div className={styles.recommendedHeaderRow}>
                  <div>
                    <div className={styles.recBadgeTop}>
                      <Sparkles size={14} />
                      <span>RECOMENDADOS PARA VOCÊ</span>
                    </div>
                    <h2 className={styles.recMainTitle}>Livros que Combinam com os Seus Gostos</h2>
                    <p className={styles.recMainDesc}>
                      Obras selecionadas automaticamente com base nos seus gêneros favoritos:{' '}
                      <strong className={styles.recGenresHighlight}>{preferredGenres.join(' • ')}</strong>
                    </p>
                  </div>

                  <button
                    className={styles.btnRetakeSurvey}
                    onClick={() => setIsSurveyModalOpen(true)}
                    title="Alterar meus gêneros favoritos"
                    id="btn-retake-survey"
                  >
                    <RotateCcw size={15} />
                    <span>Refazer Pesquisa de Gostos</span>
                  </button>
                </div>

                {/* Grid com Livros Recomendados */}
                <div className={styles.recommendedGrid}>
                  {recommendedBooks.map((book) => {
                    const price = book.price || 49.90;
                    const originalPrice = book.originalPrice || 69.90;
                    const discountPercent =
                      book.discountPercent ||
                      Math.round(((originalPrice - price) / originalPrice) * 100);

                    return (
                      <article
                        key={book.id}
                        className={styles.recBookCard}
                        onClick={() => setSelectedBook(book)}
                      >
                        <div className={styles.recCardMatchPill}>
                          <Star size={12} fill="#10b981" />
                          <span>Seu Gosto: {book.genre}</span>
                        </div>

                        <div className={styles.recCoverWrapper}>
                          {book.coverImage ? (
                            <img src={book.coverImage} alt={book.title} className={styles.recCoverImg} />
                          ) : (
                            <div className={styles.recCoverPlaceholder} style={{ background: book.coverGradient }}>
                              <BookOpen size={32} />
                              <h5>{book.title}</h5>
                            </div>
                          )}
                          {discountPercent > 0 && (
                            <span className={styles.recDiscountBadge}>-{discountPercent}% OFF</span>
                          )}
                        </div>

                        <div className={styles.recCardBody}>
                          <div className={styles.recGenreFormatRow}>
                            <span className={styles.genreBadge}>{book.genre}</span>
                            <span className={styles.formatPill}>{book.format || 'Capa Dura'}</span>
                          </div>

                          <h4 className={styles.recBookTitle} title={book.title}>
                            {book.title}
                          </h4>
                          <p className={styles.recBookAuthor}>Por {book.author}</p>

                          <div className={styles.ratingSection}>
                            <div className={styles.starsWrapper}>{renderStars(book.rating)}</div>
                            <span className={styles.ratingNumber}>{book.rating.toFixed(1)}</span>
                          </div>

                          <p className={styles.recSynopsisSnippet}>{book.synopsis}</p>

                          <div className={styles.recPriceBox}>
                            <div className={styles.recOldPrice}>De R$ {originalPrice.toFixed(2).replace('.', ',')}</div>
                            <div className={styles.recCurrentPrice}>
                              R$ <strong>{price.toFixed(2).replace('.', ',')}</strong>
                            </div>
                          </div>

                          <div className={styles.recCardActions}>
                            <button
                              className={styles.btnRecBuy}
                              onClick={(e) => {
                                addToCart(book, 1, e);
                                setIsCartOpen(true);
                              }}
                            >
                              <ShoppingBag size={15} />
                              <span>Comprar</span>
                            </button>
                            <button
                              className={styles.btnCardDetails}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBook(book);
                              }}
                            >
                              <span>Detalhes</span>
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            ) : (
              /* CARD DE CONVITE CASO O USUÁRIO AINDA NÃO TENHA RESPONDIDO */
              <div className={styles.surveyInviteCard}>
                <div className={styles.surveyInviteContent}>
                  <div className={styles.surveyInviteBadge}>
                    <Sparkles size={16} />
                    <span>PESQUISA DE RECOMENDAÇÃO INTELIGENTE</span>
                  </div>
                  <h2 className={styles.surveyInviteTitle}>
                    Descubra os Livros Perfeitos para o Seu Gosto Literário!
                  </h2>
                  <p className={styles.surveyInviteDesc}>
                    Não perca tempo procurando entre milhares de títulos. Selecione os gêneros que você mais gosta de ler (como Ficção Científica, Fantasia, Suspense ou Tecnologia) e nós montaremos uma estante personalizada para você!
                  </p>
                  <div className={styles.surveyInviteActions}>
                    <button
                      className={styles.btnStartSurvey}
                      onClick={() => setIsSurveyModalOpen(true)}
                    >
                      <Sparkles size={18} />
                      <span>Responder Pesquisa de Gêneros (30 seg)</span>
                    </button>
                  </div>
                </div>

                <div className={styles.surveyInviteDecor}>
                  <div className={styles.surveyEmojiCloud}>
                    <span className={styles.floatingEmoji1}>🚀</span>
                    <span className={styles.floatingEmoji2}>🧙‍♂️</span>
                    <span className={styles.floatingEmoji3}>💻</span>
                    <span className={styles.floatingEmoji4}>🕵️</span>
                    <span className={styles.floatingEmoji5}>📜</span>
                    <span className={styles.floatingEmoji6}>💖</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ===== 3. SEÇÃO DE PLANOS DE ASSINATURA (CLUBE DO LIVRO) ===== */}
        <section id="planos-section" className={styles.plansSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeadingCenter}>
              <span className={styles.subHeadingBadge}>
                <Sparkles size={14} />
                Clube Literário Bibliotech
              </span>
              <h2 className={styles.mainSectionTitle}>Escolha o Plano de Assinatura Perfeito</h2>
              <p className={styles.mainSectionDesc}>
                Receba caixas surpresa todo mês na sua porta com edições especiais, brindes colecionáveis e descontos exclusivos na nossa livraria online.
              </p>

              {/* Seletor Mensal / Anual */}
              <div className={styles.billingToggleWrapper}>
                <div className={styles.billingToggle}>
                  <button
                    className={`${styles.billingToggleBtn} ${billingCycle === 'mensal' ? styles.billingToggleActive : ''}`}
                    onClick={() => setBillingCycle('mensal')}
                  >
                    Assinatura Mensal
                  </button>
                  <button
                    className={`${styles.billingToggleBtn} ${billingCycle === 'anual' ? styles.billingToggleActive : ''}`}
                    onClick={() => setBillingCycle('anual')}
                  >
                    <span>Plano Anual</span>
                    <span className={styles.annualBadgeOffer}>2 MESES GRÁTIS</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Grid dos 3 Planos */}
            <div className={styles.plansGrid}>
              {SUBSCRIPTION_PLANS.map((plan) => {
                const currentPrice = billingCycle === 'mensal' ? plan.monthlyPrice : plan.annualPrice;
                return (
                  <div
                    key={plan.id}
                    className={`${styles.planCard} ${plan.popular ? styles.planCardPopular : ''}`}
                  >
                    {plan.popular && (
                      <div className={styles.popularRibbon}>
                        <Sparkles size={13} />
                        <span>MAIS POPULAR</span>
                      </div>
                    )}

                    <div className={styles.planHeader}>
                      <span className={styles.planBadge}>{plan.badge}</span>
                      <h3 className={styles.planName}>{plan.name}</h3>
                      <p className={styles.planDesc}>{plan.description}</p>
                    </div>

                    <div className={styles.planPricingBlock}>
                      <div className={styles.planPriceNumber}>
                        <span className={styles.planCurrency}>R$</span>
                        <span className={styles.planValue}>
                          {currentPrice.toFixed(2).replace('.', ',')}
                        </span>
                        <span className={styles.planPeriod}>/mês</span>
                      </div>
                      {billingCycle === 'anual' && (
                        <div className={styles.planSavingsHint}>
                          Cobrado anualmente (Economia de 15% + Brindes extras)
                        </div>
                      )}
                    </div>

                    <div className={styles.planDivider}></div>

                    <ul className={styles.planFeaturesList}>
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className={styles.planFeatureItem}>
                          <div className={styles.planCheckIconBox}>
                            <Check size={14} strokeWidth={3} />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className={styles.planFooter}>
                      <button
                        className={`${styles.btnPlanCta} ${plan.popular ? styles.btnPlanCtaPopular : ''}`}
                        onClick={() => handleOpenPlanModal(plan)}
                      >
                        <Package size={17} />
                        <span>{plan.ctaText}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Banner de Garantia dos Planos */}
            <div className={styles.plansGuaranteeBox}>
              <div className={styles.guaranteeIcon}>
                <ShieldCheck size={28} />
              </div>
              <div className={styles.guaranteeText}>
                <h4>Sem fidelidade ou multas de cancelamento</h4>
                <p>Você pode pausar, trocar de plano ou cancelar sua assinatura a qualquer momento com apenas 1 clique no seu painel.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 4. SEÇÃO DO CATÁLOGO DE LIVROS À VENDA ===== */}
        <section id="catalogo-section" className={styles.booksSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeadingCenter}>
              <span className={styles.subHeadingBadge}>Loja & Catálogo</span>
              <h2 className={styles.mainSectionTitle}>Livros Disponíveis para Compra</h2>
              <p className={styles.mainSectionDesc}>
                Explore nosso acervo com pronta entrega ou busque qualquer título internacional via Google Books e Open Library.
              </p>
            </div>

            {/* Selector Tabs: Catálogo Local vs Google Books vs Open Library */}
            <div className={styles.sourceTabsWrapper}>
              <div className={styles.sourceTabs}>
                <button
                  className={`${styles.sourceTabBtn} ${
                    searchSource === 'local' ? styles.sourceTabActive : ''
                  }`}
                  onClick={() => setSearchSource('local')}
                >
                  <BookOpen size={16} />
                  <span>Livraria Bibliotech</span>
                  <span className={styles.sourceTabBadge}>{books.length}</span>
                </button>

                <button
                  className={`${styles.sourceTabBtn} ${
                    searchSource === 'google' ? styles.sourceTabActive : ''
                  }`}
                  onClick={() => setSearchSource('google')}
                >
                  <Globe size={16} />
                  <span>Google Books API</span>
                </button>

                <button
                  className={`${styles.sourceTabBtn} ${
                    searchSource === 'openlibrary' ? styles.sourceTabActive : ''
                  }`}
                  onClick={() => setSearchSource('openlibrary')}
                >
                  <Library size={16} />
                  <span>Open Library API</span>
                </button>
              </div>
            </div>

            {/* Search & Sort Bar + Preferências de Gênero */}
            <div className={styles.searchBarContainer}>
              <div className={styles.searchInputWrapper}>
                <Search size={20} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder={
                    searchSource === 'local'
                      ? 'Pesquisar livro por título, autor, assunto...'
                      : searchSource === 'google'
                      ? 'Buscar qualquer livro no Google Books (Ex: Harry Potter, George Orwell)...'
                      : 'Buscar qualquer livro na Open Library (Ex: Tolkien, Machado de Assis)...'
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                  id="search-input"
                />
                {searchTerm && (
                  <button
                    className={styles.clearSearchBtn}
                    onClick={() => setSearchTerm('')}
                    title="Limpar busca"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {searchSource === 'local' && (
                <div className={styles.searchControlsRight}>
                  {/* Botão de Pesquisa de Gêneros */}
                  <button
                    className={`${styles.btnGenrePreferences} ${
                      preferredGenres.length > 0 ? styles.btnGenrePreferencesActive : ''
                    }`}
                    onClick={() => setIsSurveyModalOpen(true)}
                    title="Personalizar meus gêneros favoritos"
                    id="btn-genre-preferences"
                  >
                    <Sparkles size={17} className={styles.prefIcon} />
                    <span>Meus Gêneros</span>
                    {preferredGenres.length > 0 && (
                      <span className={styles.prefCountBadge}>{preferredGenres.length}</span>
                    )}
                  </button>

                  {/* Ordenação para Vendas */}
                  <div className={styles.sortSelectWrapper}>
                    <ArrowUpDown size={16} className={styles.sortIcon} />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={styles.sortSelect}
                      id="sort-select"
                    >
                      <option value="sales">Mais Populares / Vendidos</option>
                      <option value="price-asc">Menor Preço</option>
                      <option value="price-desc">Maior Preço</option>
                      <option value="rating">Melhor Avaliados</option>
                      <option value="title">Título (A-Z)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Genre Pills */}
            {searchSource === 'local' && (
              <div className={styles.genreFiltersContainer}>
                <span className={styles.genreFilterLabel}>
                  <Filter size={14} />
                  Filtrar:
                </span>
                <div className={styles.genrePillsList}>
                  {/* Pílula Especial de Gêneros da Pesquisa */}
                  <button
                    className={`${styles.genrePill} ${styles.genrePillPreferred} ${
                      filterOnlyPreferred ? styles.genrePillActivePreferred : ''
                    }`}
                    onClick={() => {
                      if (preferredGenres.length === 0) {
                        setIsSurveyModalOpen(true);
                      } else {
                        const next = !filterOnlyPreferred;
                        setFilterOnlyPreferred(next);
                        if (next) {
                          setSelectedGenre('Todos');
                          showToast(`Filtrando por ${preferredGenres.length} gêneros selecionados!`);
                        } else {
                          showToast('Exibindo catálogo completo da livraria');
                        }
                      }
                    }}
                    title="Filtrar pelos seus gêneros favoritos"
                  >
                    <Sparkles size={14} />
                    <span>⭐ Meus Favoritos</span>
                    {preferredGenres.length > 0 ? (
                      <span className={styles.genrePillCount}>{preferredGenres.length}</span>
                    ) : (
                      <span className={styles.genrePillConfigHint}>Responder</span>
                    )}
                  </button>

                  {genresList.map((genre) => (
                    <button
                      key={genre}
                      className={`${styles.genrePill} ${
                        !filterOnlyPreferred && selectedGenre === genre ? styles.genrePillActive : ''
                      }`}
                      onClick={() => {
                        setFilterOnlyPreferred(false);
                        setSelectedGenre(genre);
                      }}
                    >
                      <span>{genre}</span>
                      <span className={styles.genrePillCount}>
                        {genre === 'Todos'
                          ? books.length
                          : books.filter((b) => b.genre.toLowerCase() === genre.toLowerCase()).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.sectionHeaderRow}>
              <div>
                <h3 className={styles.sectionTitle}>
                  {searchSource === 'local'
                    ? filterOnlyPreferred
                      ? `⭐ Livros nos seus gêneros preferidos (${preferredGenres.length} temas)`
                      : selectedGenre === 'Todos'
                      ? 'Todos os Livros à Venda'
                      : `Categoria: ${selectedGenre}`
                    : searchSource === 'google'
                    ? 'Resultados do Google Books API'
                    : 'Resultados da Open Library API'}
                </h3>
                <p className={styles.sectionSubtitle}>
                  {searchSource === 'local'
                    ? `Exibindo ${displayedBooks.length} obras com pronta entrega e garantia`
                    : `Pesquisa online em tempo real via ${
                        searchSource === 'google' ? 'Google Books' : 'Open Library'
                      }`}
                </p>
              </div>

              {searchSource === 'local' && (
                <button
                  className={styles.btnAddBook}
                  onClick={() => setIsAddModalOpen(true)}
                  id="btn-add-book-section"
                >
                  <Plus size={16} />
                  <span>Cadastrar Livro</span>
                </button>
              )}
            </div>

            {/* Loading / Empty State */}
            {isApiLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.loadingSpinner}></div>
                <h3 className={styles.emptyTitle}>Buscando livros na API...</h3>
                <p className={styles.emptyDesc}>Conectando aos servidores e calculando valores de catálogo.</p>
              </div>
            ) : displayedBooks.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIconBox}>
                  <BookOpen size={36} />
                </div>
                <h3 className={styles.emptyTitle}>
                  {searchSource !== 'local' && !searchTerm
                    ? 'Digite algo para pesquisar na API'
                    : 'Nenhum livro encontrado'}
                </h3>
                <p className={styles.emptyDesc}>
                  {searchSource !== 'local' && !searchTerm
                    ? 'Use a barra de busca acima para pesquisar qualquer livro publicado no mundo.'
                    : 'Tente alterar os termos da sua busca ou selecionar outro gênero literário.'}
                </p>
                {searchSource === 'local' && (
                  <button
                    className={styles.btnResetSearch}
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedGenre('Todos');
                    }}
                  >
                    Limpar Filtros
                  </button>
                )}
              </div>
            ) : (
              /* GRID DE CARDS DOS LIVROS DE E-COMMERCE */
              <div className={styles.booksGrid}>
                {displayedBooks.map((book) => {
                  const isFav = favorites.includes(book.id);
                  const isExternal = searchSource !== 'local';
                  const price = book.price || 49.90;
                  const originalPrice = book.originalPrice || 69.90;
                  const discountPercent =
                    book.discountPercent ||
                    Math.round(((originalPrice - price) / originalPrice) * 100);

                  return (
                    <article
                      key={book.id}
                      className={styles.bookCard}
                      onClick={() => setSelectedBook(book)}
                    >
                      <div className={styles.coverWrapper}>
                        <div className={styles.cardBadgeRow}>
                          {discountPercent > 0 && (
                            <span className={styles.discountBadge}>-{discountPercent}% OFF</span>
                          )}
                          {book.badge && (
                            <span className={styles.customCardBadge}>{book.badge}</span>
                          )}
                        </div>

                        {book.coverImage ? (
                          <div className={styles.bookCover}>
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className={styles.bookCoverImage}
                              loading="lazy"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            <div className={styles.coverImageOverlay}>
                              <div className={styles.coverHeader}>
                                <BookOpen size={20} className={styles.coverBookIcon} />
                                <span className={styles.coverYearBadge}>{book.year}</span>
                              </div>
                              <div className={styles.coverFooter}>
                                <span className={styles.coverPages}>{book.pages} págs</span>
                                <span className={styles.formatBadgeCover}>
                                  {book.format || 'Capa Dura'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={styles.bookCover}
                            style={{ background: book.coverGradient }}
                          >
                            <div className={styles.coverPattern}></div>
                            <div className={styles.coverSpine}></div>

                            <div className={styles.coverHeader}>
                              <BookOpen size={22} className={styles.coverBookIcon} />
                              <span className={styles.coverYearBadge}>{book.year}</span>
                            </div>

                            <div className={styles.coverTitleBlock}>
                              <h3 className={styles.coverTitle}>{book.title}</h3>
                              <p className={styles.coverAuthor}>{book.author}</p>
                            </div>

                            <div className={styles.coverFooter}>
                              <span className={styles.coverPages}>{book.pages} págs</span>
                              <span className={styles.formatBadgeCover}>
                                {book.format || 'Brochura'}
                              </span>
                            </div>
                          </div>
                        )}

                        {!isExternal && (
                          <button
                            className={`${styles.favBtn} ${isFav ? styles.favBtnActive : ''}`}
                            onClick={(e) => toggleFavorite(book.id, e)}
                            title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                          >
                            <Heart size={16} fill={isFav ? '#ef4444' : 'none'} />
                          </button>
                        )}
                      </div>

                      <div className={styles.bookCardBody}>
                        <div className={styles.bookInfoTop}>
                          <h3 className={styles.bookTitle} title={book.title}>
                            {book.title}
                          </h3>
                          <div className={styles.bookAuthorRow}>
                            <User size={13} className={styles.authorIcon} />
                            <span className={styles.bookAuthor}>{book.author}</span>
                          </div>
                        </div>

                        <div className={styles.genreSection}>
                          <span className={styles.genreBadge}>
                            <Bookmark size={12} className={styles.genreIcon} />
                            {book.genre}
                          </span>
                          <span className={styles.formatPill}>{book.format || 'Capa Dura'}</span>
                        </div>

                        <div className={styles.ratingSection}>
                          <div className={styles.starsWrapper}>{renderStars(book.rating)}</div>
                          <span className={styles.ratingNumber}>{book.rating.toFixed(1)}</span>
                          <span className={styles.reviewsCount}>
                            ({book.reviewsCount.toLocaleString('pt-BR')} avaliações)
                          </span>
                        </div>

                        <div className={styles.synopsisSection}>
                          <p className={styles.synopsisText}>{book.synopsis}</p>
                        </div>

                        <div className={styles.cardPricingBox}>
                          <div className={styles.cardOldPrice}>
                            De R$ {originalPrice.toFixed(2).replace('.', ',')}
                          </div>
                          <div className={styles.cardCurrentPrice}>
                            R$ <strong>{price.toFixed(2).replace('.', ',')}</strong>
                          </div>
                          <div className={styles.cardInstallments}>
                            ou 2x de R$ {(price / 2).toFixed(2).replace('.', ',')} s/ juros
                          </div>
                        </div>

                        <div className={styles.cardActions}>
                          {isExternal ? (
                            <button
                              className={styles.btnImportBook}
                              onClick={(e) => {
                                e.stopPropagation();
                                importBookToLocal(book);
                              }}
                            >
                              <Download size={14} />
                              <span>Adicionar à Livraria</span>
                            </button>
                          ) : (
                            <>
                              <button
                                className={styles.btnAddToCart}
                                onClick={(e) => {
                                  addToCart(book, 1, e);
                                  setIsCartOpen(true);
                                }}
                                title="Adicionar à sacola de compras"
                              >
                                <ShoppingBag size={15} />
                                <span>Comprar</span>
                              </button>
                              <button
                                className={styles.btnCardDetails}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedBook(book);
                                }}
                                title="Ver sinopse e detalhes"
                              >
                                <span>Detalhes</span>
                                <ChevronRight size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ===== 5. SEÇÃO COMO FUNCIONA O CLUBE E AS COMPRAS ===== */}
        <section id="como-funciona" className={styles.howItWorksSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeadingCenter}>
              <span className={styles.subHeadingBadge}>Experiência Bibliotech</span>
              <h2 className={styles.mainSectionTitle}>Como funciona a Livraria & Clube</h2>
              <p className={styles.mainSectionDesc}>
                Compre exemplares com sugestões personalizadas ou assine caixas exclusivas todo mês.
              </p>
            </div>

            <div className={styles.stepsGrid}>
              <div className={styles.stepCard}>
                <div className={styles.stepNumberBadge}>01</div>
                <div className={styles.stepIconBox}>
                  <Sparkles size={24} />
                </div>
                <h3 className={styles.stepTitle}>Pesquisa de Gêneros</h3>
                <p className={styles.stepDesc}>
                  Responda quais gêneros você mais gosta de ler para que a livraria recomende títulos perfeitos para você.
                </p>
              </div>

              <div className={styles.stepCard}>
                <div className={styles.stepNumberBadge}>02</div>
                <div className={styles.stepIconBox}>
                  <Percent size={24} />
                </div>
                <h3 className={styles.stepTitle}>Aproveite Super Descontos</h3>
                <p className={styles.stepDesc}>
                  Use cupons como BIBLIO10, pague no PIX com 5% de desconto extra e ganhe Frete Grátis acima de R$ 99.
                </p>
              </div>

              <div className={styles.stepCard}>
                <div className={styles.stepNumberBadge}>03</div>
                <div className={styles.stepIconBox}>
                  <Truck size={24} />
                </div>
                <h3 className={styles.stepTitle}>Envio Rápido e Seguro</h3>
                <p className={styles.stepDesc}>
                  Embalagens reforçadas anti-impacto, envio em até 24 horas e código de rastreamento no seu WhatsApp e e-mail.
                </p>
              </div>

              <div className={styles.stepCard}>
                <div className={styles.stepNumberBadge}>04</div>
                <div className={styles.stepIconBox}>
                  <Gift size={24} />
                </div>
                <h3 className={styles.stepTitle}>Mimos & Comunidade</h3>
                <p className={styles.stepDesc}>
                  Assinantes do Box recebem brindes colecionáveis, marcadores e participam de encontros e debates virtuais.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 6. SEÇÃO DIFERENCIAIS ===== */}
        <section id="beneficios" className={styles.benefitsSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeadingCenter}>
              <span className={styles.subHeadingBadge}>Diferenciais</span>
              <h2 className={styles.mainSectionTitle}>Por que comprar na Bibliotech?</h2>
              <p className={styles.mainSectionDesc}>
                Mais que uma loja, o refúgio perfeito para apaixonados por literatura e histórias envolventes.
              </p>
            </div>

            <div className={styles.benefitsGrid}>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIconBox}>
                  <Sparkles size={22} />
                </div>
                <h3 className={styles.benefitTitle}>Recomendações Sob Medida</h3>
                <p className={styles.benefitDesc}>
                  Algoritmo inteligente de preferências literárias que sugere obras alinhadas aos seus autores e gêneros favoritos.
                </p>
              </div>

              <div className={styles.benefitCard}>
                <div className={styles.benefitIconBox}>
                  <Award size={22} />
                </div>
                <h3 className={styles.benefitTitle}>Edições em Capa Dura</h3>
                <p className={styles.benefitDesc}>
                  Trabalhamos com as edições mais belas e duráveis do mercado editorial para você montar uma estante de respeito.
                </p>
              </div>

              <div className={styles.benefitCard}>
                <div className={styles.benefitIconBox}>
                  <Tag size={22} />
                </div>
                <h3 className={styles.benefitTitle}>Preços Acessíveis</h3>
                <p className={styles.benefitDesc}>
                  Ofertas reais com até 40% OFF, parcelamento em até 6x sem juros e desconto imediato no pagamento via PIX.
                </p>
              </div>

              <div className={styles.benefitCard}>
                <div className={styles.benefitIconBox}>
                  <Globe size={22} />
                </div>
                <h3 className={styles.benefitTitle}>APIs Globais Integradas</h3>
                <p className={styles.benefitDesc}>
                  Busque e encontre dados em tempo real no Google Books e Open Library com capas e sinopses completas.
                </p>
              </div>

              <div className={styles.benefitCard}>
                <div className={styles.benefitIconBox}>
                  <Package size={22} />
                </div>
                <h3 className={styles.benefitTitle}>Boxes Literários Temáticos</h3>
                <p className={styles.benefitDesc}>
                  Caixas de assinatura recheadas de mimos exclusivos: ecobags, pins de metal, marcadores de página e guias de leitura.
                </p>
              </div>

              <div className={styles.benefitCard}>
                <div className={styles.benefitIconBox}>
                  <ShieldCheck size={22} />
                </div>
                <h3 className={styles.benefitTitle}>Garantia Total de Entrega</h3>
                <p className={styles.benefitDesc}>
                  Troca ou devolução facilitada em até 30 dias se o livro apresentar qualquer avaria no transporte.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 7. DEPOIMENTOS DE LEITORES & CLIENTES ===== */}
        <section id="depoimentos" className={styles.testimonialsSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeadingCenter}>
              <span className={styles.subHeadingBadge}>Avaliações Reais</span>
              <h2 className={styles.mainSectionTitle}>O que dizem os clientes da Bibliotech</h2>
              <p className={styles.mainSectionDesc}>
                Mais de 10.000 livros entregues com carinho para leitores de todo o Brasil.
              </p>
            </div>

            <div className={styles.testimonialsGrid}>
              <div className={styles.testimonialCard}>
                <Quote size={28} className={styles.testimonialQuoteIcon} />
                <p className={styles.testimonialText}>
                  "A pesquisa de gêneros acertou em cheio! Escolhi Fantasia e Ficção Científica e recebi Duna e O Hobbit com um desconto excelente. A sacola de compras é muito rápida!"
                </p>
                <div className={styles.testimonialAuthorGroup}>
                  <div className={styles.testimonialAvatar}>M</div>
                  <div>
                    <h4 className={styles.testimonialName}>Mariana Costa</h4>
                    <span className={styles.testimonialRole}>Leitora Assídua & Estudante</span>
                  </div>
                </div>
              </div>

              <div className={styles.testimonialCard}>
                <Quote size={28} className={styles.testimonialQuoteIcon} />
                <p className={styles.testimonialText}>
                  "O Box VIP Capa Dura superou todas as minhas expectativas! O livro veio super bem embalado, com uma ecobag linda e um marcador colecionável de metal. Vale cada centavo!"
                </p>
                <div className={styles.testimonialAuthorGroup}>
                  <div className={styles.testimonialAvatar}>L</div>
                  <div>
                    <h4 className={styles.testimonialName}>Lucas Silveira</h4>
                    <span className={styles.testimonialRole}>Assinante Box VIP</span>
                  </div>
                </div>
              </div>

              <div className={styles.testimonialCard}>
                <Quote size={28} className={styles.testimonialQuoteIcon} />
                <p className={styles.testimonialText}>
                  "O modo escuro com contornos neon verde é extremamente confortável para navegar à noite. A experiência de compra e a rapidez da entrega são fora de série!"
                </p>
                <div className={styles.testimonialAuthorGroup}>
                  <div className={styles.testimonialAvatar}>C</div>
                  <div>
                    <h4 className={styles.testimonialName}>Camila Nogueira</h4>
                    <span className={styles.testimonialRole}>Professora de Literatura</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 8. BANNER CTA FINAL ===== */}
        <section className={styles.ctaBannerSection}>
          <div className={styles.container}>
            <div className={styles.ctaBannerCard}>
              <div className={styles.ctaGlow}></div>
              <Sparkles size={32} className={styles.ctaIconBadge} />
              <h2 className={styles.ctaTitle}>Pronto para abastecer sua estante com grandes histórias?</h2>
              <p className={styles.ctaDesc}>
                Aproveite frete grátis para compras acima de R$ 99 ou personalize seus gêneros favoritos para receber as melhores recomendações!
              </p>
              <div className={styles.ctaActions}>
                <button onClick={() => setIsSurveyModalOpen(true)} className={styles.btnCtaBannerPrimary}>
                  <Sparkles size={18} />
                  <span>Personalizar Meus Gostos</span>
                </button>
                <button onClick={scrollToCatalog} className={styles.btnCtaBannerSecondary}>
                  <span>Ver Catálogo Completo</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===== MODAL DE PESQUISA DE GÊNEROS FAVORITOS (ONBOARDING & RECOMENDAÇÃO) ===== */}
      {isSurveyModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsSurveyModalOpen(false)}>
          <div className={styles.surveyModalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.surveyModalHeader}>
              <div className={styles.surveyModalBadgeRow}>
                <span className={styles.surveyModalBadge}>
                  <Sparkles size={14} />
                  PESQUISA DE GOSTO LITERÁRIO
                </span>
                <button
                  className={styles.modalCloseBtn}
                  onClick={() => setIsSurveyModalOpen(false)}
                  title="Fechar pesquisa"
                >
                  <X size={18} />
                </button>
              </div>

              <h3 className={styles.surveyModalTitle}>Quais são os seus gêneros favoritos? 📚</h3>
              <p className={styles.surveyModalSubtitle}>
                Selecione os temas que você mais ama ler para que a Bibliotech monte uma vitrine com recomendações sob medida para você:
              </p>
            </div>

            {/* Grid dos Gêneros Interativos */}
            <div className={styles.surveyGenresGrid}>
              {AVAILABLE_GENRES.map((g) => {
                const isSelected = preferredGenres.includes(g.id);
                return (
                  <div
                    key={g.id}
                    className={`${styles.surveyGenreCard} ${isSelected ? styles.surveyGenreCardSelected : ''}`}
                    onClick={() => togglePreferredGenre(g.id)}
                  >
                    <div className={styles.surveyGenreHeader}>
                      <span className={styles.surveyGenreEmoji}>{g.icon}</span>
                      <div className={`${styles.surveyCheckbox} ${isSelected ? styles.surveyCheckboxChecked : ''}`}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>
                    <h4 className={styles.surveyGenreName}>{g.name}</h4>
                    <p className={styles.surveyGenreDesc}>{g.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Pergunta Complementar de Formato */}
            <div className={styles.surveyFormatRow}>
              <span className={styles.surveyFormatLabel}>Qual acabamento você prefere?</span>
              <div className={styles.surveyFormatPills}>
                {['Todos', 'Capa Dura', 'Brochura'].map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    className={`${styles.surveyFormatBtn} ${preferredFormat === fmt ? styles.surveyFormatBtnActive : ''}`}
                    onClick={() => setPreferredFormat(fmt)}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Rodapé da Pesquisa com Contador e Ações */}
            <div className={styles.surveyModalFooter}>
              <div className={styles.surveyFooterLeft}>
                <span className={styles.surveySelectedCount}>
                  <strong>{preferredGenres.length}</strong> de {AVAILABLE_GENRES.length} gêneros selecionados
                </span>
                {preferredGenres.length > 0 && (
                  <button
                    type="button"
                    className={styles.btnSurveyReset}
                    onClick={clearPreferredGenres}
                  >
                    Limpar
                  </button>
                )}
              </div>

              <div className={styles.surveyFooterRight}>
                <button
                  type="button"
                  className={styles.btnSurveySkip}
                  onClick={handleSkipSurvey}
                >
                  Explorar sem responder
                </button>
                <button
                  type="button"
                  className={styles.btnSurveySubmit}
                  onClick={handleSaveSurvey}
                >
                  <Sparkles size={16} />
                  <span>Ver Minhas Recomendações</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== DRAWER / MODAL DA SACOLA DE COMPRAS (CART) ===== */}
      {isCartOpen && (
        <div className={styles.cartOverlay} onClick={() => setIsCartOpen(false)}>
          <div className={styles.cartDrawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.cartHeader}>
              <div className={styles.cartHeaderTitleBox}>
                <ShoppingBag size={22} className={styles.cartIconPrimary} />
                <div>
                  <h3 className={styles.cartTitle}>Minha Sacola</h3>
                  <span className={styles.cartCountSubtitle}>
                    {cartTotalItems} {cartTotalItems === 1 ? 'item selecionado' : 'itens selecionados'}
                  </span>
                </div>
              </div>
              <button
                className={styles.cartCloseBtn}
                onClick={() => setIsCartOpen(false)}
                title="Fechar sacola"
              >
                <X size={20} />
              </button>
            </div>

            {/* Barra de Progresso de Frete Grátis */}
            <div className={styles.freeShippingBox}>
              <div className={styles.freeShippingHeader}>
                <Truck size={16} />
                <span>
                  {isFreeShipping
                    ? '🎉 Parabéns! Você ganhou Frete Grátis Nacional!'
                    : `Faltam R$ ${missingForFreeShipping.toFixed(2).replace('.', ',')} para Frete Grátis!`}
                </span>
              </div>
              <div className={styles.freeShippingBar}>
                <div
                  className={styles.freeShippingProgress}
                  style={{ width: `${freeShippingProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Lista de Itens do Carrinho */}
            <div className={styles.cartItemsList}>
              {cart.length === 0 ? (
                <div className={styles.cartEmptyState}>
                  <div className={styles.cartEmptyIcon}>
                    <ShoppingCart size={40} />
                  </div>
                  <h4>Sua sacola está vazia</h4>
                  <p>Explore nosso catálogo e adicione suas leituras preferidas para aproveitar frete grátis e descontos exclusivos!</p>
                  <button
                    className={styles.btnCartBrowse}
                    onClick={() => {
                      setIsCartOpen(false);
                      scrollToCatalog();
                    }}
                  >
                    Ver Livros à Venda
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.book.id} className={styles.cartItemCard}>
                    <div className={styles.cartItemCover}>
                      {item.book.coverImage ? (
                        <img src={item.book.coverImage} alt={item.book.title} />
                      ) : (
                        <div
                          className={styles.cartItemCoverPlaceholder}
                          style={{ background: item.book.coverGradient }}
                        >
                          <BookOpen size={20} />
                        </div>
                      )}
                    </div>

                    <div className={styles.cartItemDetails}>
                      <div className={styles.cartItemTopRow}>
                        <h4 className={styles.cartItemTitle}>{item.book.title}</h4>
                        <button
                          className={styles.btnCartRemove}
                          onClick={() => removeFromCart(item.book.id)}
                          title="Remover item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className={styles.cartItemMeta}>
                        <span className={styles.cartItemAuthor}>{item.book.author}</span>
                        <span className={styles.cartItemFormat}>• {item.format || 'Capa Dura'}</span>
                      </div>

                      <div className={styles.cartItemBottomRow}>
                        <div className={styles.cartQtyControls}>
                          <button
                            className={styles.btnQty}
                            onClick={() => updateCartQuantity(item.book.id, -1)}
                            title="Diminuir quantidade"
                          >
                            <Minus size={13} />
                          </button>
                          <span className={styles.qtyNumber}>{item.quantity}</span>
                          <button
                            className={styles.btnQty}
                            onClick={() => updateCartQuantity(item.book.id, 1)}
                            title="Aumentar quantidade"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <div className={styles.cartItemPriceBlock}>
                          <span className={styles.cartItemPrice}>
                            R$ {((item.book.price || 49.90) * item.quantity).toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Rodapé da Sacola com Cupom e Totais */}
            {cart.length > 0 && (
              <div className={styles.cartFooter}>
                <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
                  <div className={styles.couponInputWrapper}>
                    <Tag size={15} className={styles.couponIcon} />
                    <input
                      type="text"
                      placeholder="Cupom de desconto (Ex: BIBLIO10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className={styles.couponInput}
                    />
                  </div>
                  <button type="submit" className={styles.btnApplyCoupon}>
                    Aplicar
                  </button>
                </form>

                {appliedCoupon && (
                  <div className={styles.appliedCouponBadge}>
                    <span>Cupom <strong>{appliedCoupon.code}</strong> ativo ({appliedCoupon.discountPercent}% OFF)</span>
                    <button
                      type="button"
                      onClick={() => setAppliedCoupon(null)}
                      className={styles.btnRemoveCoupon}
                    >
                      Remover
                    </button>
                  </div>
                )}

                <div className={styles.cartSummaryLines}>
                  <div className={styles.summaryLine}>
                    <span>Subtotal</span>
                    <span>R$ {cartSubtotal.toFixed(2).replace('.', ',')}</span>
                  </div>

                  {cartDiscount > 0 && (
                    <div className={`${styles.summaryLine} ${styles.summaryDiscount}`}>
                      <span>Desconto ({appliedCoupon.code})</span>
                      <span>- R$ {cartDiscount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}

                  <div className={styles.summaryLine}>
                    <span>Frete</span>
                    <span>
                      {shippingCost === 0 ? (
                        <strong className={styles.freeShippingGreen}>GRÁTIS</strong>
                      ) : (
                        `R$ ${shippingCost.toFixed(2).replace('.', ',')}`
                      )}
                    </span>
                  </div>

                  <div className={styles.summaryLineTotal}>
                    <span>Total</span>
                    <div className={styles.totalValueCol}>
                      <span className={styles.totalPrice}>
                        R$ {cartTotal.toFixed(2).replace('.', ',')}
                      </span>
                      <span className={styles.totalPixHint}>
                        ou R$ {(cartTotal * 0.95).toFixed(2).replace('.', ',')} no PIX (5% OFF)
                      </span>
                    </div>
                  </div>
                </div>

                <button className={styles.btnCheckout} onClick={handleStartCheckout}>
                  <CreditCard size={18} />
                  <span>Finalizar Compra</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== MODAL DE CHECKOUT SIMULADO ===== */}
      {isCheckoutModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsCheckoutModalOpen(false)}>
          <div className={styles.modalCardCheckout} onClick={(e) => e.stopPropagation()}>
            <div className={styles.formHeader}>
              <div className={styles.formHeaderTitleGroup}>
                <div className={styles.formIconBox}>
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className={styles.formTitle}>
                    {checkoutStep === 'form' ? 'Finalizar Pedido' : 'Pedido Confirmado!'}
                  </h3>
                  <p className={styles.formSubtitle}>
                    {checkoutStep === 'form'
                      ? 'Confirme seus dados de entrega e forma de pagamento'
                      : 'Sua compra foi processada com sucesso na Bibliotech'}
                  </p>
                </div>
              </div>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setIsCheckoutModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {checkoutStep === 'form' ? (
              <form onSubmit={handleConfirmOrder} className={styles.checkoutFormGrid}>
                <div className={styles.checkoutSection}>
                  <h4 className={styles.checkoutSectionTitle}>1. Dados de Entrega</h4>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Nome Completo *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Ana Maria Silva"
                        value={checkoutForm.name}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formField}>
                      <label className={styles.formLabel}>E-mail para Rastreamento *</label>
                      <input
                        type="email"
                        required
                        placeholder="Ex: ana@exemplo.com"
                        value={checkoutForm.email}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                        className={styles.formInput}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label className={styles.formLabel}>CEP *</label>
                      <input
                        type="text"
                        required
                        value={checkoutForm.cep}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, cep: e.target.value })}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Endereço Completo *</label>
                      <input
                        type="text"
                        required
                        value={checkoutForm.address}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.checkoutSection}>
                  <h4 className={styles.checkoutSectionTitle}>2. Forma de Pagamento</h4>
                  <div className={styles.paymentMethodsRow}>
                    <div
                      className={`${styles.paymentMethodCard} ${paymentMethod === 'pix' ? styles.paymentMethodSelected : ''}`}
                      onClick={() => setPaymentMethod('pix')}
                    >
                      <div className={styles.paymentBadgeDiscount}>5% OFF</div>
                      <strong>PIX Imediato</strong>
                      <span>Aprovação instantânea</span>
                    </div>

                    <div
                      className={`${styles.paymentMethodCard} ${paymentMethod === 'credit' ? styles.paymentMethodSelected : ''}`}
                      onClick={() => setPaymentMethod('credit')}
                    >
                      <strong>Cartão de Crédito</strong>
                      <span>Em até 6x sem juros</span>
                    </div>

                    <div
                      className={`${styles.paymentMethodCard} ${paymentMethod === 'boleto' ? styles.paymentMethodSelected : ''}`}
                      onClick={() => setPaymentMethod('boleto')}
                    >
                      <strong>Boleto Bancário</strong>
                      <span>Vencimento em 3 dias</span>
                    </div>
                  </div>
                </div>

                <div className={styles.checkoutSummaryCard}>
                  <div className={styles.checkoutSummaryRow}>
                    <span>Itens ({cartTotalItems})</span>
                    <span>R$ {cartSubtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {cartDiscount > 0 && (
                    <div className={`${styles.checkoutSummaryRow} ${styles.summaryDiscount}`}>
                      <span>Desconto ({appliedCoupon?.code})</span>
                      <span>- R$ {cartDiscount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  {paymentMethod === 'pix' && (
                    <div className={`${styles.checkoutSummaryRow} ${styles.summaryDiscount}`}>
                      <span>Desconto Especial PIX (5%)</span>
                      <span>- R$ {(cartTotal * 0.05).toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div className={styles.checkoutSummaryRow}>
                    <span>Frete</span>
                    <span>{shippingCost === 0 ? 'GRÁTIS' : `R$ ${shippingCost.toFixed(2).replace('.', ',')}`}</span>
                  </div>
                  <div className={styles.checkoutSummaryTotalRow}>
                    <span>Valor Final a Pagar</span>
                    <strong className={styles.checkoutFinalPrice}>
                      R$ {(paymentMethod === 'pix' ? cartTotal * 0.95 : cartTotal).toFixed(2).replace('.', ',')}
                    </strong>
                  </div>
                </div>

                <div className={styles.formFooterActions}>
                  <button
                    type="button"
                    className={styles.btnFormCancel}
                    onClick={() => setIsCheckoutModalOpen(false)}
                  >
                    Voltar
                  </button>
                  <button type="submit" className={styles.btnFormSubmit}>
                    <CheckCircle2 size={18} />
                    <span>Confirmar Pedido</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.orderSuccessCard}>
                <div className={styles.orderSuccessIconCircle}>
                  <CheckCircle size={48} />
                </div>
                <h3 className={styles.orderSuccessTitle}>Obrigado pela sua compra!</h3>
                <p className={styles.orderSuccessSubtitle}>
                  Seu pedido <strong>#{confirmedOrder?.orderNumber}</strong> foi gerado e está sendo preparado com muito carinho.
                </p>

                <div className={styles.orderSuccessBox}>
                  <div className={styles.orderDetailRow}>
                    <span>Data:</span>
                    <strong>{confirmedOrder?.date}</strong>
                  </div>
                  <div className={styles.orderDetailRow}>
                    <span>Forma de Pagamento:</span>
                    <strong>{confirmedOrder?.paymentMethod}</strong>
                  </div>
                  <div className={styles.orderDetailRow}>
                    <span>Endereço de Entrega:</span>
                    <strong>{confirmedOrder?.address}</strong>
                  </div>
                  <div className={styles.orderDetailRow}>
                    <span>Total Pago:</span>
                    <strong className={styles.orderSuccessTotal}>
                      R$ {confirmedOrder?.total.toFixed(2).replace('.', ',')}
                    </strong>
                  </div>
                </div>

                <button
                  className={styles.btnOrderSuccessClose}
                  onClick={() => setIsCheckoutModalOpen(false)}
                >
                  Continuar Navegando
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== MODAL DE CONFIRMAÇÃO DE ASSINATURA DE PLANO ===== */}
      {isPlanModalOpen && selectedPlan && (
        <div className={styles.modalOverlay} onClick={() => setIsPlanModalOpen(false)}>
          <div className={styles.modalCardMedium} onClick={(e) => e.stopPropagation()}>
            <div className={styles.formHeader}>
              <div className={styles.formHeaderTitleGroup}>
                <div className={styles.formIconBox}>
                  <Package size={20} />
                </div>
                <div>
                  <h3 className={styles.formTitle}>Assinar {selectedPlan.name}</h3>
                  <p className={styles.formSubtitle}>Junte-se ao Clube Literário Bibliotech</p>
                </div>
              </div>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setIsPlanModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.planModalSummary}>
              <div className={styles.planModalPriceBox}>
                <span className={styles.planModalCycleLabel}>
                  Ciclo Selecionado: <strong>{billingCycle === 'mensal' ? 'Mensal' : 'Anual (2 Meses Grátis)'}</strong>
                </span>
                <div className={styles.planModalPriceVal}>
                  R$ <strong>{(billingCycle === 'mensal' ? selectedPlan.monthlyPrice : selectedPlan.annualPrice).toFixed(2).replace('.', ',')}</strong> /mês
                </div>
              </div>

              <div className={styles.planModalPerks}>
                <h4>Benefícios inclusos no seu plano:</h4>
                <ul>
                  {selectedPlan.features.map((feat, i) => (
                    <li key={i}>
                      <Check size={14} className={styles.planModalCheck} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <form onSubmit={handleConfirmPlanSubscription} className={styles.planSubscribeForm}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Seu Nome Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo"
                    value={planForm.name}
                    onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Seu E-mail para Acesso ao Clube *</label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: carlos@email.com"
                    value={planForm.email}
                    onChange={(e) => setPlanForm({ ...planForm, email: e.target.value })}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formFooterActions}>
                  <button
                    type="button"
                    className={styles.btnFormCancel}
                    onClick={() => setIsPlanModalOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className={styles.btnFormSubmit}>
                    <Sparkles size={16} />
                    <span>Confirmar Assinatura</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL DE DETALHES DO LIVRO ===== */}
      {selectedBook && (
        <div className={styles.modalOverlay} onClick={() => setSelectedBook(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalCloseBtn}
              onClick={() => setSelectedBook(null)}
              title="Fechar"
            >
              <X size={20} />
            </button>

            <div className={styles.modalGrid}>
              <div
                className={styles.modalCover}
                style={{
                  background: selectedBook.coverImage
                    ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.85)), url(${selectedBook.coverImage}) center/cover no-repeat`
                    : selectedBook.coverGradient
                }}
              >
                <div className={styles.coverPattern}></div>
                <BookOpen size={44} className={styles.coverBookIcon} />
                <h3 className={styles.modalCoverTitle}>{selectedBook.title}</h3>
                <p className={styles.modalCoverAuthor}>{selectedBook.author}</p>
                <span className={styles.modalCoverYear}>{selectedBook.year}</span>
              </div>

              <div className={styles.modalDetails}>
                <div className={styles.modalGenreRow}>
                  <span className={styles.genreBadge}>
                    <Bookmark size={13} className={styles.genreIcon} />
                    {selectedBook.genre}
                  </span>
                  <span className={styles.formatTagBadge}>
                    {selectedBook.format || 'Capa Dura'}
                  </span>
                  <span className={styles.statusAvailableBadge}>
                    ✓ Em Estoque ({selectedBook.stock || 20} un.)
                  </span>
                </div>

                <h2 className={styles.modalTitle}>{selectedBook.title}</h2>
                <div className={styles.modalAuthorRow}>
                  <User size={16} />
                  <span>Por {selectedBook.author}</span>
                </div>

                <div className={styles.modalRatingRow}>
                  <div className={styles.modalStarsBox}>{renderStars(selectedBook.rating)}</div>
                  <span className={styles.modalRatingScore}>
                    {selectedBook.rating.toFixed(1)} de 5.0
                  </span>
                  <span className={styles.reviewsCount}>
                    • {selectedBook.reviewsCount.toLocaleString('pt-BR')} avaliações
                  </span>
                </div>

                <div className={styles.modalPriceContainer}>
                  <div className={styles.modalPriceTop}>
                    <span className={styles.modalOldPrice}>
                      De R$ {(selectedBook.originalPrice || 69.90).toFixed(2).replace('.', ',')}
                    </span>
                    <span className={styles.modalCurrentPrice}>
                      Por R$ {(selectedBook.price || 49.90).toFixed(2).replace('.', ',')}
                    </span>
                    <span className={styles.modalDiscountTag}>
                      -{selectedBook.discountPercent || 28}% OFF
                    </span>
                  </div>
                  <div className={styles.modalInstallments}>
                    em até 3x de R$ {((selectedBook.price || 49.90) / 3).toFixed(2).replace('.', ',')} sem juros ou com 5% de desconto no PIX
                  </div>
                </div>

                <div className={styles.modalMetaGrid}>
                  <div className={styles.modalMetaItem}>
                    <Calendar size={18} />
                    <div>
                      <span className={styles.metaLabel}>Publicação</span>
                      <span className={styles.metaValue}>{selectedBook.year}</span>
                    </div>
                  </div>
                  <div className={styles.modalMetaItem}>
                    <FileText size={18} />
                    <div>
                      <span className={styles.metaLabel}>Extensão</span>
                      <span className={styles.metaValue}>{selectedBook.pages} páginas</span>
                    </div>
                  </div>
                  <div className={styles.modalMetaItem}>
                    <Truck size={18} />
                    <div>
                      <span className={styles.metaLabel}>Entrega</span>
                      <span className={styles.metaValue}>Envio em até 24h</span>
                    </div>
                  </div>
                </div>

                <div className={styles.modalSynopsisBox}>
                  <h4 className={styles.synopsisHeaderTitle}>Sinopse do Livro:</h4>
                  <p className={styles.modalSynopsisParagraph}>{selectedBook.synopsis}</p>
                </div>

                <div className={styles.modalActions}>
                  <button
                    className={styles.btnModalAddToCart}
                    onClick={() => {
                      addToCart(selectedBook, 1);
                      setSelectedBook(null);
                      setIsCartOpen(true);
                    }}
                  >
                    <ShoppingBag size={18} />
                    <span>Adicionar à Sacola de Compras</span>
                  </button>

                  <button
                    className={`${styles.btnModalFav} ${
                      favorites.includes(selectedBook.id) ? styles.btnModalFavActive : ''
                    }`}
                    onClick={(e) => toggleFavorite(selectedBook.id, e)}
                  >
                    <Heart
                      size={18}
                      fill={favorites.includes(selectedBook.id) ? '#ef4444' : 'none'}
                    />
                    <span>
                      {favorites.includes(selectedBook.id) ? 'Desejado' : 'Lista de Desejos'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL DE CADASTRAR NOVO LIVRO COM AUTOFILL ===== */}
      {isAddModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAddModalOpen(false)}>
          <div className={styles.modalCardSmall} onClick={(e) => e.stopPropagation()}>
            <div className={styles.formHeader}>
              <div className={styles.formHeaderTitleGroup}>
                <div className={styles.formIconBox}>
                  <Plus size={20} />
                </div>
                <div>
                  <h3 className={styles.formTitle}>Cadastrar Livro para Venda</h3>
                  <p className={styles.formSubtitle}>Adicione uma nova obra ao catálogo da loja</p>
                </div>
              </div>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setIsAddModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.apiAutofillBox}>
              <span className={styles.apiAutofillTitle}>
                <Wand2 size={14} />
                Autopreencher dados via Google Books API
              </span>
              <div className={styles.apiAutofillRow}>
                <input
                  type="text"
                  placeholder="Digite o título do livro (Ex: Harry Potter e o Cálice de Fogo)..."
                  value={autofillQuery}
                  onChange={(e) => setAutofillQuery(e.target.value)}
                  className={styles.apiAutofillInput}
                />
                <button
                  type="button"
                  onClick={handleAutofillForm}
                  className={styles.btnAutofill}
                  disabled={isAutofilling}
                >
                  {isAutofilling ? <Loader2 size={14} className={styles.loadingSpinner} /> : <Wand2 size={14} />}
                  <span>{isAutofilling ? 'Buscando...' : 'Preencher'}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateBook} className={styles.addBookForm}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Título do Livro *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: O Nome do Vento"
                  value={newBookForm.title}
                  onChange={(e) => setNewBookForm({ ...newBookForm, title: e.target.value })}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Autor(a) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Patrick Rothfuss"
                    value={newBookForm.author}
                    onChange={(e) => setNewBookForm({ ...newBookForm, author: e.target.value })}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Gênero Literário *</label>
                  <select
                    value={newBookForm.genre}
                    onChange={(e) => setNewBookForm({ ...newBookForm, genre: e.target.value })}
                    className={styles.formSelect}
                  >
                    <option value="Ficção Científica">Ficção Científica</option>
                    <option value="Fantasia">Fantasia</option>
                    <option value="Distopia">Distopia</option>
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Suspense">Suspense</option>
                    <option value="Clássicos">Clássicos</option>
                    <option value="Romance">Romance</option>
                    <option value="Aventura">Aventura</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Preço de Venda (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="49.90"
                    value={newBookForm.price}
                    onChange={(e) => setNewBookForm({ ...newBookForm, price: e.target.value })}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Preço Original / De (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="69.90"
                    value={newBookForm.originalPrice}
                    onChange={(e) => setNewBookForm({ ...newBookForm, originalPrice: e.target.value })}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Formato</label>
                  <select
                    value={newBookForm.format}
                    onChange={(e) => setNewBookForm({ ...newBookForm, format: e.target.value })}
                    className={styles.formSelect}
                  >
                    <option value="Capa Dura">Capa Dura</option>
                    <option value="Brochura">Brochura</option>
                    <option value="Edição Especial">Edição Especial</option>
                    <option value="Box Colecionador">Box Colecionador</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Estoque (unidades)</label>
                  <input
                    type="number"
                    value={newBookForm.stock}
                    onChange={(e) => setNewBookForm({ ...newBookForm, stock: e.target.value })}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Ano de Publicação</label>
                  <input
                    type="number"
                    value={newBookForm.year}
                    onChange={(e) => setNewBookForm({ ...newBookForm, year: e.target.value })}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Páginas</label>
                  <input
                    type="number"
                    value={newBookForm.pages}
                    onChange={(e) => setNewBookForm({ ...newBookForm, pages: e.target.value })}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>URL da Imagem da Capa (Opcional)</label>
                <input
                  type="url"
                  placeholder="https://exemplo.com/capa.jpg"
                  value={newBookForm.coverImage}
                  onChange={(e) => setNewBookForm({ ...newBookForm, coverImage: e.target.value })}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Sinopse Completa *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Escreva a sinopse do livro para os compradores..."
                  value={newBookForm.synopsis}
                  onChange={(e) => setNewBookForm({ ...newBookForm, synopsis: e.target.value })}
                  className={styles.formTextarea}
                ></textarea>
              </div>

              <div className={styles.formFooterActions}>
                <button
                  type="button"
                  className={styles.btnFormCancel}
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.btnFormSubmit}>
                  Cadastrar Livro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <div className={styles.logoGroup}>
                <div className={styles.logoBadgeSmall}>
                  <Library size={18} />
                </div>
                <span className={styles.footerLogoTitle}>BIBLIOTECH</span>
              </div>
              <p className={styles.footerDesc}>
                Sua livraria online definitiva e clube literário exclusivo. Descubra recomendações personalizadas com base nos seus gêneros favoritos e receba os livros mais premiados na sua porta.
              </p>
            </div>

            <div className={styles.footerLinks}>
              <span className={styles.footerGroupTitle}>Navegação</span>
              <a href="#recomendados-section" className={styles.footerLinkItem}>Recomendações para Você</a>
              <a href="#catalogo-section" className={styles.footerLinkItem}>Livraria Online</a>
              <a href="#planos-section" className={styles.footerLinkItem}>Clube do Livro & Planos</a>
              <a href="#como-funciona" className={styles.footerLinkItem}>Como Funciona</a>
              <a href="#beneficios" className={styles.footerLinkItem}>Diferenciais</a>
            </div>

            <div className={styles.footerLinks}>
              <span className={styles.footerGroupTitle}>Pagamento Seguro</span>
              <span>PIX Instantâneo (5% OFF)</span>
              <span>Cartão de Crédito em 6x</span>
              <span>Boleto Bancário</span>
              <span>Certificado SSL Seguro</span>
            </div>

            <div className={styles.footerLinks}>
              <span className={styles.footerGroupTitle}>Atendimento</span>
              <span>suporte@bibliotech.com.br</span>
              <span>WhatsApp: (11) 98765-4321</span>
              <span>Seg à Sex: 08h às 20h</span>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>&copy; {new Date().getFullYear()} Bibliotech Livraria & Clube Literário • Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}