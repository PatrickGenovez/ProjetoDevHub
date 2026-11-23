import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Library,
  BookOpen,
  Star,
  Search,
  Eye,
  Plus,
  Minus,
  Filter,
  CheckCircle2,
  Bookmark,
  Calendar,
  User,
  Lock,
  FileText,
  X,
  ChevronLeft,
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
  RotateCcw,
  LayoutGrid,
  List,
  Crown,
  Flame,
  DollarSign,
  Coffee,
  Sliders
} from 'lucide-react';
import ThemeToggle from '../components/menu/ThemeToggle';
import CheckoutModal from '../components/checkout/CheckoutModal';
import Footer from '../components/common/Footer';
import styles from '../styles/index.module.css';

// Otimizador de URL de imagem de capas (converte para tamanho médio -M.jpg reduzindo peso da imagem)
export const getOptimizedCoverUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('covers.openlibrary.org') && url.includes('-L.jpg')) {
    return url.replace('-L.jpg', '-M.jpg');
  }
  return url;
};

// Gêneros disponíveis no catálogo
const AVAILABLE_GENRES = [
  { id: 'Todos', name: 'Todos os Gêneros' },
  { id: 'Clássicos', name: 'Clássicos' },
  { id: 'Romance', name: 'Romance' },
  { id: 'Ficção Científica', name: 'Ficção Científica' },
  { id: 'Fantasia', name: 'Fantasia' },
  { id: 'Suspense & Mistério', name: 'Suspense & Mistério' },
  { id: 'História & Biografias', name: 'História & Biografias' },
  { id: 'Tecnologia', name: 'Tecnologia' }
];

// Faixas de preço
const PRICE_RANGES = [
  { id: 'all', label: 'Todos os Preços' },
  { id: 'under30', label: 'Até R$ 30' },
  { id: '30to60', label: 'R$ 30 a R$ 60' },
  { id: 'over60', label: 'Acima de R$ 60' }
];

export default function CatalogoPage({ auth }) {
  const router = useRouter();

  // Estados principais de catálogo
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState('sales'); // 'sales' | 'price-asc' | 'price-desc' | 'rating' | 'title'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'under30' | '30to60' | 'over60'

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Modais e seleções
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalQty, setModalQty] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Usuário e Carrinho
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('pac'); // 'pac' | 'sedex'

  // Exibir Toast
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // Debounce do input de busca
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setIsSearching(false);
      setCurrentPage(1);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Carregar dados salvos no localStorage e sincronizar carrinho com a conta do leitor
  useEffect(() => {
    let isCancelled = false;

    try {
      const savedFavs = JSON.parse(localStorage.getItem('bibliotech_favs') || '[]');
      if (Array.isArray(savedFavs)) setFavorites(savedFavs);
    } catch (e) {}

    try {
      const storedUser = localStorage.getItem('userData');
      if (storedUser) setCurrentUser(JSON.parse(storedUser));
    } catch (e) {}

    const syncUserCart = async () => {
      const userKey = currentUser ? (currentUser.email || currentUser.id) : null;
      let localItems = [];

      try {
        const userSaved = userKey ? localStorage.getItem(`bibliotech_cart_${userKey}`) : null;
        const generalSaved = localStorage.getItem('bibliotech_cart');
        const raw = userSaved || generalSaved || '[]';
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Limpa e sanitiza qualquer quantidade inflada previamente
          localItems = parsed.map((item) => ({
            ...item,
            quantity: Math.min(Math.max(1, parseInt(item.quantity, 10) || 1), 20)
          }));
          if (!isCancelled) {
            setCart(localItems);
          }
        }
      } catch (e) {}

      // Se o usuário estiver autenticado, sincroniza com o backend
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token && currentUser) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const endpoint = localItems.length > 0 ? `${apiUrl}/cart/merge` : `${apiUrl}/cart`;
          const method = localItems.length > 0 ? 'POST' : 'GET';
          const body = localItems.length > 0 ? JSON.stringify({ items: localItems }) : undefined;

          const res = await fetch(endpoint, {
            method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body
          });

          if (res.ok && !isCancelled) {
            const json = await res.json();
            if (json.data && Array.isArray(json.data)) {
              const sanitized = json.data.map((item) => ({
                ...item,
                quantity: Math.min(Math.max(1, parseInt(item.quantity, 10) || 1), 20)
              }));
              setCart(sanitized);
              localStorage.setItem('bibliotech_cart', JSON.stringify(sanitized));
              if (userKey) {
                localStorage.setItem(`bibliotech_cart_${userKey}`, JSON.stringify(sanitized));
              }
            }
          }
        } catch (err) {
          console.warn('[Catalogo] Sincronização offline do carrinho.');
        }
      }
    };

    syncUserCart();

    // Sincronização reativa entre abas do navegador
    const handleStorage = (e) => {
      if (!e.key || e.key.includes('bibliotech_cart')) {
        try {
          const updated = JSON.parse(localStorage.getItem('bibliotech_cart') || '[]');
          if (Array.isArray(updated) && !isCancelled) setCart(updated);
        } catch (err) {}
      }
    };

    const handleCustomSync = () => {
      try {
        const updated = JSON.parse(localStorage.getItem('bibliotech_cart') || '[]');
        if (Array.isArray(updated) && !isCancelled) setCart(updated);
      } catch (err) {}
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('bibliotech_cart_updated', handleCustomSync);

    return () => {
      isCancelled = true;
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('bibliotech_cart_updated', handleCustomSync);
    };
  }, [currentUser]);

  // Sincronização reativa com sessão de autenticação
  useEffect(() => {
    if (auth?.user) {
      setCurrentUser(auth.user);
    }
  }, [auth]);

  // Carregamento dinâmico dos livros diretamente da API
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const fetchCatalog = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);

        let endpoint = `${apiUrl}/books?limit=80`;
        const params = new URLSearchParams();

        if (selectedGenre && selectedGenre !== 'Todos') {
          params.append('genre', selectedGenre);
        }
        if (searchTerm && searchTerm.trim()) {
          params.append('search', searchTerm.trim());
        }

        const queryStr = params.toString();
        if (queryStr) {
          endpoint = `${apiUrl}/books?${queryStr}&limit=60`;
        }

        const res = await fetch(endpoint, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok && !isCancelled) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data)) {
            setBooks(json.data);
            localStorage.setItem('bibliotech_live_books_v1', JSON.stringify(json.data));
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Erro ao carregar acervo da API:', err);
      }

      if (!isCancelled) {
        // Fallback em cache local persistido
        const saved = localStorage.getItem('bibliotech_live_books_v1');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed && Array.isArray(parsed) && parsed.length > 0) {
              setBooks(parsed);
            }
          } catch (e) {}
        }
        setIsLoading(false);
      }
    };

    fetchCatalog();

    return () => {
      isCancelled = true;
    };
  }, [selectedGenre, searchTerm]);

  // Gerenciamento de Carrinho com Persistência Local e na Conta
  const saveCart = async (newCart) => {
    setCart(newCart);
    const userKey = currentUser ? (currentUser.email || currentUser.id) : null;

    try {
      localStorage.setItem('bibliotech_cart', JSON.stringify(newCart));
      if (userKey) {
        localStorage.setItem(`bibliotech_cart_${userKey}`, JSON.stringify(newCart));
      }
      window.dispatchEvent(new Event('bibliotech_cart_updated'));
    } catch (e) {}

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && currentUser) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        await fetch(`${apiUrl}/cart`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ items: newCart })
        });
      } catch (err) {}
    }
  };

  const addToCart = (book, quantity = 1) => {
    const existingIndex = cart.findIndex((item) => String(item.id || item.book?.id) === String(book.id));
    let updated;
    if (existingIndex > -1) {
      updated = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: (item.quantity || 1) + quantity } : item
      );
    } else {
      updated = [
        ...cart,
        {
          id: book.id,
          title: book.title,
          author: book.author,
          price: book.price || 49.9,
          originalPrice: book.originalPrice || null,
          format: book.format || 'Brochura',
          coverImage: book.coverImage || '',
          coverGradient: book.coverGradient || '',
          genre: book.genre || 'Geral',
          quantity,
          book: { ...book }
        }
      ];
    }
    saveCart(updated);
    showToast(`"${book.title}" adicionado à sacola!`);
  };

  const updateCartQty = (bookId, delta) => {
    const updated = cart
      .map((item) => {
        const itemId = item.id || item.book?.id;
        if (String(itemId) === String(bookId)) {
          const newQty = (item.quantity || 1) + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);
    saveCart(updated);
  };

  const removeFromCart = (bookId) => {
    const updated = cart.filter((item) => String(item.id || item.book?.id) !== String(bookId));
    saveCart(updated);
    showToast('Item removido da sacola.');
  };

  const cartTotalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price || 49.90) * (item.quantity || 1), 0);
  }, [cart]);

  // Identifica se o usuário é Membro VIP
  const isVip = useMemo(() => {
    if (!currentUser) return false;
    const plan = String(currentUser.plano_id || currentUser.subscription || currentUser.plan || '').toLowerCase();
    return plan === 'vip' || plan === 'master' || plan === 'box-vip' || Boolean(currentUser.isVip);
  }, [currentUser]);

  const vipDiscount = useMemo(() => {
    if (!isVip) return 0;
    return parseFloat((cartSubtotal * 0.20).toFixed(2));
  }, [isVip, cartSubtotal]);

  const shippingCost = useMemo(() => {
    if (isVip) return 0; // VIP = Frete totalmente grátis para todo o Brasil
    if (cartSubtotal >= 99 || cartSubtotal === 0) return 0;
    return shippingMethod === 'sedex' ? 24.90 : 12.90;
  }, [isVip, cartSubtotal, shippingMethod]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - vipDiscount + shippingCost);
  }, [cartSubtotal, vipDiscount, shippingCost]);

  // Favoritos
  const toggleFavorite = (book) => {
    const exists = favorites.some((f) => String(f.id) === String(book.id));
    let updated;
    if (exists) {
      updated = favorites.filter((f) => String(f.id) !== String(book.id));
      showToast('Removido dos seus favoritos.');
    } else {
      updated = [...favorites, book];
      showToast(`⭐ "${book.title}" salvo nos favoritos!`);
    }
    setFavorites(updated);
    try {
      localStorage.setItem('bibliotech_favs', JSON.stringify(updated));
    } catch (e) {}
  };

  const isFavorited = (bookId) => {
    return favorites.some((f) => String(f.id) === String(bookId));
  };

  // Contagem dinâmica por gênero
  const getGenreCount = useCallback(
    (genreId) => {
      if (genreId === 'Todos') return books.length;
      return books.filter((b) => b.genre && b.genre.toLowerCase() === genreId.toLowerCase()).length;
    },
    [books]
  );

  // Filtragem e Ordenação dos Livros
  const filteredBooks = useMemo(() => {
    let list = [...books];

    // Busca textual local rápida
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(
        (b) =>
          (b.title && b.title.toLowerCase().includes(q)) ||
          (b.author && b.author.toLowerCase().includes(q)) ||
          (b.synopsis && b.synopsis.toLowerCase().includes(q))
      );
    }

    // Filtro por gênero
    if (selectedGenre !== 'Todos') {
      list = list.filter((b) => b.genre && b.genre.toLowerCase() === selectedGenre.toLowerCase());
    }

    // Filtro por faixa de preço / tributo
    if (priceFilter === 'under30') {
      list = list.filter((b) => (b.price || 49.9) <= 30);
    } else if (priceFilter === '30to60') {
      list = list.filter((b) => (b.price || 49.9) >= 30 && (b.price || 49.9) <= 60);
    } else if (priceFilter === 'over60') {
      list = list.filter((b) => (b.price || 49.9) > 60);
    }

    // Ordenação
    list.sort((a, b) => {
      if (sortBy === 'sales') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      return 0;
    });

    return list;
  }, [books, searchTerm, selectedGenre, sortBy, priceFilter]);

  // Paginação
  const totalPages = Math.ceil(filteredBooks.length / pageSize) || 1;
  const displayedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredBooks.slice(startIndex, startIndex + pageSize);
  }, [filteredBooks, currentPage, pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setCurrentUser(null);
    showToast('Você saiu da sua conta.');
  };

  // Renderização unificada do acervo (grid, lista, loading, vazio, paginação)
  const renderBooksContent = () => (
    <>
      {/* Meta informações do resultado */}
      <div className={styles.catalogExplorerHeading}>
        <div className={styles.catalogExplorerTitleGroup}>
          <span className={styles.catalogExplorerBadge}>
            <BookOpen size={13} />
            Acervo Disponível
          </span>
          <h2 className={styles.catalogExplorerTitle}>
            {selectedGenre === 'Todos' ? 'Todas as Obras' : `Gênero: ${selectedGenre}`}
            {searchTerm && ` • Busca: "${searchTerm}"`}
            {priceFilter !== 'all' && ` • ${PRICE_RANGES.find((p) => p.id === priceFilter)?.label}`}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted, #94a3b8)' }}>
            {filteredBooks.length} {filteredBooks.length === 1 ? 'livro encontrado' : 'livros encontrados'}
          </span>

          {/* Seletor de Itens por Página */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className={styles.sortSelect}
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
            aria-label="Livros por página"
          >
            <option value={12}>12 por página</option>
            <option value={24}>24 por página</option>
            <option value={36}>36 por página</option>
          </select>
        </div>
      </div>

      {/* Estado de Carregamento */}
      {isLoading && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 1rem',
            gap: '1rem'
          }}
        >
          <Loader2 size={36} className={styles.searchSpinner} style={{ color: 'var(--color-primary, #8e1f1f)' }} />
          <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.95rem' }}>
            Carregando catálogo de livros...
          </p>
        </div>
      )}

      {/* Estado Vazio */}
      {!isLoading && displayedBooks.length === 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 1rem',
            textAlign: 'center',
            gap: '1rem'
          }}
        >
          <BookOpen size={48} color="var(--color-primary, #8e1f1f)" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Nenhum livro encontrado</h3>
          <p style={{ color: 'var(--text-muted, #94a3b8)', maxWidth: '420px' }}>
            Não encontramos resultados para os filtros selecionados. Tente buscar outro termo ou limpar os filtros.
          </p>
          <button
            className={styles.btnCartBrowse}
            onClick={() => {
              setSearchInput('');
              setSearchTerm('');
              setSelectedGenre('Todos');
              setPriceFilter('all');
            }}
          >
            Limpar Filtros
          </button>
        </div>
      )}

      {/* Grid de Livros (Visualização Grade) */}
      {!isLoading && displayedBooks.length > 0 && viewMode === 'grid' && (
        <div className={styles.booksGrid}>
          {displayedBooks.map((book) => {
            const cover = getOptimizedCoverUrl(book.coverImage);
            const fav = isFavorited(book.id);

            return (
              <div key={book.id} className={styles.bookCard}>
                {/* Badge superior */}
                <div className={styles.cardBadgeRow}>
                  <span className={styles.customCardBadge}>{book.badge || 'Disponível'}</span>
                  {book.discountPercent > 0 && (
                    <span className={styles.cleanDiscountBadge}>-{book.discountPercent}% OFF</span>
                  )}
                </div>

                {/* Capa */}
                <div
                  className={styles.bookCover}
                  onClick={() => {
                    setSelectedBook(book);
                    setModalQty(1);
                  }}
                  title="Clique para ver sinopse e detalhes"
                >
                  {cover ? (
                    <img
                      src={cover}
                      alt={book.title}
                      className={styles.bookCoverImage}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className={styles.bookCoverFallback}
                      style={{ background: book.coverGradient }}
                    >
                      <BookOpen size={36} className={styles.coverBookIcon} />
                      <span style={{ fontSize: '0.8rem', padding: '0 0.5rem', textAlign: 'center' }}>
                        {book.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Corpo do Card */}
                <div className={styles.bookCardBody}>
                  <div className={styles.bookInfoTop}>
                    <span className={styles.vikingCardGenre}>
                      {book.genre}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Star size={13} fill="#f59e0b" color="#f59e0b" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{book.rating}</span>
                    </div>
                  </div>

                  <h3
                    className={styles.bookTitle}
                    onClick={() => {
                      setSelectedBook(book);
                      setModalQty(1);
                    }}
                    title={book.title}
                  >
                    {book.title}
                  </h3>

                  <div className={styles.bookAuthorRow}>
                    <span className={styles.bookAuthor}>{book.author}</span>
                  </div>

                  {/* Bloco de Preços */}
                  <div className={styles.cardPricingBox}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                      <span className={styles.cardCurrentPrice}>
                        <span className={styles.vikingCoinSymbol}>ᛗ</span>
                        R$ {(book.price || 49.90).toFixed(2).replace('.', ',')}
                      </span>
                      {book.originalPrice && book.originalPrice > book.price && (
                        <span className={styles.cardOldPrice}>
                          R$ {book.originalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                      <span style={{ fontSize: '0.70rem', color: '#c69238', fontWeight: 700, background: 'rgba(198, 146, 56, 0.12)', padding: '2px 6px', borderRadius: '4px' }}>
                        VIP: R$ {((book.price || 49.90) * 0.8).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <span className={styles.cardInstallments}>
                      ou 3x de R$ {((book.price || 49.90) / 3).toFixed(2).replace('.', ',')} sem juros
                    </span>
                  </div>

                  {/* Botões de Ação */}
                  <div className={styles.cardActions}>
                    <button
                      className={styles.btnAddToCart}
                      onClick={() => addToCart(book, 1)}
                      title="Adicionar à sacola de compras"
                    >
                      <ShoppingBag size={15} />
                      <span>Adicionar</span>
                    </button>
                    <button
                      className={`${styles.btnModalFav} ${fav ? styles.btnModalFavActive : ''}`}
                      onClick={() => toggleFavorite(book)}
                      title={fav ? 'Remover dos favoritos' : 'Favoritar livro'}
                      style={{ width: '38px', height: '38px', padding: 0 }}
                    >
                      <Heart size={16} fill={fav ? '#ef4444' : 'none'} color={fav ? '#ef4444' : 'currentColor'} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lista de Livros (Visualização Lista) */}
      {!isLoading && displayedBooks.length > 0 && viewMode === 'list' && (
        <div className={styles.booksList}>
          {displayedBooks.map((book) => {
            const cover = getOptimizedCoverUrl(book.coverImage);
            const fav = isFavorited(book.id);

            return (
              <div key={book.id} className={styles.bookCardList}>
                <div
                  className={styles.bookCardListCover}
                  onClick={() => {
                    setSelectedBook(book);
                    setModalQty(1);
                  }}
                >
                  {cover ? (
                    <img src={cover} alt={book.title} className={styles.bookCardListCoverImg} loading="lazy" />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: book.coverGradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <BookOpen size={24} color="#fff" />
                    </div>
                  )}
                </div>

                <div className={styles.bookCardListBody}>
                  <div className={styles.bookCardListTop}>
                    <div className={styles.bookCardListMeta}>
                      <span className={styles.vikingCardGenre}>
                        {book.genre}
                      </span>
                      <span>•</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {book.format} • {book.pages} págs.
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Star size={13} fill="#f59e0b" color="#f59e0b" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{book.rating}</span>
                    </div>
                  </div>

                  <h3
                    className={styles.bookCardListTitle}
                    onClick={() => {
                      setSelectedBook(book);
                      setModalQty(1);
                    }}
                  >
                    {book.title}
                  </h3>
                  <p className={styles.bookCardListAuthor}>Por {book.author}</p>
                  <p className={styles.bookCardListSynopsis}>
                    {book.synopsis && book.synopsis.length > 180
                      ? book.synopsis.slice(0, 180) + '...'
                      : book.synopsis}
                  </p>

                  <div className={styles.bookCardListFooter}>
                    <div className={styles.bookCardListPrice}>
                      <span className={styles.bookCardListCurrentPrice}>
                        <span className={styles.vikingCoinSymbol}>ᛗ</span>
                        R$ {(book.price || 49.90).toFixed(2).replace('.', ',')}
                      </span>
                      {book.originalPrice && book.originalPrice > book.price && (
                        <span className={styles.bookCardListOldPrice}>
                          R$ {book.originalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                    </div>

                    <div className={styles.bookCardListActions}>
                      <button
                        className={`${styles.btnModalFav} ${fav ? styles.btnModalFavActive : ''}`}
                        onClick={() => toggleFavorite(book)}
                        style={{ width: '36px', height: '36px', padding: 0 }}
                      >
                        <Heart size={16} fill={fav ? '#ef4444' : 'none'} color={fav ? '#ef4444' : 'currentColor'} />
                      </button>
                      <button className={styles.btnAddToCart} onClick={() => addToCart(book, 1)}>
                        <ShoppingBag size={15} />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Paginação */}
      {!isLoading && totalPages > 1 && (
        <div className={styles.paginationWrapper} style={{ marginTop: '2.5rem' }}>
          <div className={styles.paginationHeader}>
            <span className={styles.paginationInfo}>
              Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> ({filteredBooks.length} obras)
            </span>
          </div>

          <div className={styles.paginationPagesRow}>
            <button
              className={styles.paginationNavBtn}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              title="Página anterior"
            >
              <ChevronLeft size={16} />
              <span>Anterior</span>
            </button>

            <div className={styles.paginationNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 7) return true;
                  if (p === 1 || p === totalPages) return true;
                  return Math.abs(p - currentPage) <= 2;
                })
                .map((pageNum, idx, arr) => {
                  const showEllipsisBefore = idx > 0 && pageNum - arr[idx - 1] > 1;

                  return (
                    <div key={pageNum} style={{ display: 'inline-flex', alignItems: 'center' }}>
                      {showEllipsisBefore && <span className={styles.paginationEllipsis}>...</span>}
                      <button
                        className={`${styles.paginationNumber} ${
                          currentPage === pageNum ? styles.paginationNumberActive : ''
                        }`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </div>
                  );
                })}
            </div>

            <button
              className={styles.paginationNavBtn}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Próxima página"
            >
              <span>Próxima</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className={styles.pageWrapper}>
      <Head>
        <title>Catálogo Oficial de Livros • Bibliotech Livraria</title>
        <meta
          name="description"
          content="Explore o catálogo completo de livros da Bibliotech. Obras clássicas, literatura brasileira, ficção científica, fantasia e mais com entrega rápida."
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
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div className={styles.logoGroup}>
                <div className={styles.logoBadge}>
                  <Library size={24} className={styles.logoIcon} />
                </div>
                <div className={styles.logoTitleBlock}>
                  <span className={styles.logoTitle}>BIBLIOTECH</span>
                  <span className={styles.logoSubtitle}>Livraria & Clube Literário</span>
                </div>
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
                className={`${styles.navItem} ${styles.navItemCommunity} ${router.pathname === '/comunidade' ? styles.navItemActive : ''}`}
                title="Acessar o Canal de Comunicação entre Leitores"
              >
                <Users size={16} className={styles.navCommunityIcon} />
                <span>Comunidade</span>
                <span className={styles.navCommunityBadge}>Canal</span>
              </Link>
            </nav>

            {/* Header Actions */}
            <div className={styles.headerActions}>
              {currentUser ? (
                <>
                  <button
                    className={styles.btnCart}
                    onClick={() => setIsCartOpen(true)}
                    title="Abrir sacola de compras"
                    id="btn-cart-toggle"
                  >
                    <ShoppingBag size={18} />
                    <span className={styles.btnCartLabel}>Sacola</span>
                    {cartTotalItems > 0 && <span className={styles.cartBadge}>{cartTotalItems}</span>}
                  </button>

                  <div className={styles.userLoggedGroup}>
                    <div className={styles.userBadge} title={currentUser.email}>
                      <div className={styles.userAvatar}>
                        {currentUser.full_name
                          ? currentUser.full_name[0].toUpperCase()
                          : currentUser.email
                          ? currentUser.email[0].toUpperCase()
                          : 'U'}
                      </div>
                      <span className={styles.userName}>
                        {currentUser.full_name
                          ? currentUser.full_name.split(' ')[0]
                          : currentUser.email.split('@')[0]}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className={styles.btnLogout}
                      title="Desconectar da conta"
                    >
                      <LogOut size={14} />
                    </button>
                  </div>
                </>
              ) : (
                <div className={styles.authButtonGroup}>
                  <Link href="/login?tab=login" className={styles.btnLogin} id="btn-login">
                    <LogIn size={15} />
                    <span>Entrar</span>
                  </Link>
                  <Link href="/login?tab=signup" className={styles.btnSignup} id="btn-signup">
                    <span>Criar Conta</span>
                  </Link>
                </div>
              )}

              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.container} style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
        {/* Cabeçalho Clean do Catálogo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className={styles.mainSectionTitle}>Catálogo de Livros</h1>
          <p className={styles.mainSectionDesc}>
            Explore títulos autênticos com integração direta à Open Library. Edições físicas e digitais com entrega rápida para todo o Brasil.
          </p>
        </div>

        <div className={styles.catalogExplorerWrapper}>
          {/* Barra de Pesquisa e Ordenação */}
          <div className={styles.searchBarContainer}>
            <div className={styles.searchInputWrapper}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar livro por título, autor, assunto ou palavra-chave..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className={styles.searchInput}
                id="catalog-search-input"
              />
              {isSearching && <Loader2 size={16} className={styles.searchSpinner} />}
              {searchInput && (
                <button
                  className={styles.clearSearchBtn}
                  onClick={() => {
                    setSearchInput('');
                    setSearchTerm('');
                  }}
                  title="Limpar busca"
                  aria-label="Limpar busca"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className={styles.searchControlsRight}>
              <div className={styles.sortSelectWrapper}>
                <ArrowUpDown size={15} className={styles.sortIcon} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.sortSelect}
                  aria-label="Ordenar livros"
                >
                  <option value="sales">Mais Vendidos</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="rating">Melhor Avaliados</option>
                  <option value="title">Título (A-Z)</option>
                </select>
              </div>

              <div className={styles.viewModeToggle} role="group" aria-label="Modo de visualização">
                <button
                  type="button"
                  className={`${styles.viewModeBtn} ${viewMode === 'grid' ? styles.viewModeBtnActive : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Visualização em Grade"
                  aria-label="Visualização em Grade"
                >
                  <LayoutGrid size={17} />
                </button>
                <button
                  type="button"
                  className={`${styles.viewModeBtn} ${viewMode === 'list' ? styles.viewModeBtnActive : ''}`}
                  onClick={() => setViewMode('list')}
                  title="Visualização em Lista"
                  aria-label="Visualização em Lista"
                >
                  <List size={17} />
                </button>
              </div>
            </div>
          </div>

          {/* Pílulas de Filtro por Gênero */}
          <div className={styles.genreFiltersContainer}>
            <span className={styles.genreFilterLabel}>
              <Filter size={14} />
              Gênero:
            </span>
            <div className={styles.genrePillsList}>
              {AVAILABLE_GENRES.map((g) => (
                <button
                  key={g.id}
                  className={`${styles.genrePill} ${selectedGenre === g.id ? styles.genrePillActive : ''}`}
                  onClick={() => {
                    setSelectedGenre(g.id);
                    setCurrentPage(1);
                  }}
                >
                  <span>{g.name}</span>
                  {selectedGenre === g.id && (
                    <span className={styles.genrePillCount}>{filteredBooks.length}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Renderização do Acervo (Heading, Grid/List, Paginação) */}
          {renderBooksContent()}
        </div>
      </main>

      {/* ===== MODAL DE DETALHES DO LIVRO ===== */}
      {selectedBook && (
        <div className={styles.modalOverlay} onClick={() => setSelectedBook(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalCloseBtn}
              onClick={() => setSelectedBook(null)}
              title="Fechar janela"
            >
              <X size={18} />
            </button>

            <div className={styles.modalGrid}>
              {/* Coluna da Capa */}
              <div>
                <div
                  className={styles.modalCover}
                  style={{
                    background: selectedBook.coverImage ? 'transparent' : selectedBook.coverGradient
                  }}
                >
                  {selectedBook.coverImage ? (
                    <img
                      src={selectedBook.coverImage}
                      alt={selectedBook.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                    />
                  ) : (
                    <div>
                      <BookOpen size={48} color="#fff" />
                      <h4 className={styles.modalCoverTitle}>{selectedBook.title}</h4>
                      <p className={styles.modalCoverAuthor}>{selectedBook.author}</p>
                      <span className={styles.modalCoverYear}>{selectedBook.year}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Coluna de Informações e Compra */}
              <div className={styles.modalDetails}>
                <div className={styles.modalGenreRow}>
                  <span
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#10b981',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}
                  >
                    {selectedBook.genre}
                  </span>
                  <span
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '999px',
                      fontSize: '0.8rem'
                    }}
                  >
                    {selectedBook.format}
                  </span>
                </div>

                <h2 className={styles.modalTitle}>{selectedBook.title}</h2>
                <div className={styles.modalAuthorRow}>
                  <span>Por <strong>{selectedBook.author}</strong></span>
                </div>

                <div className={styles.modalRatingRow}>
                  <div className={styles.modalStarsBox}>
                    <Star size={16} fill="#f59e0b" color="#f59e0b" />
                    <span className={styles.modalRatingScore}>{selectedBook.rating}</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    ({selectedBook.reviewsCount || 180} avaliações de leitores)
                  </span>
                </div>

                {/* Preço */}
                <div className={styles.modalPriceContainer}>
                  <div className={styles.modalPriceTop}>
                    <span className={styles.modalCurrentPrice}>
                      R$ {(selectedBook.price || 49.90).toFixed(2).replace('.', ',')}
                    </span>
                    {selectedBook.originalPrice && selectedBook.originalPrice > selectedBook.price && (
                      <span className={styles.modalOldPrice}>
                        R$ {selectedBook.originalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                    {selectedBook.discountPercent > 0 && (
                      <span className={styles.modalDiscountTag}>
                        -{selectedBook.discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  <p className={styles.modalInstallments}>
                    Em até 3x de R$ {((selectedBook.price || 49.90) / 3).toFixed(2).replace('.', ',')} sem juros no cartão
                  </p>
                </div>

                {/* Metadados Técnicos */}
                <div className={styles.modalMetaGrid}>
                  <div className={styles.modalMetaItem}>
                    <span>Ano de Publicação</span>
                    <strong>{selectedBook.year || 2021}</strong>
                  </div>
                  <div className={styles.modalMetaItem}>
                    <span>Páginas</span>
                    <strong>{selectedBook.pages || 320} págs.</strong>
                  </div>
                  <div className={styles.modalMetaItem}>
                    <span>Estoque</span>
                    <strong style={{ color: '#10b981' }}>{selectedBook.stock || 20} unidades</strong>
                  </div>
                  <div className={styles.modalMetaItem}>
                    <span>Disponibilidade</span>
                    <strong>Envio Imediato</strong>
                  </div>
                </div>

                {/* Sinopse */}
                <div className={styles.modalSynopsisBox}>
                  <h4>Sinopse Oficial da Obra</h4>
                  <p className={styles.modalSynopsisParagraph}>
                    {selectedBook.synopsis ||
                      'Obra literária de destaque catalogada com edição física disponível para envio imediato.'}
                  </p>
                </div>

                {/* Ações de Compra */}
                <div className={styles.modalActions}>
                  <div className={styles.cartQtyControls} style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <button
                      className={styles.cartQtyBtn}
                      onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontWeight: 700, padding: '0 0.5rem' }}>{modalQty}</span>
                    <button
                      className={styles.cartQtyBtn}
                      onClick={() => setModalQty(modalQty + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    className={styles.btnModalAddToCart}
                    onClick={() => {
                      addToCart(selectedBook, modalQty);
                      setSelectedBook(null);
                    }}
                  >
                    <ShoppingBag size={18} />
                    <span>Adicionar à Sacola</span>
                  </button>

                  <button
                    className={`${styles.btnModalFav} ${
                      isFavorited(selectedBook.id) ? styles.btnModalFavActive : ''
                    }`}
                    onClick={() => toggleFavorite(selectedBook)}
                    title="Favoritar livro"
                  >
                    <Heart
                      size={20}
                      fill={isFavorited(selectedBook.id) ? '#ef4444' : 'none'}
                      color={isFavorited(selectedBook.id) ? '#ef4444' : 'currentColor'}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== DRAWER DA SACOLA DE COMPRAS ===== */}
      {isCartOpen && (
        <div className={styles.cartOverlay} onClick={() => setIsCartOpen(false)}>
          <div className={styles.cartDrawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.cartHeader}>
              <div className={styles.cartHeaderTitleBox}>
                <ShoppingBag size={22} className={styles.cartIconPrimary} />
                <div>
                  <h3 className={styles.cartTitle}>Minha Sacola</h3>
                  <span className={styles.cartCountSubtitle}>
                    {cartTotalItems} {cartTotalItems === 1 ? 'item' : 'itens'} adicionados
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

            {/* Lista de Itens */}
            <div className={styles.cartItemsList}>
              {cart.length === 0 ? (
                <div className={styles.cartEmptyState}>
                  <ShoppingCart size={48} className={styles.cartEmptyIcon} />
                  <h4>Sua sacola está vazia</h4>
                  <p>Explore nosso catálogo e adicione os títulos que deseja ler.</p>
                  <button className={styles.btnCartBrowse} onClick={() => setIsCartOpen(false)}>
                    Continuar Comprando
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className={styles.cartItemCard}>
                    <div className={styles.cartItemCover}>
                      {item.coverImage ? (
                        <img
                          src={getOptimizedCoverUrl(item.coverImage)}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          className={styles.cartItemCoverPlaceholder}
                          style={{ background: item.coverGradient }}
                        >
                          <BookOpen size={18} color="#fff" />
                        </div>
                      )}
                    </div>

                    <div className={styles.cartItemDetails}>
                      <div className={styles.cartItemTopRow}>
                        <h4 className={styles.cartItemTitle}>{item.title}</h4>
                        <button
                          className={styles.btnCartRemove}
                          onClick={() => removeFromCart(item.id)}
                          title="Remover item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className={styles.cartItemMeta}>
                        <span className={styles.cartItemAuthor}>{item.author}</span>
                        <span>•</span>
                        <span className={styles.cartItemFormat}>{item.format}</span>
                      </div>

                      <div className={styles.cartItemBottomRow}>
                        <div className={styles.cartQtyControls}>
                          <button
                            className={styles.cartQtyBtn}
                            onClick={() => updateCartQty(item.id, -1)}
                          >
                            <Minus size={13} />
                          </button>
                          <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                            {item.quantity}
                          </span>
                          <button
                            className={styles.cartQtyBtn}
                            onClick={() => updateCartQty(item.id, 1)}
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <div className={styles.cartItemPriceBlock}>
                          <span className={styles.cartItemPrice}>
                            R$ {((item.price || 49.90) * item.quantity).toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Rodapé da Sacola com Totais e Checkout */}
            {cart.length > 0 && (
              <div className={styles.cartFooter}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                    <span>R$ {cartSubtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {isVip && vipDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#c69238', fontWeight: 600 }}>
                      <span>⭐ Desconto Membro VIP (20%)</span>
                      <span>- R$ {vipDiscount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Frete</span>
                    <span style={{ color: shippingCost === 0 ? '#10b981' : 'inherit', fontWeight: shippingCost === 0 ? 700 : 400 }}>
                      {isVip ? 'GRÁTIS (VIP Brasil)' : shippingCost === 0 ? 'GRÁTIS' : `R$ ${shippingCost.toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      paddingTop: '0.5rem',
                      borderTop: '1px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    <span>Total</span>
                    <span style={{ color: '#10b981' }}>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                <button
                  className={styles.btnCheckout}
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutModalOpen(true);
                  }}
                >
                  <CreditCard size={18} />
                  <span>Finalizar Pedido (R$ {cartTotal.toFixed(2).replace('.', ',')})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== MODAL DE CHECKOUT INTELIGENTE COM FRETE POR CEP E CUPOM ===== */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cart={cart}
        currentUser={currentUser}
        onOrderSuccess={(order) => {
          saveCart([]);
          showToast(`🎉 Pedido #${order.orderId} confirmado com sucesso!`);
        }}
      />

      {/* Footer Moderno & Viking */}
      <Footer />
    </div>
  );
}
