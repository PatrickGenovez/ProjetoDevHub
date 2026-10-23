require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkDatabases() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectTimeout: 5000
    });
    const [dbs] = await conn.query('SHOW DATABASES');
    console.log('Databases on this MySQL server:');
    dbs.forEach(d => console.log(' -', Object.values(d)[0]));
    await conn.end();
  } catch (e) {
    console.error('Error:', e.message);
  }
}

checkDatabases();
