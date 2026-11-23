const ExternalBooksService = require('./externalBooksService');
const { getGenreGradient, DEFAULT_ACCENT } = require('../data/initialBooks');

// Lista de livros adicionados manualmente pelos usuários
const userCreatedBooks = [];

/**
 * Serviço de regras de negócio para Livros conectado diretamente à API externa real
 */
class BookService {
  /**
   * Listar livros obtidos diretamente da API com suporte a filtros, busca e ordenação
   */
  static async list({ genre, search, page, limit, sort }) {
    const fetchLimit = limit ? Math.min(100, Math.max(12, parseInt(limit, 10) * 2)) : 80;

    // 1. Busca livros reais diretamente da API externa
    const liveApiBooks = await ExternalBooksService.fetchBooks({
      genre: genre && genre !== 'Todos' ? genre : null,
      search: search && search.trim() ? search.trim() : null,
      limit: fetchLimit
    });

    // 2. Mescla com livros cadastrados localmente pelos usuários
    let results = [...userCreatedBooks, ...liveApiBooks];

    // 3. Filtros adicionais em memória se necessário
    if (genre && genre !== 'Todos') {
      results = results.filter(b => b.genre && b.genre.toLowerCase() === genre.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      results = results.filter(b =>
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.author && b.author.toLowerCase().includes(q)) ||
        (b.synopsis && b.synopsis.toLowerCase().includes(q))
      );
    }

    // 4. Ordenação
    if (sort) {
      this._applySorting(results, sort);
    }

    const total = results.length;

    // 5. Paginação
    if (page || limit) {
      const currentPage = Math.max(1, parseInt(page, 10) || 1);
      const pageSize = Math.max(1, parseInt(limit, 10) || 12);
      const startIndex = (currentPage - 1) * pageSize;
      const paginatedData = results.slice(startIndex, startIndex + pageSize);

      return {
        isPaginated: true,
        data: paginatedData,
        total,
        page: currentPage,
        limit: pageSize
      };
    }

    return {
      isPaginated: false,
      data: results,
      total
    };
  }

  /**
   * Buscar livro por ID
   */
  static async getById(id) {
    const foundUserBook = userCreatedBooks.find(b => String(b.id) === String(id));
    if (foundUserBook) return foundUserBook;

    const books = await ExternalBooksService.fetchBooks({ limit: 40 });
    return books.find(b => String(b.id) === String(id)) || null;
  }

  /**
   * Cadastrar novo livro manualmente
   */
  static async create(payload) {
    const {
      title,
      author,
      genre,
      rating,
      synopsis,
      year,
      pages,
      coverImage,
      price,
      originalPrice,
      format,
      stock,
      badge
    } = payload;

    if (!title || !author || !genre || !synopsis) {
      throw new Error('Título, autor, gênero e sinopse são obrigatórios.');
    }

    const parsedPrice = parseFloat(price) || 39.90;
    const parsedOriginalPrice = parseFloat(originalPrice) || (parsedPrice * 1.3);

    const newBook = {
      id: `local-${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      rating: parseFloat(rating) || 5.0,
      reviewsCount: 1,
      price: parsedPrice,
      originalPrice: parsedOriginalPrice,
      discountPercent: Math.round(((parsedOriginalPrice - parsedPrice) / parsedOriginalPrice) * 100) || 20,
      stock: parseInt(stock, 10) || 20,
      badge: badge || 'Novidade',
      format: format || 'Capa Dura',
      synopsis: synopsis.trim(),
      year: parseInt(year, 10) || new Date().getFullYear(),
      pages: parseInt(pages, 10) || 250,
      status: 'Disponível',
      coverImage: coverImage || '',
      coverGradient: getGenreGradient(genre),
      accentColor: DEFAULT_ACCENT
    };

    userCreatedBooks.unshift(newBook);
    return newBook;
  }

  /**
   * Alternar status de empréstimo (Disponível <-> Emprestado)
   */
  static async toggleStatus(id) {
    const book = await this.getById(id);
    if (!book) return null;

    book.status = book.status === 'Disponível' ? 'Emprestado' : 'Disponível';
    return book;
  }

  /**
   * Excluir livro
   */
  static async delete(id) {
    const initialLen = userCreatedBooks.length;
    const idx = userCreatedBooks.findIndex(b => String(b.id) === String(id));
    if (idx !== -1) {
      userCreatedBooks.splice(idx, 1);
      return true;
    }
    return false;
  }

  /**
   * Ordenação de livros
   */
  static _applySorting(list, sortType) {
    switch (sortType) {
      case 'sales':
        list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
        break;
      case 'price-asc':
        list.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        list.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'title':
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
  }
}

module.exports = BookService;
