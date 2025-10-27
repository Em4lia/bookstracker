// controllers/bookController.js
const db = require('../config/db');

// Отримати всі книги (з пошуком, фільтрацією, сортуванням, пагінацією)
exports.getAllBooks = async (req, res) => {
    try {
        const { search, genre_id, sortBy, page = 1, limit = 10 } = req.query;

        // --- Базовий запит для фільтрації ---
        let baseQuery = `
            FROM book b
            JOIN author a ON b.author_id = a.id
            JOIN genre g ON b.genre_id = g.id
        `;
        const queryParams = [];
        let whereClauses = [];

        if (search) {
            whereClauses.push(`(b.title LIKE ? OR a.name LIKE ?)`);
            queryParams.push(`%${search}%`, `%${search}%`);
        }
        if (genre_id) {
            whereClauses.push(`b.genre_id = ?`);
            queryParams.push(genre_id);
        }

        if (whereClauses.length > 0) {
            baseQuery += ' WHERE ' + whereClauses.join(' AND ');
        }

        // --- 1. Отримуємо загальну кількість книг (для пагінації) ---
        const countQuery = `SELECT COUNT(b.id) as totalCount ${baseQuery}`;
        const [countRows] = await db.query(countQuery, queryParams);
        const totalCount = countRows[0].totalCount;
        const totalPages = Math.ceil(totalCount / limit);

        // --- 2. Отримуємо книги для поточної сторінки ---
        let booksQuery = `
            SELECT 
                b.id, b.isbn, b.title, b.description, b.year,
                a.name AS author_name,
                g.name AS genre_name,
                (SELECT AVG(rating) FROM userbookinteraction WHERE book_id = b.id) as average_rating
            ${baseQuery}
        `;

        // Сортування
        if (sortBy === 'title_asc') {
            booksQuery += ' ORDER BY b.title ASC';
        } else if (sortBy === 'rating_desc') {
            booksQuery += ' ORDER BY average_rating DESC';
        } else {
            booksQuery += ' ORDER BY b.id DESC';
        }

        // Пагінація
        const offset = (page - 1) * limit;
        booksQuery += ' LIMIT ? OFFSET ?';
        // Додаємо ліміт та зсув до *копії* масиву параметрів, щоб не заважати запиту на кількість
        const booksQueryParams = [...queryParams, parseInt(limit), parseInt(offset)];
        const [books] = await db.query(booksQuery, booksQueryParams);

        // --- Надсилаємо відповідь ---
        res.json({
            books,
            totalPages,
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Отримати одну книгу за ID
exports.getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT b.id, b.isbn, b.title, b.description, b.year, a.id as author_id, a.name AS author_name, g.id as genre_id, g.name AS genre_name
            FROM book b
            JOIN author a ON b.author_id = a.id
            JOIN genre g ON b.genre_id = g.id
            WHERE b.id = ?
        `;
        const [rows] = await db.execute(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// [ADMIN] Оновити книгу
exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { isbn, title, author_id, description, year, genre_id } = req.body;
        const query = `
            UPDATE book SET isbn = ?, title = ?, author_id = ?, description = ?, year = ?, genre_id = ? 
            WHERE id = ?
        `;
        await db.execute(query, [isbn, title, author_id, description, year, genre_id, id]);
        res.json({ message: 'Book updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// [ADMIN] Видалити книгу
exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        // Потрібно також видалити всі взаємодії з цією книгою, щоб уникнути помилок
        await db.execute('DELETE FROM userbookinteraction WHERE book_id = ?', [id]);
        await db.execute('DELETE FROM book WHERE id = ?', [id]);
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// [USER] Видалити книгу зі свого списку
exports.deleteUserBookInteraction = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookId } = req.params;
        await db.execute('DELETE FROM userbookinteraction WHERE user_id = ? AND book_id = ?', [userId, bookId]);
        res.json({ message: 'Book removed from your list.' });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Додати нову книгу (тільки для адміна)
exports.addBook = async (req, res) => {
    try {
        const { isbn, title, author_id, description, year, genre_id } = req.body;
        const query = 'INSERT INTO book (isbn, title, author_id, description, year, genre_id) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.execute(query, [isbn, title, author_id, description, year, genre_id]);
        res.status(201).json({ message: 'Book added successfully', bookId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Отримати книги конкретного користувача
exports.getUserBooks = async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `
            SELECT 
                b.id, b.title, a.name as author_name,
                ubi.status, ubi.rating, ubi.comment
            FROM userbookinteraction ubi
            JOIN book b ON ubi.book_id = b.id
            JOIN author a ON b.author_id = a.id
            WHERE ubi.user_id = ?
        `;
        const [userBooks] = await db.execute(query, [userId]);
        res.json(userBooks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Додати/оновити взаємодію користувача з книгою
exports.manageUserBook = async (req, res) => {
    try {
        const userId = req.user.id;
        // Витягуємо дані з тіла запиту
        const { book_id, status, rating, comment } = req.body;

        // Встановлюємо null, якщо значення не передано
        const finalRating = rating !== undefined ? rating : null;
        const finalComment = comment !== undefined ? comment : null;

        // Використовуємо INSERT ... ON DUPLICATE KEY UPDATE для зручності
        // Це додасть новий запис, якщо його немає, або оновить існуючий
        const query = `
            INSERT INTO userbookinteraction (user_id, book_id, status, rating, comment)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                status = VALUES(status), 
                rating = VALUES(rating), 
                comment = VALUES(comment)
        `;

        // Передаємо в запит оброблені значення
        await db.execute(query, [userId, book_id, status, finalRating, finalComment]);
        res.json({ message: 'Your book list has been updated.' });
    } catch (error) {
        console.error("Error in manageUserBook:", error); // Додамо лог на сервері для відладки
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getBookReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT
                ubi.user_id,
                u.name,
                u.surname,
                ubi.rating,
                ubi.comment,
                ubi.created_at
            FROM userbookinteraction ubi
                     JOIN user u ON ubi.user_id = u.id
            WHERE ubi.book_id = ? AND ubi.comment IS NOT NULL AND ubi.comment != ''
            ORDER BY ubi.created_at DESC
        `;
        const [reviews] = await db.execute(query, [id]);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};