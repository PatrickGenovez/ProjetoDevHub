/**
 * Serviço de Carrinho de Compras e Sincronização de Conta - Bibliotech
 * Padrão Clean Code & Clean Architecture
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '../../data');
const CARTS_FILE = path.join(DATA_DIR, 'carts.json');

// Garante que o diretório de dados exista
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Inicializa arquivo de carrinhos se não existir
if (!fs.existsSync(CARTS_FILE)) {
  fs.writeFileSync(CARTS_FILE, JSON.stringify({}, null, 2), 'utf-8');
}

function readAllCarts() {
  try {
    if (!fs.existsSync(CARTS_FILE)) return {};
    const content = fs.readFileSync(CARTS_FILE, 'utf-8');
    return JSON.parse(content || '{}');
  } catch (err) {
    console.error('[CartService] Erro ao ler carts.json:', err.message);
    return {};
  }
}

function writeAllCarts(carts) {
  try {
    const newContent = JSON.stringify(carts, null, 2);
    if (fs.existsSync(CARTS_FILE)) {
      const currentContent = fs.readFileSync(CARTS_FILE, 'utf-8');
      if (currentContent === newContent) {
        return true; // Sem alterações, evita I/O e eventos de arquivo desnecessários
      }
    }
    fs.writeFileSync(CARTS_FILE, newContent, 'utf-8');
    return true;
  } catch (err) {
    console.error('[CartService] Erro ao salvar carts.json:', err.message);
    return false;
  }
}

class CartService {
  /**
   * Buscar carrinho de um usuário pelo ID
   */
  static getCart(userId) {
    if (!userId) return [];
    const carts = readAllCarts();
    const userCart = carts[String(userId)];
    return Array.isArray(userCart) ? userCart : [];
  }

  /**
   * Salvar/Substituir carrinho completo do usuário
   */
  static saveCart(userId, items = []) {
    if (!userId) throw new Error('ID de usuário obrigatório para persistência de carrinho.');

    const cleanItems = Array.isArray(items)
      ? items.map((item) => ({
          id: item.id,
          title: item.title || 'Livro Sem Título',
          author: item.author || 'Autor Reconhecido',
          price: parseFloat(item.price) || 49.9,
          originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : null,
          quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
          coverImage: item.coverImage || '',
          format: item.format || 'Brochura',
          genre: item.genre || 'Geral'
        }))
      : [];

    const carts = readAllCarts();
    carts[String(userId)] = cleanItems;
    writeAllCarts(carts);

    return cleanItems;
  }

  /**
   * Sincronização / Mesclagem Inteligente (Smart Merge):
   * Combina itens do carrinho de visitante com os itens já salvos na conta do usuário
   */
  static mergeCart(userId, localItems = []) {
    if (!userId) throw new Error('ID de usuário obrigatório para sincronização.');

    const serverCart = this.getCart(userId);
    const incomingItems = Array.isArray(localItems) ? localItems : [];

    // Se o cliente não tem itens locais, retorna o carrinho do servidor sem alterar nada
    if (incomingItems.length === 0) {
      return serverCart;
    }

    // Se o servidor está vazio, salva os itens trazidos do localStorage
    if (serverCart.length === 0) {
      return this.saveCart(userId, incomingItems);
    }

    const mergedMap = new Map();

    // 1. Carrega itens do servidor
    for (const item of serverCart) {
      mergedMap.set(String(item.id), { ...item });
    }

    // 2. Mescla itens trazidos do localStorage
    for (const item of incomingItems) {
      const key = String(item.id);
      if (mergedMap.has(key)) {
        const existing = mergedMap.get(key);
        // Não soma as quantidades para não duplicar itens a cada entrada/refresh na página!
        existing.quantity = Math.max(existing.quantity || 1, item.quantity || 1);
      } else {
        mergedMap.set(key, {
          id: item.id,
          title: item.title || 'Livro Sem Título',
          author: item.author || 'Autor',
          price: parseFloat(item.price) || 49.9,
          originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : null,
          quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
          coverImage: item.coverImage || '',
          format: item.format || 'Brochura',
          genre: item.genre || 'Geral'
        });
      }
    }

    const mergedItems = Array.from(mergedMap.values());
    this.saveCart(userId, mergedItems);

    return mergedItems;
  }

  /**
   * Limpar carrinho do usuário
   */
  static clearCart(userId) {
    if (!userId) return [];
    const carts = readAllCarts();
    delete carts[String(userId)];
    writeAllCarts(carts);
    return [];
  }
}

module.exports = CartService;
