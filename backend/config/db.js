// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Створюємо пул з'єднань, що ефективніше для багатьох запитів
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Перевіряємо з'єднання
pool.getConnection()
    .then(connection => {
        console.log('✅ MySQL Database connected successfully!');
        connection.release(); // Повертаємо з'єднання назад у пул
    })
    .catch(error => {
        console.error('❌ Error connecting to MySQL database:', error.message);
    });

module.exports = pool;