require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  console.log('====================================================');
  console.log('🚀 INICIANDO CONFIGURAÇÃO DO BANCO DE DADOS (MYSQL)');
  console.log('====================================================');
  console.log(`Conectando em ${process.env.DB_HOST}:${process.env.DB_PORT} (DB: ${process.env.DB_NAME})...`);

  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true,
      connectTimeout: 8000
    });
    console.log('✅ Conexão inicial estabelecida com o servidor MySQL!');
  } catch (connErr) {
    console.error('❌ Falha ao conectar ao MySQL:', connErr.message);
    process.exit(1);
  }

  try {
    // 1. Criar e selecionar o banco
    const dbName = process.env.DB_NAME || 'devhub';
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await conn.changeUser({ database: dbName });
    console.log(`✅ Banco de dados "${dbName}" ativo e selecionado.`);

    // 2. Executar schema.sql
    const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await conn.query(sql);
      console.log('✅ Tabelas criadas/verificadas com sucesso via schema.sql:');
      console.log('   - users');
      console.log('   - plans');
      console.log('   - books');
      console.log('   - community_posts');
      console.log('   - post_replies');
      console.log('   - post_reactions');
      console.log('   - user_preferences');
    }

    // 3. Garantir usuário Administrador com hash válido
    const salt = bcrypt.genSaltSync(10);
    const adminHash = bcrypt.hashSync('admin123', salt);
    await conn.query(
      `INSERT INTO users (id, email, full_name, password_hash, plano_id, role)
       VALUES (1, 'patrick@bibliotech.com', 'Patrick Genovez', ?, 'master', 'admin')
       ON DUPLICATE KEY UPDATE full_name = 'Patrick Genovez', password_hash = ?, plano_id = 'master', role = 'admin'`,
      [adminHash, adminHash]
    );
    console.log('✅ Usuário administrador "patrick@bibliotech.com" (admin123) sincronizado!');

    // 4. Popular Livros do Catálogo se a tabela estiver vazia
    const [bookRows] = await conn.query('SELECT COUNT(*) as count FROM books');
    if (bookRows[0].count === 0) {
      console.log('📚 Populando catálogo de livros padrão na tabela "books"...');
      const booksRoutePath = path.resolve(__dirname, '../routes/books.js');
      // Importa catálogo
      let initialBooks = [];
      try {
        const booksRoute = require(booksRoutePath);
        // O array de livros está exportado ou definido
        if (booksRoute.defaultBooks) {
          initialBooks = booksRoute.defaultBooks;
        }
      } catch (e) {}

      if (!initialBooks || initialBooks.length === 0) {
        initialBooks = [
          {
            title: "Duna",
            author: "Frank Herbert",
            genre: "Ficção Científica",
            rating: 4.9,
            reviewsCount: 1840,
            price: 59.9,
            originalPrice: 89.9,
            discountPercent: 33,
            stock: 24,
            badge: "Mais Vendido",
            format: "Capa Dura",
            synopsis: "Em um futuro distante, o jovem Paul Atreides é herdeiro de uma família nobre enviada para governar o inóspito planeta desértico Arrakis, a única fonte da substância mais valiosa do universo, a especiaria mélange.",
            year: 1965,
            pages: 680,
            coverImage: "https://covers.openlibrary.org/b/id/11149234-L.jpg",
            coverGradient: "linear-gradient(135deg, #10b981 0%, #059669 50%, #064e3b 100%)",
            accentColor: "#10b981"
          },
          {
            title: "O Senhor dos Anéis: A Sociedade do Anel",
            author: "J.R.R. Tolkien",
            genre: "Fantasia",
            rating: 5.0,
            reviewsCount: 2410,
            price: 69.9,
            originalPrice: 99.9,
            discountPercent: 30,
            stock: 18,
            badge: "Destaque",
            format: "Edição Especial",
            synopsis: "Frodo Bolseiro, um hobbit da pacata Comarca, herda um anel mágico ancestral e descobre que ele tem o poder de escravizar toda a Terra-média nas mãos do Senhor do Escuro, Sauron.",
            year: 1954,
            pages: 576,
            coverImage: "https://covers.openlibrary.org/b/id/14547565-L.jpg",
            coverGradient: "linear-gradient(135deg, #34d399 0%, #10b981 50%, #064e3b 100%)",
            accentColor: "#34d399"
          },
          {
            title: "1984",
            author: "George Orwell",
            genre: "Distopia",
            rating: 4.8,
            reviewsCount: 3150,
            price: 34.9,
            originalPrice: 49.9,
            discountPercent: 30,
            stock: 45,
            badge: "Super Oferta",
            format: "Brochura",
            synopsis: "Em uma sociedade totalitária dominada pelo Partido e pelo onipresente Grande Irmão, Winston Smith trabalha no Ministério da Verdade reescrevendo a história, mas começa secretamente a questionar o regime.",
            year: 1949,
            pages: 336,
            coverImage: "https://covers.openlibrary.org/b/id/9267242-L.jpg",
            coverGradient: "linear-gradient(135deg, #059669 0%, #047857 50%, #022c22 100%)",
            accentColor: "#059669"
          },
          {
            title: "Código Limpo (Clean Code)",
            author: "Robert C. Martin",
            genre: "Tecnologia",
            rating: 4.7,
            reviewsCount: 980,
            price: 84.9,
            originalPrice: 119.0,
            discountPercent: 28,
            stock: 12,
            badge: "Mais Vendido",
            format: "Brochura Premium",
            synopsis: "Um guia fundamental sobre boas práticas de engenharia de software, mostrando como escrever código legível, modular e de fácil manutenção através de princípios de refatoração, nomes significativos e testes automatizados.",
            year: 2008,
            pages: 464,
            coverImage: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
            coverGradient: "linear-gradient(135deg, #10b981 0%, #047857 50%, #022c22 100%)",
            accentColor: "#10b981"
          },
          {
            title: "O Hobbit",
            author: "J.R.R. Tolkien",
            genre: "Fantasia",
            rating: 4.9,
            reviewsCount: 1620,
            price: 49.9,
            originalPrice: 65.0,
            discountPercent: 23,
            stock: 22,
            badge: "Clássico",
            format: "Capa Dura Ilustrada",
            synopsis: "Bilbo Bolseiro vive uma vida confortável e sem ambições até que o mago Gandalf e uma companhia de anões o convencem a participar de uma expedição perigosa para recuperar o tesouro guardado pelo terrível dragão Smaug.",
            year: 1937,
            pages: 310,
            coverImage: "https://covers.openlibrary.org/b/id/8406786-L.jpg",
            coverGradient: "linear-gradient(135deg, #059669 0%, #10b981 50%, #047857 100%)",
            accentColor: "#059669"
          }
        ];
      }

      for (const b of initialBooks) {
        await conn.query(
          `INSERT INTO books (title, author, genre, rating, reviews_count, price, original_price, discount_percent, stock, badge, format, synopsis, year, pages, status, cover_image, cover_gradient, accent_color)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Disponível', ?, ?, ?)`,
          [
            b.title,
            b.author,
            b.genre,
            b.rating || 5.0,
            b.reviewsCount || 0,
            b.price || 49.90,
            b.originalPrice || 69.90,
            b.discountPercent || 20,
            b.stock || 20,
            b.badge || 'Destaque',
            b.format || 'Capa Dura',
            b.synopsis || '',
            b.year || 2024,
            b.pages || 300,
            b.coverImage || '',
            b.coverGradient || 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            b.accentColor || '#10b981'
          ]
        );
      }
      console.log(`✅ ${initialBooks.length} livros inseridos com sucesso na tabela "books"!`);
    } else {
      console.log(`ℹ️ Tabela "books" já possui ${bookRows[0].count} obras cadastradas.`);
    }

    // 5. Popular Posts da Comunidade se estiver vazio
    const [postRows] = await conn.query('SELECT COUNT(*) as count FROM community_posts');
    if (postRows[0].count === 0) {
      console.log('💬 Populando resenhas e discussões na tabela "community_posts"...');
      const initialPosts = [
        {
          author_name: 'Mariana Silveira',
          author_avatar: 'M',
          author_badge: 'Membro Box VIP',
          channel: 'resenhas',
          is_vip: false,
          book_title: 'Duna',
          book_author: 'Frank Herbert',
          book_cover: 'https://covers.openlibrary.org/b/id/11149234-L.jpg',
          book_price: 59.90,
          category: 'Resenha Completa',
          rating: 5,
          title: 'Uma obra-prima monumental: a política e o deserto de Arrakis',
          content: 'Duna transcende a ficção científica comum. A construção do ecossistema de Arrakis, a intriga das casas Atreides e Harkonnen e o peso profético sobre Paul criam uma atmosfera densa e arrebatadora.',
          quote: 'O medo é o assassino da mente. O medo é a pequena morte que traz a obliteração total.',
          has_spoiler: false,
          likes_count: 58
        },
        {
          author_name: 'Lucas Ferreira',
          author_avatar: 'L',
          author_badge: 'Membro do Clube',
          channel: 'teorias',
          is_vip: false,
          book_title: '1984',
          book_author: 'George Orwell',
          book_cover: 'https://covers.openlibrary.org/b/id/9267242-L.jpg',
          book_price: 34.90,
          category: 'Discussão & Teorias',
          rating: 5,
          title: 'Mais atual e urgente do que nunca: o impacto da Novilíngua',
          content: 'O que mais me chamou a atenção nessa releitura foi o conceito da Novilíngua — como o controle do vocabulário limita a capacidade de formular pensamentos dissidentes.',
          quote: 'Guerra é paz. Liberdade é escravidão. Ignorância é força.',
          has_spoiler: true,
          likes_count: 45
        },
        {
          author_name: 'Camila Rocha',
          author_avatar: 'C',
          author_badge: 'Engenheira de Software',
          channel: 'indicacoes',
          is_vip: false,
          book_title: 'Código Limpo (Clean Code)',
          book_author: 'Robert C. Martin',
          book_cover: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',
          book_price: 84.90,
          category: 'Dica de Leitura',
          rating: 5,
          title: 'Transformou meus pull requests e a comunicação no time',
          content: 'Recomendo para todo desenvolvedor, do estagiário ao tech lead. O capítulo sobre nomes expressivos e funções pequenas e modulares mudou completamente a clareza do meu código diário.',
          quote: 'Qualquer tolo pode escrever código que um computador entenda. Bons programadores escrevem código que humanos entendem.',
          has_spoiler: false,
          likes_count: 39
        }
      ];

      for (const p of initialPosts) {
        await conn.query(
          `INSERT INTO community_posts (user_id, author_name, author_avatar, author_badge, channel, is_vip, book_title, book_author, book_cover, book_price, category, rating, title, content, quote, has_spoiler, likes_count)
           VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            p.author_name,
            p.author_avatar,
            p.author_badge,
            p.channel,
            p.is_vip ? 1 : 0,
            p.book_title,
            p.book_author,
            p.book_cover,
            p.book_price,
            p.category,
            p.rating,
            p.title,
            p.content,
            p.quote,
            p.has_spoiler ? 1 : 0,
            p.likes_count
          ]
        );
      }
      console.log(`✅ ${initialPosts.length} posts iniciais da comunidade inseridos!`);
    } else {
      console.log(`ℹ️ Tabela "community_posts" já possui ${postRows[0].count} publicações.`);
    }

    // Listagem final das tabelas
    const [finalTables] = await conn.query('SHOW TABLES');
    console.log('\n====================================================');
    console.log('🎉 BANCO DE DADOS DEVHUB ESTRUTURADO COM SUCESSO!');
    console.log('Tabelas ativas no MySQL:');
    finalTables.forEach(t => console.log('  •', Object.values(t)[0]));
    console.log('====================================================');

  } catch (err) {
    console.error('❌ Erro durante a configuração do banco:', err);
  } finally {
    await conn.end();
  }
}

setupDatabase();
