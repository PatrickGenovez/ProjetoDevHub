const express = require('express');
const router = express.Router();

// Catálogo inicial de livros da biblioteca
let books = [
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
    coverGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #78350f 100%)',
    accentColor: '#f59e0b'
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
    coverGradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #064e3b 100%)',
    accentColor: '#10b981'
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
    coverGradient: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 50%, #450a0a 100%)',
    accentColor: '#ef4444'
  },
  {
    id: 4,
    title: 'Código Limpo (Clean Code)',
    author: 'Robert C. Martin',
    genre: 'Tecnologia',
    rating: 4.7,
    reviewsCount: 980,
    synopsis: 'Um guia fundamental sobre boas práticas de engenharia de software, mostrando como escrever código legível, modular e de fácil manutenção através de princípios de refatoração, nomes significativos e testes.',
    year: 2008,
    pages: 464,
    status: 'Disponível',
    coverGradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #172554 100%)',
    accentColor: '#3b82f6'
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
    coverGradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #312e81 100%)',
    accentColor: '#8b5cf6'
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
    coverGradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 50%, #500724 100%)',
    accentColor: '#ec4899'
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
    coverGradient: 'linear-gradient(135deg, #6366f1 0%, #4338ca 50%, #1e1b4b 100%)',
    accentColor: '#6366f1'
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
  const { title, author, genre, rating, synopsis, year, pages, coverImage } = req.body;

  if (!title || !author || !genre || !synopsis) {
    return res.status(400).json({ error: 'Título, autor, gênero e sinopse são obrigatórios.' });
  }

  // Gera gradiente baseado no gênero
  const genreGradients = {
    'Ficção Científica': 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #312e81 100%)',
    'Fantasia': 'linear-gradient(135deg, #10b981 0%, #059669 50%, #064e3b 100%)',
    'Distopia': 'linear-gradient(135deg, #ef4444 0%, #b91c1c 50%, #450a0a 100%)',
    'Tecnologia': 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #172554 100%)',
    'Suspense': 'linear-gradient(135deg, #ec4899 0%, #be185d 50%, #500724 100%)',
    'Clássicos': 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #78350f 100%)'
  };

  const newBook = {
    id: Date.now(),
    title,
    author,
    genre,
    rating: parseFloat(rating) || 5.0,
    reviewsCount: 1,
    synopsis,
    year: parseInt(year) || new Date().getFullYear(),
    pages: parseInt(pages) || 250,
    status: 'Disponível',
    coverImage: coverImage || '',
    coverGradient: genreGradients[genre] || 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    accentColor: '#8b5cf6'
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
