// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

// Імпортуємо маршрути
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes'); // Новий
const genreRoutes = require('./routes/genreRoutes');   // Новий
const adminRoutes = require('./routes/adminRoutes');   // Новий

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Роути
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes); // Новий
app.use('/api/genres', genreRoutes);   // Новий
app.use('/api/admin', adminRoutes);   // Новий

// Головний маршрут для перевірки роботи
app.get('/', (req, res) => {
    res.send('Book Tracker API is running!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});