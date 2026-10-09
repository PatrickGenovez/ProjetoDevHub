import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Library,
  BookOpen,
  Star,
  Search,
  Plus,
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
  Award
} from 'lucide-react';
import ThemeToggle from '../components/menu/ThemeToggle';
import styles from '../styles/index.module.css';

// Catálogo inicial padrão da biblioteca
const DEFAULT_BOOKS = [
  {
    id: 1,
    title: 'Duna',
    author: 'Frank Herbert',
    genre: 'Ficção Científica',
    rating: 4.9,
    reviewsCount: 1840,
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
    synopsis: 'Frodo Bolseiro, um hobbit da pacata Comarca, herda um anel mágico ancestral e descobre que ele tem o poder de escravizar toda a Terra-média nas mãos do Senhor do Escuro, Sauron.',
    year: 1954,
    pages: 576,
    status: 'Disponível',
    coverImage: 'https://covers.openlibrary.org/b/id/14547565-M.jpg',
    coverGradient: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #065f46 100%)',
    accentColor: '#34d399'
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    genre: 'Distopia',
    rating: 4.8,
    reviewsCount: 3150,
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
    synopsis: 'Bilbo Bolseiro vive uma vida tranquila no Condado até ser surpreendido pelo mago Gandalf e uma companhia de treze anões para recuperar um tesouro guardado pelo temível dragão Smaug.',
    year: 1937,
    pages: 310,
    status: 'Emprestado',
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
    synopsis: 'Um piloto cai no deserto do Saara e encontra um menino misterioso vindo de um asteroide distante. Uma fábula poética sobre amizade, amor, perda e o que é verdadeiramente essencial aos olhos.',
    year: 1943,
    pages: 96,
    status: 'Disponível',
    coverImage: 'https://covers.openlibrary.org/b/id/10574187-M.jpg',
    coverGradient: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #065f46 100%)',
    accentColor: '#10b981'
  }
];

export default function BookLibrary() {
  const [books, setBooks] = useState(DEFAULT_BOOKS);
  const [searchSource, setSearchSource] = useState('local'); // 'local' | 'google' | 'openlibrary'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'title' | 'year'
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Estados de APIs Externas
  const [apiBooks, setApiBooks] = useState([]);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [autofillQuery, setAutofillQuery] = useState('');
  const [isAutofilling, setIsAutofilling] = useState(false);

  // Form para novo livro
  const [newBookForm, setNewBookForm] = useState({
    title: '',
    author: '',
    genre: 'Ficção Científica',
    rating: '5.0',
    synopsis: '',
    year: '2024',
    pages: '300',
    coverImage: ''
  });

  // Carregar catálogo local e usuário autenticado
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

      const saved = localStorage.getItem('library_books');
      if (saved) {
        try {
          setBooks(JSON.parse(saved));
        } catch (e) {}
      }
    };

    fetchBooks();

    try {
      const savedFavs = JSON.parse(localStorage.getItem('library_favs') || '[]');
      setFavorites(savedFavs);
    } catch (e) {}

    try {
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (e) {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setCurrentUser(null);
    showToast('Você saiu da sua conta.');
  };

  const updateBooks = (updatedList) => {
    setBooks(updatedList);
    try {
      localStorage.setItem('library_books', JSON.stringify(updatedList));
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
      localStorage.setItem('library_favs', JSON.stringify(updated));
    } catch (e) {}
    showToast(isFav ? 'Removido dos favoritos' : 'Adicionado aos favoritos!');
  };

  // Empréstimo
  const toggleBorrowStatus = (book) => {
    const newStatus = book.status === 'Disponível' ? 'Emprestado' : 'Disponível';
    const updated = books.map((b) => (b.id === book.id ? { ...b, status: newStatus } : b));
    updateBooks(updated);

    if (selectedBook && selectedBook.id === book.id) {
      setSelectedBook({ ...selectedBook, status: newStatus });
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      fetch(`${apiUrl}/books/${book.id}/toggle-status`, { method: 'PATCH' }).catch(() => {});
    } catch (e) {}

    showToast(
      newStatus === 'Emprestado'
        ? `Você pegou "${book.title}" emprestado!`
        : `"${book.title}" foi devolvido para a estante!`
    );
  };

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

          return {
            id: `gb-${item.id || idx}`,
            title: info.title || 'Título Desconhecido',
            author: info.authors ? info.authors.join(', ') : 'Autor Desconhecido',
            genre: categories.split('/')[0].trim(),
            rating: info.averageRating || 4.5,
            reviewsCount: info.ratingsCount || 50,
            synopsis: info.description || 'Sinopse não informada pelo Google Books.',
            year: info.publishedDate ? parseInt(info.publishedDate.substring(0, 4)) : 2020,
            pages: info.pageCount || 250,
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

          return {
            id: `ol-${doc.key || idx}`,
            title: doc.title || 'Título Desconhecido',
            author: doc.author_name ? doc.author_name.join(', ') : 'Autor Desconhecido',
            genre: subject.split(',')[0].trim(),
            rating: doc.ratings_average ? parseFloat(doc.ratings_average.toFixed(1)) : 4.6,
            reviewsCount: doc.ratings_count || 120,
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
    showToast(`"${book.title}" importado para a biblioteca com sucesso!`);
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

    const newBook = {
      id: Date.now(),
      title: newBookForm.title,
      author: newBookForm.author,
      genre: newBookForm.genre,
      rating: parseFloat(newBookForm.rating) || 5.0,
      reviewsCount: 1,
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
      synopsis: '',
      year: '2024',
      pages: '300',
      coverImage: ''
    });
    setAutofillQuery('');
    showToast(`Livro "${newBook.title}" cadastrado com sucesso!`);
  };

  const genresList = useMemo(() => {
    const set = new Set(books.map((b) => b.genre));
    return ['Todos', ...Array.from(set)];
  }, [books]);

  const filteredLocalBooks = useMemo(() => {
    return books
      .filter((book) => {
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
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'year') return b.year - a.year;
        return 0;
      });
  }, [books, selectedGenre, searchTerm, sortBy]);

  const displayedBooks = searchSource === 'local' ? filteredLocalBooks : apiBooks;

  const stats = useMemo(() => {
    const total = books.length;
    const available = books.filter((b) => b.status === 'Disponível').length;
    const avgRating =
      total > 0 ? (books.reduce((acc, b) => acc + b.rating, 0) / total).toFixed(1) : '5.0';
    const genresCount = new Set(books.map((b) => b.genre)).size;
    return { total, available, avgRating, genresCount };
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

  return (
    <div className={styles.pageWrapper}>
      <Head>
        <title>Biblioteca Virtual • Explore Livros, Avaliações e Sinopses</title>
        <meta
          name="description"
          content="Sua biblioteca digital inteligente integrada com Google Books e Open Library. Encontre grandes obras, leia resumos e gerencie seus empréstimos."
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

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            {/* Logo */}
            <div className={styles.logoGroup}>
              <div className={styles.logoBadge}>
                <Library size={24} className={styles.logoIcon} />
              </div>
              <div className={styles.logoTitleBlock}>
                <span className={styles.logoTitle}>BIBLIOTECA VIRTUAL</span>
                <span className={styles.logoSubtitle}>Catálogo & Avaliações</span>
              </div>
            </div>

            {/* Menu Nav Links */}
            <nav className={styles.navLinks}>
              <a href="#como-funciona" className={styles.navItem}>Como Funciona</a>
              <a href="#beneficios" className={styles.navItem}>Benefícios</a>
              <a href="#catalogo-section" className={styles.navItem}>Catálogo</a>
              <a href="#depoimentos" className={styles.navItem}>Depoimentos</a>
            </nav>

            {/* Header Actions: Log in e Sign up */}
            <div className={styles.headerActions}>
              {!currentUser ? (
                <div className={styles.authButtonGroup}>
                  <Link href="/login?tab=login" className={styles.btnLogin} id="btn-login">
                    <LogIn size={15} />
                    <span>Log in</span>
                  </Link>
                  <Link href="/login?tab=signup" className={styles.btnSignup} id="btn-signup">
                    <UserPlus size={15} />
                    <span>Sign up</span>
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
                    title="Cadastrar nova obra"
                  >
                    <Plus size={15} />
                    <span>Adicionar Livro</span>
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

      <main>
        {/* ===== 1. HERO SECTION (INSTITUCIONAL & IMPACTO) ===== */}
        <section className={styles.heroSection}>
          <div className={styles.heroGlow}></div>
          <div className={styles.container}>
            <div className={styles.heroGrid}>
              {/* Coluna Esquerda: Texto e Chamadas para Ação */}
              <div className={styles.heroTextCol}>
                <div className={styles.heroBadge}>
                  <Sparkles size={15} />
                  <span>A Sua Biblioteca Digital Inteligente</span>
                </div>

                <h1 className={styles.heroTitle}>
                  Descubra, avalie e leia com{' '}
                  <span className={styles.gradientText}>sinopses completas</span>
                </h1>

                <p className={styles.heroDescription}>
                  Acesso ilimitado ao catálogo local e integração em tempo real com milhões de livros do <strong>Google Books</strong> e <strong>Open Library</strong>. Encontre sua próxima grande história com notas e resumos da comunidade.
                </p>

                <div className={styles.heroCtaGroup}>
                  <button onClick={scrollToCatalog} className={styles.btnCtaPrimary}>
                    <Compass size={18} />
                    <span>Explorar Catálogo</span>
                  </button>
                  <Link href="/login?tab=signup" className={styles.btnCtaSecondary}>
                    <span>Criar Conta Grátis</span>
                    <ArrowRight size={18} />
                  </Link>
                </div>

                {/* Métricas Rápidas */}
                <div className={styles.heroStatsRow}>
                  <div className={styles.heroStatItem}>
                    <span className={styles.heroStatValue}>{stats.total}+</span>
                    <span className={styles.heroStatLabel}>Obras no Acervo</span>
                  </div>
                  <div className={styles.heroStatDivider}></div>
                  <div className={styles.heroStatItem}>
                    <span className={styles.heroStatValue}>★ {stats.avgRating}</span>
                    <span className={styles.heroStatLabel}>Média de Avaliações</span>
                  </div>
                  <div className={styles.heroStatDivider}></div>
                  <div className={styles.heroStatItem}>
                    <span className={styles.heroStatValue}>2</span>
                    <span className={styles.heroStatLabel}>APIs Mundiais</span>
                  </div>
                </div>
              </div>

              {/* Coluna Direita: Card 3D do Livro em Destaque */}
              <div className={styles.heroCardCol}>
                <div className={styles.featuredCard} onClick={() => setSelectedBook(featuredBook)}>
                  <div className={styles.featuredBadgeTop}>
                    <Award size={14} />
                    <span>Destaque da Semana</span>
                  </div>

                  <div className={styles.featuredCoverWrapper}>
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
                  </div>

                  <div className={styles.featuredContent}>
                    <div className={styles.genreBadge}>
                      <Bookmark size={12} />
                      {featuredBook.genre}
                    </div>
                    <h3 className={styles.featuredTitle}>{featuredBook.title}</h3>
                    <p className={styles.featuredAuthor}>Por {featuredBook.author}</p>

                    <div className={styles.ratingSection}>
                      <div className={styles.starsWrapper}>{renderStars(featuredBook.rating)}</div>
                      <span className={styles.ratingNumber}>{featuredBook.rating.toFixed(1)}</span>
                      <span className={styles.reviewsCount}>({featuredBook.reviewsCount} avaliações)</span>
                    </div>

                    <p className={styles.featuredSynopsis}>{featuredBook.synopsis}</p>

                    <div className={styles.featuredBtnRow}>
                      <span className={styles.btnFeaturedAction}>
                        <span>Ver Sinopse Completa</span>
                        <ChevronRight size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 2. SEÇÃO COMO FUNCIONA ===== */}
        <section id="como-funciona" className={styles.howItWorksSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeadingCenter}>
              <span className={styles.subHeadingBadge}>Passo a Passo</span>
              <h2 className={styles.mainSectionTitle}>Como funciona a Biblioteca Virtual</h2>
              <p className={styles.mainSectionDesc}>
                Uma experiência fluida e intuitiva pensada para quem ama literatura e praticidade.
              </p>
            </div>

            <div className={styles.stepsGrid}>
              <div className={styles.stepCard}>
                <div className={styles.stepNumberBadge}>01</div>
                <div className={styles.stepIconBox}>
                  <Compass size={24} />
                </div>
                <h3 className={styles.stepTitle}>Explore o Acervo</h3>
                <p className={styles.stepDesc}>
                  Navegue pelo catálogo local filtrando por gênero literário, ordem alfabética ou melhores avaliações.
                </p>
              </div>

              <div className={styles.stepCard}>
                <div className={styles.stepNumberBadge}>02</div>
                <div className={styles.stepIconBox}>
                  <Globe size={24} />
                </div>
                <h3 className={styles.stepTitle}>Conecte com APIs</h3>
                <p className={styles.stepDesc}>
                  Pesquise ao vivo no Google Books e na Open Library para encontrar capas e sinopses de milhões de obras.
                </p>
              </div>

              <div className={styles.stepCard}>
                <div className={styles.stepNumberBadge}>03</div>
                <div className={styles.stepIconBox}>
                  <BookMarked size={24} />
                </div>
                <h3 className={styles.stepTitle}>Leia a Sinopse</h3>
                <p className={styles.stepDesc}>
                  Confira as notas da comunidade e o resumo antes de iniciar sua próxima jornada de leitura.
                </p>
              </div>

              <div className={styles.stepCard}>
                <div className={styles.stepNumberBadge}>04</div>
                <div className={styles.stepIconBox}>
                  <Heart size={24} />
                </div>
                <h3 className={styles.stepTitle}>Empreste & Favorite</h3>
                <p className={styles.stepDesc}>
                  Controle seus livros favoritos e alterne o status de empréstimo em apenas um clique.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 3. SEÇÃO BENEFÍCIOS ===== */}
        <section id="beneficios" className={styles.benefitsSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeadingCenter}>
              <span className={styles.subHeadingBadge}>Diferenciais</span>
              <h2 className={styles.mainSectionTitle}>Por que usar nossa Biblioteca?</h2>
              <p className={styles.mainSectionDesc}>
                Tudo o que você precisa para catalogar, descobrir e acompanhar suas leituras.
              </p>
            </div>

            <div className={styles.benefitsGrid}>
              <div className={styles.benefitCard}>
                <div className={styles.benefitIconBox}>
                  <Zap size={22} />
                </div>
                <h3 className={styles.benefitTitle}>Google Books & Open Library</h3>
                <p className={styles.benefitDesc}>
                  Integração direta com as duas maiores bases bibliográficas do planeta para autopreenchimento e capas reais.
                </p>
              </div>

              <div className={styles.benefitCard}>
                <div className={styles.benefitIconBox}>
                  <Star size={22} />
                </div>
                <h3 className={styles.benefitTitle}>Avaliações e Notas Reais</h3>
                <p className={styles.benefitDesc}>
                  Notas pontuadas com estrelas e contagem de avaliações para você escolher livros consagrados pelo público.
                </p>
              </div>

              <div className={styles.benefitCard}>
                <div className={styles.benefitIconBox}>
                  <FileText size={22} />
                </div>
                <h3 className={styles.benefitTitle}>Sinopses em Destaque</h3>
                <p className={styles.benefitDesc}>
                  Resumos objetivos nos cards com expansão completa para você conhecer o enredo sem spoilers.
                </p>
              </div>

              <div className={styles.benefitCard}>
                <div className={styles.benefitIconBox}>
                  <Layers size={22} />
                </div>
                <h3 className={styles.benefitTitle}>Gêneros & Categorias</h3>
                <p className={styles.benefitDesc}>
                  Ficção Científica, Fantasia, Distopia, Tecnologia, Suspense e Clássicos organizados em pílulas inteligentes.
                </p>
              </div>

              <div className={styles.benefitCard}>
                <div className={styles.benefitIconBox}>
                  <Shield size={22} />
                </div>
                <h3 className={styles.benefitTitle}>Gestão de Empréstimos</h3>
                <p className={styles.benefitDesc}>
                  Acompanhamento instantâneo de disponibilidade entre "Disponível" e "Emprestado" com notificações em tempo real.
                </p>
              </div>

              <div className={styles.benefitCard}>
                <div className={styles.benefitIconBox}>
                  <Sparkles size={22} />
                </div>
                <h3 className={styles.benefitTitle}>Design Neon Confortável</h3>
                <p className={styles.benefitDesc}>
                  Paleta em verde claro e branco durante o dia e modo escuro aveludado com contornos neon elegantes à noite.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 4. SEÇÃO DO CATÁLOGO DE LIVROS INTEGRADO ===== */}
        <section id="catalogo-section" className={styles.booksSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeadingCenter}>
              <span className={styles.subHeadingBadge}>Catálogo Interativo</span>
              <h2 className={styles.mainSectionTitle}>Explore a Estante Virtual</h2>
              <p className={styles.mainSectionDesc}>
                Pesquise no acervo interno ou busque online através das APIs integradas.
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
                  <span>Minha Biblioteca</span>
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

            {/* Search & Sort Bar */}
            <div className={styles.searchBarContainer}>
              <div className={styles.searchInputWrapper}>
                <Search size={20} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder={
                    searchSource === 'local'
                      ? 'Pesquisar na biblioteca por título, autor ou tema...'
                      : searchSource === 'google'
                      ? 'Buscar qualquer livro no Google Books (Ex: Harry Potter, Stephen King)...'
                      : 'Buscar qualquer livro na Open Library (Ex: Tolkien, Orwell, Machado)...'
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
                <div className={styles.sortSelectWrapper}>
                  <ArrowUpDown size={16} className={styles.sortIcon} />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={styles.sortSelect}
                    id="sort-select"
                  >
                    <option value="rating">Melhor Avaliados</option>
                    <option value="title">Título (A-Z)</option>
                    <option value="year">Ano de Lançamento</option>
                  </select>
                </div>
              )}
            </div>

            {/* Genre Pills */}
            {searchSource === 'local' && (
              <div className={styles.genreFiltersContainer}>
                <span className={styles.genreFilterLabel}>
                  <Filter size={14} />
                  Gêneros:
                </span>
                <div className={styles.genrePillsList}>
                  {genresList.map((genre) => (
                    <button
                      key={genre}
                      className={`${styles.genrePill} ${
                        selectedGenre === genre ? styles.genrePillActive : ''
                      }`}
                      onClick={() => setSelectedGenre(genre)}
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
                    ? selectedGenre === 'Todos'
                      ? 'Todos os Livros Cadastrados'
                      : `Gênero: ${selectedGenre}`
                    : searchSource === 'google'
                    ? 'Resultados do Google Books API'
                    : 'Resultados da Open Library API'}
                </h3>
                <p className={styles.sectionSubtitle}>
                  {searchSource === 'local'
                    ? `Exibindo ${displayedBooks.length} obras no catálogo`
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
                  <span>Cadastrar Obra</span>
                </button>
              )}
            </div>

            {/* Loading / Empty State */}
            {isApiLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.loadingSpinner}></div>
                <h3 className={styles.emptyTitle}>Buscando livros na API...</h3>
                <p className={styles.emptyDesc}>Conectando aos servidores e carregando capas e sinopses.</p>
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
              /* GRID DE CARDS DOS LIVROS */
              <div className={styles.booksGrid}>
                {displayedBooks.map((book) => {
                  const isFav = favorites.includes(book.id);
                  const isExternal = searchSource !== 'local';

                  return (
                    <article
                      key={book.id}
                      className={styles.bookCard}
                      onClick={() => setSelectedBook(book)}
                    >
                      {/* Top: Capa do Livro estilizada ou imagem real */}
                      <div className={styles.coverWrapper}>
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
                                <span
                                  className={`${styles.statusBadge} ${
                                    book.status === 'Disponível'
                                      ? styles.statusAvailable
                                      : styles.statusBorrowed
                                  }`}
                                >
                                  {book.status}
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
                              <span
                                className={`${styles.statusBadge} ${
                                  book.status === 'Disponível'
                                    ? styles.statusAvailable
                                    : styles.statusBorrowed
                                }`}
                              >
                                {book.status}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Botão Favoritar no card */}
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

                      {/* Conteúdo do Card */}
                      <div className={styles.bookCardBody}>
                        {/* 1. Nome do Livro e Autor */}
                        <div className={styles.bookInfoTop}>
                          <h3 className={styles.bookTitle} title={book.title}>
                            {book.title}
                          </h3>
                          <div className={styles.bookAuthorRow}>
                            <User size={13} className={styles.authorIcon} />
                            <span className={styles.bookAuthor}>{book.author}</span>
                          </div>
                        </div>

                        {/* 2. NA PARTE DE BAIXO: O GÊNERO DO LIVRO */}
                        <div className={styles.genreSection}>
                          <span className={styles.genreBadge}>
                            <Bookmark size={12} className={styles.genreIcon} />
                            {book.genre}
                          </span>
                        </div>

                        {/* 3. LOGO ABAIXO: A AVALIAÇÃO DO LIVRO */}
                        <div className={styles.ratingSection}>
                          <div className={styles.starsWrapper}>{renderStars(book.rating)}</div>
                          <span className={styles.ratingNumber}>{book.rating.toFixed(1)}</span>
                          <span className={styles.reviewsCount}>
                            ({book.reviewsCount.toLocaleString('pt-BR')} avaliações)
                          </span>
                        </div>

                        {/* 4. LOGO ABAIXO: O RESUMO DA SINOPSE DO LIVRO */}
                        <div className={styles.synopsisSection}>
                          <p className={styles.synopsisText}>{book.synopsis}</p>
                        </div>

                        {/* Ações do Card */}
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
                              <span>Adicionar à Biblioteca</span>
                            </button>
                          ) : (
                            <>
                              <button
                                className={styles.btnCardDetails}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedBook(book);
                                }}
                              >
                                <span>Ver Detalhes</span>
                                <ChevronRight size={14} />
                              </button>
                              <button
                                className={`${styles.btnCardBorrow} ${
                                  book.status === 'Disponível'
                                    ? styles.btnBorrow
                                    : styles.btnReturn
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleBorrowStatus(book);
                                }}
                              >
                                {book.status === 'Disponível' ? 'Emprestar' : 'Devolver'}
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

        {/* ===== 5. SEÇÃO DEPOIMENTOS DOS LEITORES ===== */}
        <section id="depoimentos" className={styles.testimonialsSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeadingCenter}>
              <span className={styles.subHeadingBadge}>Comunidade</span>
              <h2 className={styles.mainSectionTitle}>O que dizem nossos leitores</h2>
              <p className={styles.mainSectionDesc}>
                Milhares de pessoas já transformaram seus hábitos de leitura com nossa biblioteca digital.
              </p>
            </div>

            <div className={styles.testimonialsGrid}>
              <div className={styles.testimonialCard}>
                <Quote size={28} className={styles.testimonialQuoteIcon} />
                <p className={styles.testimonialText}>
                  "A biblioteca facilitou muito a escolha do meu próximo livro. As sinopses detalhadas e a integração com o Google Books são fantásticas!"
                </p>
                <div className={styles.testimonialAuthorGroup}>
                  <div className={styles.testimonialAvatar}>M</div>
                  <div>
                    <h4 className={styles.testimonialName}>Mariana Costa</h4>
                    <span className={styles.testimonialRole}>Estudante de Letras</span>
                  </div>
                </div>
              </div>

              <div className={styles.testimonialCard}>
                <Quote size={28} className={styles.testimonialQuoteIcon} />
                <p className={styles.testimonialText}>
                  "O modo escuro suave com os contornos neon é perfeito para leituras noturnas. A experiência visual e a rapidez da estante impressionam!"
                </p>
                <div className={styles.testimonialAuthorGroup}>
                  <div className={styles.testimonialAvatar}>L</div>
                  <div>
                    <h4 className={styles.testimonialName}>Lucas Silveira</h4>
                    <span className={styles.testimonialRole}>Desenvolvedor de Software</span>
                  </div>
                </div>
              </div>

              <div className={styles.testimonialCard}>
                <Quote size={28} className={styles.testimonialQuoteIcon} />
                <p className={styles.testimonialText}>
                  "O controle de empréstimos e a lista de favoritos me ajudaram a organizar minha meta de ler 30 livros neste ano. Recomendo a todos!"
                </p>
                <div className={styles.testimonialAuthorGroup}>
                  <div className={styles.testimonialAvatar}>C</div>
                  <div>
                    <h4 className={styles.testimonialName}>Camila Nogueira</h4>
                    <span className={styles.testimonialRole}>Professora & Leitora Ávida</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 6. BANNER CTA FINAL ===== */}
        <section className={styles.ctaBannerSection}>
          <div className={styles.container}>
            <div className={styles.ctaBannerCard}>
              <div className={styles.ctaGlow}></div>
              <Sparkles size={32} className={styles.ctaIconBadge} />
              <h2 className={styles.ctaTitle}>Pronto para começar sua próxima leitura?</h2>
              <p className={styles.ctaDesc}>
                Crie sua conta em poucos segundos, favorite os melhores livros e explore sinopses de clássicos e novidades do mundo literário.
              </p>
              <div className={styles.ctaActions}>
                <Link href="/login?tab=signup" className={styles.btnCtaBannerPrimary}>
                  <span>Criar Conta Gratuita</span>
                  <ArrowRight size={18} />
                </Link>
                <button onClick={scrollToCatalog} className={styles.btnCtaBannerSecondary}>
                  <span>Ver Catálogo</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL DE DETALHES DO LIVRO */}
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
              {/* Capa */}
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

              {/* Detalhes */}
              <div className={styles.modalDetails}>
                <div className={styles.modalGenreRow}>
                  <span className={styles.genreBadge}>
                    <Bookmark size={13} className={styles.genreIcon} />
                    {selectedBook.genre}
                  </span>
                  <span
                    className={`${styles.statusBadge} ${
                      selectedBook.status === 'Disponível'
                        ? styles.statusAvailable
                        : styles.statusBorrowed
                    }`}
                  >
                    {selectedBook.status}
                  </span>
                </div>

                <h2 className={styles.modalTitle}>{selectedBook.title}</h2>
                <div className={styles.modalAuthorRow}>
                  <User size={16} />
                  <span>Por {selectedBook.author}</span>
                </div>

                {/* Avaliação */}
                <div className={styles.modalRatingRow}>
                  <div className={styles.modalStarsBox}>{renderStars(selectedBook.rating)}</div>
                  <span className={styles.modalRatingScore}>
                    {selectedBook.rating.toFixed(1)} de 5.0
                  </span>
                  <span className={styles.reviewsCount}>
                    • {selectedBook.reviewsCount.toLocaleString('pt-BR')} avaliações
                  </span>
                </div>

                {/* Metadados */}
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
                </div>

                {/* Sinopse Completa */}
                <div className={styles.modalSynopsisBox}>
                  <h4 className={styles.synopsisHeaderTitle}>Resumo da Sinopse:</h4>
                  <p className={styles.modalSynopsisParagraph}>{selectedBook.synopsis}</p>
                </div>

                {/* Ações */}
                <div className={styles.modalActions}>
                  {typeof selectedBook.id === 'string' &&
                  (selectedBook.id.startsWith('gb-') || selectedBook.id.startsWith('ol-')) ? (
                    <button
                      className={styles.btnModalBorrow}
                      onClick={() => {
                        importBookToLocal(selectedBook);
                        setSelectedBook(null);
                      }}
                    >
                      <Download size={18} />
                      <span>Salvar na Minha Biblioteca</span>
                    </button>
                  ) : (
                    <>
                      <button
                        className={`${styles.btnModalPrimary} ${
                          selectedBook.status === 'Disponível'
                            ? styles.btnModalBorrow
                            : styles.btnModalReturn
                        }`}
                        onClick={() => toggleBorrowStatus(selectedBook)}
                      >
                        <BookOpen size={18} />
                        <span>
                          {selectedBook.status === 'Disponível'
                            ? 'Pegar Livro Emprestado'
                            : 'Devolver à Biblioteca'}
                        </span>
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
                          {favorites.includes(selectedBook.id) ? 'Favoritado' : 'Favoritar'}
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CADASTRAR NOVO LIVRO COM AUTOFILL DE API */}
      {isAddModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAddModalOpen(false)}>
          <div className={styles.modalCardSmall} onClick={(e) => e.stopPropagation()}>
            <div className={styles.formHeader}>
              <div className={styles.formHeaderTitleGroup}>
                <div className={styles.formIconBox}>
                  <Plus size={20} />
                </div>
                <div>
                  <h3 className={styles.formTitle}>Cadastrar Novo Livro</h3>
                  <p className={styles.formSubtitle}>Adicione uma obra à biblioteca virtual</p>
                </div>
              </div>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setIsAddModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Barra de Autopreenchimento Inteligente via Google Books API */}
            <div className={styles.apiAutofillBox}>
              <span className={styles.apiAutofillTitle}>
                <Wand2 size={14} />
                Autopreencher via Google Books API
              </span>
              <div className={styles.apiAutofillRow}>
                <input
                  type="text"
                  placeholder="Digite o título do livro (Ex: Harry Potter e a Pedra Filosofal)..."
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
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Avaliação (0 a 5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={newBookForm.rating}
                    onChange={(e) => setNewBookForm({ ...newBookForm, rating: e.target.value })}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Ano de Lançamento</label>
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
                <label className={styles.formLabel}>Resumo da Sinopse *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Escreva um breve resumo da história e premissa do livro..."
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
                  Cadastrar Obra
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
                <span className={styles.footerLogoTitle}>BIBLIOTECA VIRTUAL</span>
              </div>
              <p className={styles.footerDesc}>
                Sua plataforma moderna para catalogar obras, ler sinopses detalhadas e explorar o mundo da literatura com suporte ao Google Books e Open Library.
              </p>
            </div>

            <div className={styles.footerLinks}>
              <span className={styles.footerGroupTitle}>Navegação</span>
              <a href="#como-funciona" className={styles.footerLinkItem}>Como Funciona</a>
              <a href="#beneficios" className={styles.footerLinkItem}>Benefícios</a>
              <a href="#catalogo-section" className={styles.footerLinkItem}>Estante Virtual</a>
              <a href="#depoimentos" className={styles.footerLinkItem}>Depoimentos</a>
            </div>

            <div className={styles.footerLinks}>
              <span className={styles.footerGroupTitle}>APIs Integradas</span>
              <span>Google Books API v1</span>
              <span>Open Library Search API</span>
              <span>Backend REST Express</span>
            </div>

            <div className={styles.footerLinks}>
              <span className={styles.footerGroupTitle}>Estatísticas</span>
              <span>{stats.total} Obras Catalogadas</span>
              <span>{stats.genresCount} Categorias Ativas</span>
              <span>Média: ★ {stats.avgRating}</span>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>&copy; {new Date().getFullYear()} Biblioteca Virtual • Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}