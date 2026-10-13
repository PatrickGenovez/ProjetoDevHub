const express = require('express');
const router = express.Router();

// Catálogo inicial de livros da loja / livraria
let books = [
  {
    "id": 1,
    "title": "Duna",
    "author": "Frank Herbert",
    "genre": "Ficção Científica",
    "rating": 4.9,
    "reviewsCount": 1840,
    "price": 59.9,
    "originalPrice": 89.9,
    "discountPercent": 33,
    "stock": 24,
    "badge": "Mais Vendido",
    "format": "Capa Dura",
    "synopsis": "Em um futuro distante, o jovem Paul Atreides é herdeiro de uma família nobre enviada para governar o inóspito planeta desértico Arrakis, a única fonte da substância mais valiosa do universo, a especiaria mélange.",
    "year": 1965,
    "pages": 680,
    "status": "Disponível",
    "coverImage": "https://covers.openlibrary.org/b/id/11149234-L.jpg",
    "coverGradient": "linear-gradient(135deg, #10b981 0%, #059669 50%, #064e3b 100%)",
    "accentColor": "#10b981"
  },
  {
    "id": 2,
    "title": "O Senhor dos Anéis: A Sociedade do Anel",
    "author": "J.R.R. Tolkien",
    "genre": "Fantasia",
    "rating": 5,
    "reviewsCount": 2410,
    "price": 69.9,
    "originalPrice": 99.9,
    "discountPercent": 30,
    "stock": 18,
    "badge": "Destaque",
    "format": "Edição Especial",
    "synopsis": "Frodo Bolseiro, um hobbit da pacata Comarca, herda um anel mágico ancestral e descobre que ele tem o poder de escravizar toda a Terra-média nas mãos do Senhor do Escuro, Sauron.",
    "year": 1954,
    "pages": 576,
    "status": "Disponível",
    "coverImage": "https://covers.openlibrary.org/b/id/14547565-L.jpg",
    "coverGradient": "linear-gradient(135deg, #34d399 0%, #10b981 50%, #064e3b 100%)",
    "accentColor": "#34d399"
  },
  {
    "id": 3,
    "title": "1984",
    "author": "George Orwell",
    "genre": "Distopia",
    "rating": 4.8,
    "reviewsCount": 3150,
    "price": 34.9,
    "originalPrice": 49.9,
    "discountPercent": 30,
    "stock": 45,
    "badge": "Super Oferta",
    "format": "Brochura",
    "synopsis": "Em uma sociedade totalitária dominada pelo Partido e pelo onipresente Grande Irmão, Winston Smith trabalha no Ministério da Verdade reescrevendo a história, mas começa secretamente a questionar o regime.",
    "year": 1949,
    "pages": 336,
    "status": "Disponível",
    "coverImage": "https://covers.openlibrary.org/b/id/9267242-L.jpg",
    "coverGradient": "linear-gradient(135deg, #059669 0%, #047857 50%, #022c22 100%)",
    "accentColor": "#059669"
  },
  {
    "id": 4,
    "title": "Código Limpo (Clean Code)",
    "author": "Robert C. Martin",
    "genre": "Tecnologia",
    "rating": 4.7,
    "reviewsCount": 980,
    "price": 84.9,
    "originalPrice": 119,
    "discountPercent": 28,
    "stock": 12,
    "badge": "Mais Vendido",
    "format": "Brochura Premium",
    "synopsis": "Um guia fundamental sobre boas práticas de engenharia de software, mostrando como escrever código legível, modular e de fácil manutenção através de princípios de refatoração, nomes significativos e testes automatizados.",
    "year": 2008,
    "pages": 464,
    "status": "Disponível",
    "coverImage": "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
    "coverGradient": "linear-gradient(135deg, #10b981 0%, #047857 50%, #064e3b 100%)",
    "accentColor": "#10b981"
  },
  {
    "id": 5,
    "title": "O Hobbit",
    "author": "J.R.R. Tolkien",
    "genre": "Fantasia",
    "rating": 4.9,
    "reviewsCount": 1620,
    "price": 49.9,
    "originalPrice": 65,
    "discountPercent": 23,
    "stock": 22,
    "badge": "Clássico",
    "format": "Capa Dura",
    "synopsis": "Bilbo Bolseiro vive uma vida tranquila no Condado até ser surpreendido pelo mago Gandalf e uma companhia de treze anões para recuperar um tesouro guardado pelo temível dragão Smaug.",
    "year": 1937,
    "pages": 310,
    "status": "Disponível",
    "coverImage": "https://covers.openlibrary.org/b/id/12003528-L.jpg",
    "coverGradient": "linear-gradient(135deg, #14b8a6 0%, #0f766e 50%, #134e4a 100%)",
    "accentColor": "#14b8a6"
  },
  {
    "id": 6,
    "title": "Neuromancer",
    "author": "William Gibson",
    "genre": "Ficção Científica",
    "rating": 4.6,
    "reviewsCount": 890,
    "price": 44.9,
    "originalPrice": 59.9,
    "discountPercent": 25,
    "stock": 15,
    "badge": "Cyberpunk",
    "format": "Brochura",
    "synopsis": "Case é um cowboy do ciberespaço que foi banido da rede neural após trair seus empregadores. Uma oportunidade misteriosa surge para recuperar sua conexão em troca de uma última invasão hacker de alto risco.",
    "year": 1984,
    "pages": 320,
    "status": "Disponível",
    "coverImage": "https://covers.openlibrary.org/b/id/283860-L.jpg",
    "coverGradient": "linear-gradient(135deg, #059669 0%, #047857 50%, #022c22 100%)",
    "accentColor": "#059669"
  },
  {
    "id": 7,
    "title": "O Silêncio dos Inocentes",
    "author": "Thomas Harris",
    "genre": "Suspense & Mistério",
    "rating": 4.8,
    "reviewsCount": 1120,
    "price": 39.9,
    "originalPrice": 54.9,
    "discountPercent": 27,
    "stock": 30,
    "badge": "Bestseller",
    "format": "Brochura",
    "synopsis": "A jovem estagiária do FBI Clarice Starling deve interrogar o brilhante psiquiatra e assassino em série Dr. Hannibal Lecter para obter pistas sobre um novo criminoso que aterroriza o país.",
    "year": 1988,
    "pages": 368,
    "status": "Disponível",
    "coverImage": "https://covers.openlibrary.org/b/isbn/9780312924584-L.jpg",
    "coverGradient": "linear-gradient(135deg, #047857 0%, #065f46 50%, #022c22 100%)",
    "accentColor": "#047857"
  },
  {
    "id": 8,
    "title": "O Pequeno Príncipe",
    "author": "Antoine de Saint-Exupéry",
    "genre": "Clássicos",
    "rating": 4.9,
    "reviewsCount": 4300,
    "price": 24.9,
    "originalPrice": 35,
    "discountPercent": 28,
    "stock": 60,
    "badge": "Mais Vendido",
    "format": "Capa Dura Ilustrada",
    "synopsis": "Um piloto cai no deserto do Saara e encontra um menino misterioso vindo de um asteroide distante. Uma fábula poética sobre amizade, amor, perda e o que é verdadeiramente essencial aos olhos.",
    "year": 1943,
    "pages": 96,
    "status": "Disponível",
    "coverImage": "https://covers.openlibrary.org/b/id/10574187-L.jpg",
    "coverGradient": "linear-gradient(135deg, #10b981 0%, #34d399 50%, #065f46 100%)",
    "accentColor": "#10b981"
  },
  {
    "id": 9,
    "title": "Fundação",
    "author": "Isaac Asimov",
    "genre": "Ficção Científica",
    "rating": 4.9,
    "reviewsCount": 1450,
    "price": 54.9,
    "originalPrice": 79.9,
    "discountPercent": 31,
    "stock": 20,
    "badge": "Obra-Prima",
    "format": "Capa Dura",
    "synopsis": "O matemático Hari Seldon desenvolve a psico-história e prevê a queda do Império Galáctico e uma era de trevas de trinta mil anos, criando um refúgio para preservar o conhecimento humano.",
    "year": 1951,
    "pages": 240,
    "status": "Disponível",
    "coverImage": "https://covers.openlibrary.org/b/id/8758832-L.jpg",
    "coverGradient": "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #042f2e 100%)",
    "accentColor": "#0d9488"
  },
  {
    "id": 10,
    "title": "Harry Potter e a Pedra Filosofal",
    "author": "J.K. Rowling",
    "genre": "Fantasia",
    "rating": 4.9,
    "reviewsCount": 5200,
    "price": 42.9,
    "originalPrice": 59.9,
    "discountPercent": 28,
    "stock": 35,
    "badge": "Edição Especial",
    "format": "Capa Dura",
    "synopsis": "Harry Potter descobre no seu aniversário de 11 anos que é um bruxo e é convidado para estudar na Escola de Magia e Bruxaria de Hogwarts, descobrindo o segredo do seu passado.",
    "year": 1997,
    "pages": 223,
    "status": "Disponível",
    "coverImage": "https://covers.openlibrary.org/b/id/10521270-L.jpg",
    "coverGradient": "linear-gradient(135deg, #059669 0%, #10b981 50%, #022c22 100%)",
    "accentColor": "#059669"
  },
  {
    "id": 11,
    "title": "O Programador Pragmático",
    "author": "Andrew Hunt & David Thomas",
    "genre": "Tecnologia",
    "rating": 4.8,
    "reviewsCount": 850,
    "price": 89.9,
    "originalPrice": 129,
    "discountPercent": 30,
    "stock": 14,
    "badge": "Essencial Dev",
    "format": "Brochura Premium",
    "synopsis": "Um clássico atemporal que aborda a jornada do desenvolvedor, desde responsabilidade profissional e desenvolvimento de carreira até técnicas arquiteturais para manter seu código maleável e flexível.",
    "year": 1999,
    "pages": 352,
    "status": "Disponível",
    "coverImage": "https://covers.openlibrary.org/b/id/10143650-L.jpg",
    "coverGradient": "linear-gradient(135deg, #10b981 0%, #065f46 50%, #022c22 100%)",
    "accentColor": "#10b981"
  },
  {
    "id": 12,
    "title": "Sapiens: Uma Breve História da Humanidade",
    "author": "Yuval Noah Harari",
    "genre": "História & Biografias",
    "rating": 4.9,
    "reviewsCount": 3800,
    "price": 62.9,
    "originalPrice": 84.9,
    "discountPercent": 25,
    "stock": 28,
    "badge": "Fenômeno Global",
    "format": "Capa Dura",
    "synopsis": "Uma jornada fascinante por toda a história da humanidade, desde os primeiros hominídeos na África até as revoluções cognitiva, agrícola e científica que moldaram a sociedade moderna.",
    "year": 2011,
    "pages": 464,
    "status": "Disponível",
    "coverImage": "https://covers.openlibrary.org/b/id/11497928-L.jpg",
    "coverGradient": "linear-gradient(135deg, #047857 0%, #064e3b 50%, #022c22 100%)",
    "accentColor": "#047857"
  },
  {
    "id": 13,
    "title": "Orgulho e Preconceito",
    "author": "Jane Austen",
    "genre": "Romance",
    "rating": 4.8,
    "reviewsCount": 2900,
    "price": 29.9,
    "originalPrice": 44.9,
    "discountPercent": 33,
    "stock": 32,
    "badge": "Clássico Romance",
    "format": "Capa Dura Floral",
    "synopsis": "Elizabeth Bennet enfrenta as pressões sociais do casamento na Inglaterra do século XIX enquanto navega em seu relacionamento turbulento e fascinante com o orgulhoso Sr. Darcy.",
    "year": 1813,
    "pages": 424,
    "status": "Disponível",
    "coverImage": "https://covers.openlibrary.org/b/id/8225261-L.jpg",
    "coverGradient": "linear-gradient(135deg, #10b981 0%, #34d399 50%, #064e3b 100%)",
    "accentColor": "#10b981"
  },
  {
    "id": 14,
    "title": "Admirável Mundo Novo",
    "author": "Aldous Huxley",
    "genre": "Distopia",
    "rating": 4.7,
    "reviewsCount": 1980,
    "price": 38.9,
    "originalPrice": 52,
    "discountPercent": 25,
    "stock": 25,
    "badge": "Distopia Clássica",
    "format": "Brochura",
    "synopsis": "Uma sociedade futurista onde as pessoas são geneticamente condicionadas em castas e mantidas em estado de felicidade química e controle através do consumo e da droga soma.",
    "year": 1932,
    "pages": 312,
    "status": "Disponível",
    "coverImage": "https://covers.openlibrary.org/b/id/8763784-L.jpg",
    "coverGradient": "linear-gradient(135deg, #059669 0%, #047857 50%, #022c22 100%)",
    "accentColor": "#059669"
  },
  {
    "id": 15,
    "title": "Fahrenheit 451",
    "author": "Ray Bradbury",
    "genre": "Distopia",
    "rating": 4.7,
    "reviewsCount": 1750,
    "price": 36.9,
    "originalPrice": 49.9,
    "discountPercent": 26,
    "stock": 22,
    "badge": "Recomendado",
    "format": "Brochura Especial",
    "synopsis": "Guy Montag é um bombeiro cuja missão não é apagar incêndios, mas queimar livros proibidos pelo governo, até que um encontro o faz questionar tudo o que acreditava.",
    "year": 1953,
    "pages": 216,
    "status": "Disponível",
    "coverImage": "https://covers.openlibrary.org/b/id/10313414-L.jpg",
    "coverGradient": "linear-gradient(135deg, #0d9488 0%, #10b981 50%, #022c22 100%)",
    "accentColor": "#0d9488"
  },
  {
    "id": 16,
    "title": "As Aventuras de Sherlock Holmes",
    "author": "Arthur Conan Doyle",
    "genre": "Suspense & Mistério",
    "rating": 4.8,
    "reviewsCount": 2100,
    "price": 32.9,
    "originalPrice": 45,
    "discountPercent": 26,
    "stock": 40,
    "badge": "Mistério",
    "format": "Capa Dura",
    "synopsis": "Doze casos intrigantes resolvidos pelo detetive consultor Sherlock Holmes e seu fiel amigo Dr. John Watson nas névoas da Londres vitoriana.",
    "year": 1892,
    "pages": 360,
    "status": "Disponível",
    "coverImage": "https://covers.openlibrary.org/b/id/8232986-L.jpg",
    "coverGradient": "linear-gradient(135deg, #047857 0%, #065f46 50%, #022c22 100%)",
    "accentColor": "#047857"
  },
  {
    "id": 17,
    "title": "Crime e Castigo",
    "author": "Fiódor Dostoiévski",
    "genre": "Clássicos",
    "rating": 4.9,
    "reviewsCount": 1680,
    "price": 49.9,
    "originalPrice": 72,
    "discountPercent": 30,
    "stock": 18,
    "badge": "Clássico Russo",
    "format": "Edição de Luxo",
    "synopsis": "O jovem estudante Raskólnikov comete um assassinato justificado por sua teoria de homens extraordinários, desencadeando um drama psicológico arrebatador sobre culpa e redenção.",
    "year": 1866,
    "pages": 592,
    "status": "Disponível",
    "coverImage": "https://covers.openlibrary.org/b/id/8231856-L.jpg",
    "coverGradient": "linear-gradient(135deg, #064e3b 0%, #047857 50%, #022c22 100%)",
    "accentColor": "#064e3b"
  },
  {
    "id": 18,
    "title": "O Iluminado (The Shining)",
    "author": "Stephen King",
    "genre": "Terror & Suspense",
    "rating": 4.8,
    "reviewsCount": 2400,
    "price": 48.9,
    "originalPrice": 68,
    "discountPercent": 28,
    "stock": 26,
    "badge": "Mestre do Terror",
    "format": "Capa Dura",
    "synopsis": "Jack Torrance aceita o trabalho de zelador de inverno no isolado Hotel Overlook junto com sua família, mas forças sombrias do local começam a exercer uma influência aterradora.",
    "year": 1977,
    "pages": 464,
    "status": "Disponível",
    "coverImage": "https://covers.openlibrary.org/b/id/12376585-L.jpg",
    "coverGradient": "linear-gradient(135deg, #059669 0%, #064e3b 50%, #022c22 100%)",
    "accentColor": "#059669"
  },
  {
    "id": 19,
    "title": "Dom Casmurro",
    "author": "Machado de Assis",
    "genre": "Clássicos",
    "rating": 4.8,
    "reviewsCount": 3500,
    "price": 26.9,
    "originalPrice": 38,
    "discountPercent": 29,
    "stock": 50,
    "badge": "Literatura Nacional",
    "format": "Capa Dura",
    "synopsis": "Bento Santiago narra em retrospectiva sua vida e sua paixão por Capitu, atormentado pelo ciúme e pela dúvida sobre a fidelidade de sua amada nos olhos de ressaca.",
    "year": 1899,
    "pages": 256,
    "status": "Disponível",
    "coverImage": "https://covers.openlibrary.org/b/id/12818862-L.jpg",
    "coverGradient": "linear-gradient(135deg, #10b981 0%, #047857 50%, #064e3b 100%)",
    "accentColor": "#10b981"
  },
  {
    "id": 20,
    "title": "Entendendo Algoritmos",
    "author": "Aditya Y. Bhargava",
    "genre": "Tecnologia",
    "rating": 4.9,
    "reviewsCount": 1320,
    "price": 58.9,
    "originalPrice": 79,
    "discountPercent": 25,
    "stock": 22,
    "badge": "Mais Vendido",
    "format": "Brochura Ilustrada",
    "synopsis": "Um guia ilustrado e amigável que ensina como aplicar algoritmos comuns aos problemas práticos do dia a dia da programação, com exemplos em Python e explicações visuais intuitivas.",
    "year": 2016,
    "pages": 264,
    "status": "Disponível",
    "coverImage": "https://covers.openlibrary.org/b/id/8512926-L.jpg",
    "coverGradient": "linear-gradient(135deg, #14b8a6 0%, #0f766e 50%, #042f2e 100%)",
    "accentColor": "#14b8a6"
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
