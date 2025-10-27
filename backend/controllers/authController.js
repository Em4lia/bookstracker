// controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        // 1. Отримуємо нові поля
        const { username, password, name, surname } = req.body;
        // 2. Додаємо перевірку нових полів
        if (!username || !password || !name || !surname) {
            return res.status(400).json({ message: 'All fields (username, password, name, surname) are required.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Зберігаємо нові поля в БД
        const [result] = await db.execute(
            'INSERT INTO user (username, password, name, surname) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, name, surname] // Додаємо name і surname в запит
        );

        res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Username already exists.' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        // Шукаємо користувача в БД
        const [rows] = await db.execute('SELECT * FROM user WHERE username = ?', [username]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Порівнюємо наданий пароль з хешем у БД
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Створюємо JWT токен
        const payload = {
            id: user.id,
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Logged in successfully!', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};