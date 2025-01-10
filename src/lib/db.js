const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: String('1905'), // Ensure password is a string
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Veritabanı bağlantı hatası:', err.stack);
  }
  console.log('Veritabanına başarıyla bağlanıldı');
  release(); // Client'ı serbest bırak
});

export default {
  query: (text, params) => pool.query(text, params),
};
