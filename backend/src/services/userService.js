const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { PLANS, USER_ROLES } = require('../config/constants');

const DATA_DIR = path.resolve(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Garante que o diretório backend/data exista
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Inicializa arquivo local com usuário demo se não existir
if (!fs.existsSync(USERS_FILE)) {
  const salt = bcrypt.genSaltSync(10);
  const demoHash = bcrypt.hashSync('admin123', salt);
  const initialUsers = [
    {
      id: 1,
      email: 'patrick@bibliotech.com',
      full_name: 'Patrick Genovez',
      password_hash: demoHash,
      plano_id: 'master',
      avatar_url: '',
      role: 'admin',
      created_at: new Date().toISOString()
    }
  ];
  fs.writeFileSync(USERS_FILE, JSON.stringify(initialUsers, null, 2), 'utf-8');
}

// Funções de manipulação do arquivo local
function readLocalUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    const content = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error('[UserService] Erro ao ler users.json:', err.message);
    return [];
  }
}

function writeLocalUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[UserService] Erro ao salvar users.json:', err.message);
    return false;
  }
}

// Inicialização opcional da tabela no MySQL (se conectado)
async function initMySQLTable() {
  try {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(191) NOT NULL UNIQUE,
        full_name VARCHAR(191) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        plano_id VARCHAR(50) DEFAULT 'visitante',
        avatar_url VARCHAR(255) DEFAULT '',
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createTableSQL);
    console.log('[UserService] Tabela "users" verificada/criada no MySQL.');
  } catch (err) {
    console.warn('[UserService] MySQL indisponível, operando no modo de armazenamento local resiliente.');
  }
}

// Dispara inicialização sem bloquear
initMySQLTable().catch(() => {});

const UserService = {
  // Buscar usuário por e-mail
  async findByEmail(email) {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Tenta no MySQL
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE LOWER(email) = ?', [cleanEmail]);
      if (rows && rows.length > 0) return rows[0];
    } catch (dbErr) {
      // Falha silenciosa para fallback
    }

    // 2. Fallback no arquivo local
    const localUsers = readLocalUsers();
    return localUsers.find(u => u.email.toLowerCase() === cleanEmail) || null;
  },

  // Buscar usuário por ID
  async findById(id) {
    const numId = Number(id);

    // 1. Tenta no MySQL
    try {
      const [rows] = await pool.query(
        'SELECT id, email, full_name, plano_id, avatar_url, role, created_at FROM users WHERE id = ?',
        [numId]
      );
      if (rows && rows.length > 0) return rows[0];
    } catch (dbErr) {}

    // 2. Fallback no arquivo local
    const localUsers = readLocalUsers();
    const user = localUsers.find(u => Number(u.id) === numId);
    if (user) {
      const { password_hash, ...safeUser } = user;
      return safeUser;
    }
    return null;
  },

  // Criar novo usuário
  async create({ email, full_name, password_hash, plano_id = 'visitante', avatar_url = '', role = 'user' }) {
    const cleanEmail = email.trim().toLowerCase();
    let insertedId = Date.now();

    // 1. Tenta gravar no MySQL
    try {
      const [result] = await pool.query(
        `INSERT INTO users (email, full_name, password_hash, plano_id, avatar_url, role) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [cleanEmail, full_name.trim(), password_hash, plano_id, avatar_url, role]
      );
      if (result && result.insertId) {
        insertedId = result.insertId;
      }
    } catch (dbErr) {
      console.warn('[UserService] MySQL offline para insert, gravando localmente...');
    }

    // 2. Garante persistência no arquivo local
    const localUsers = readLocalUsers();
    const newUser = {
      id: insertedId,
      email: cleanEmail,
      full_name: full_name.trim(),
      password_hash,
      plano_id,
      avatar_url,
      role,
      created_at: new Date().toISOString()
    };
    localUsers.push(newUser);
    writeLocalUsers(localUsers);

    return newUser;
  },

  // Atualizar senha
  async updatePassword(email, new_password_hash) {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Tenta MySQL
    try {
      await pool.query('UPDATE users SET password_hash = ? WHERE LOWER(email) = ?', [new_password_hash, cleanEmail]);
    } catch (e) {}

    // 2. Atualiza localmente
    const localUsers = readLocalUsers();
    const index = localUsers.findIndex(u => u.email.toLowerCase() === cleanEmail);
    if (index !== -1) {
      localUsers[index].password_hash = new_password_hash;
      writeLocalUsers(localUsers);
      return true;
    }
    return false;
  },

  // Atualizar plano de assinatura
  async updatePlan(userId, plano_id) {
    const numId = Number(userId);

    // 1. Tenta MySQL
    try {
      await pool.query('UPDATE users SET plano_id = ? WHERE id = ?', [plano_id, numId]);
    } catch (e) {}

    // 2. Atualiza localmente
    const localUsers = readLocalUsers();
    const index = localUsers.findIndex(u => Number(u.id) === numId);
    if (index !== -1) {
      localUsers[index].plano_id = plano_id;
      writeLocalUsers(localUsers);
      return true;
    }
    return false;
  }
};

module.exports = UserService;
