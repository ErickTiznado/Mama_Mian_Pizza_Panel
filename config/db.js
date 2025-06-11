const mysql = require('mysql2');

// Configuración de la conexión a MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'registro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Verificar conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error conectando a la base de datos:', err);
    return;
  }
  console.log('✅ Conectado a la base de datos MySQL');
  connection.release();
});

module.exports = pool;