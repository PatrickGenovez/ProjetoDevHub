/**
 * Configurações visuais de gradientes e estilos por gênero literário
 */

const GENRE_GRADIENTS = {
  'Ficção Científica': 'linear-gradient(135deg, #10b981 0%, #059669 50%, #064e3b 100%)',
  'Fantasia': 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #065f46 100%)',
  'Distopia': 'linear-gradient(135deg, #059669 0%, #047857 50%, #022c22 100%)',
  'Tecnologia': 'linear-gradient(135deg, #10b981 0%, #047857 50%, #064e3b 100%)',
  'Suspense': 'linear-gradient(135deg, #047857 0%, #065f46 50%, #022c22 100%)',
  'Suspense & Mistério': 'linear-gradient(135deg, #047857 0%, #065f46 50%, #022c22 100%)',
  'Terror & Suspense': 'linear-gradient(135deg, #059669 0%, #064e3b 50%, #022c22 100%)',
  'Clássicos': 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #065f46 100%)',
  'História & Biografias': 'linear-gradient(135deg, #047857 0%, #064e3b 50%, #022c22 100%)',
  'Romance': 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #064e3b 100%)'
};

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
const DEFAULT_ACCENT = '#10b981';

function getGenreGradient(genre) {
  return GENRE_GRADIENTS[genre] || DEFAULT_GRADIENT;
}

// Catálogo vazio de mock: agora todos os livros são carregados dinamicamente via API
const INITIAL_BOOKS = [];

module.exports = {
  INITIAL_BOOKS,
  GENRE_GRADIENTS,
  DEFAULT_GRADIENT,
  DEFAULT_ACCENT,
  getGenreGradient
};
