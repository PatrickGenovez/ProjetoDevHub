const express = require('express');
const router = express.Router();

// Catálogo inicial de livros da loja / livraria
let books = [
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

// Listar todos os livros
router.get('/', (req, res) => {
  const { genre, search } = req.query;
  let results = [...books];

  if (genre && genre !== 'Todos') {
    results = results.filter(b => b.genre.toLowerCase() === genre.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.synopsis.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: results.length, data: results });
});

// Cadastrar novo livro
router.post('/', (req, res) => {
  const { title, author, genre, rating, synopsis, year, pages, coverImage, price, originalPrice, format, stock, badge } = req.body;

  if (!title || !author || !genre || !synopsis) {
    return res.status(400).json({ error: 'Título, autor, gênero e sinopse são obrigatórios.' });
  }

  // Gera gradiente baseado no gênero
  const genreGradients = {
    'Ficção Científica': 'linear-gradient(135deg, #10b981 0%, #059669 50%, #064e3b 100%)',
    'Fantasia': 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #065f46 100%)',
    'Distopia': 'linear-gradient(135deg, #059669 0%, #047857 50%, #022c22 100%)',
    'Tecnologia': 'linear-gradient(135deg, #10b981 0%, #047857 50%, #064e3b 100%)',
    'Suspense': 'linear-gradient(135deg, #047857 0%, #065f46 50%, #022c22 100%)',
    'Clássicos': 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #065f46 100%)'
  };

  const parsedPrice = parseFloat(price) || 39.90;
  const parsedOriginalPrice = parseFloat(originalPrice) || (parsedPrice * 1.3);

  const newBook = {
    id: Date.now(),
    title,
    author,
    genre,
    rating: parseFloat(rating) || 5.0,
    reviewsCount: 1,
    price: parsedPrice,
    originalPrice: parsedOriginalPrice,
    discountPercent: Math.round(((parsedOriginalPrice - parsedPrice) / parsedOriginalPrice) * 100) || 20,
    stock: parseInt(stock) || 20,
    badge: badge || 'Novidade',
    format: format || 'Capa Dura',
    synopsis,
    year: parseInt(year) || new Date().getFullYear(),
    pages: parseInt(pages) || 250,
    status: 'Disponível',
    coverImage: coverImage || '',
    coverGradient: genreGradients[genre] || 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    accentColor: '#10b981'
  };

  books.unshift(newBook);
  res.status(201).json({ success: true, data: newBook });
});

// Alternar status de empréstimo
router.patch('/:id/toggle-status', (req, res) => {
  const { id } = req.params;
  const bookIndex = books.findIndex(b => b.id === parseInt(id));

  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Livro não encontrado.' });
  }

  books[bookIndex].status = books[bookIndex].status === 'Disponível' ? 'Emprestado' : 'Disponível';
  res.json({ success: true, data: books[bookIndex] });
});

// Excluir livro
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = books.length;
  books = books.filter(b => b.id !== parseInt(id));

  if (books.length === initialLength) {
    return res.status(404).json({ error: 'Livro não encontrado.' });
  }

  res.json({ success: true, message: 'Livro removido com sucesso.' });
});

module.exports = router;
