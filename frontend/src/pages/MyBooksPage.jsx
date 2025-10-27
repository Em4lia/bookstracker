// src/pages/MyBooksPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

import { statusMap } from '../services/statusMapper';
import {Link} from "react-router-dom";

function MyBooksPage() {
    const [books, setBooks] = useState([]);

    const fetchUserBooks = async () => {
        try {
            // Використовуємо новий маршрут
            const response = await api.get('/books/my/list');
            setBooks(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUserBooks();
    }, []);

    const handleRemove = async (bookId) => {
        if (window.confirm("Ви впевнені, що хочете видалити цю книгу зі списку?")) {
            try {
                await api.delete(`/books/my/list/${bookId}`);
                // Оновлюємо список книг після видалення
                fetchUserBooks();
            } catch (error) {
                console.error("Error removing book:", error);
                alert("Не вдалося видалити книгу.");
            }
        }
    };

    return (
        <div>
            <h2>Моя бібліотека</h2>
            {books.length === 0 ? (
                <p>У вас ще немає доданих книг.</p>
            ) : (
                books.map((book) => (
                    <div key={book.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        <strong><Link to={`/books/${book.id}`} className="text-decoration-none">
                            {book.title}
                        </Link></strong> - {book.author_name}
                        <p>Статус: {statusMap[book.status] || book.status}, Рейтинг: {book.rating || 'немає'}</p>
                        <button onClick={() => handleRemove(book.id)}>Видалити зі списку</button>
                    </div>
                ))
            )}
        </div>
    );
}

export default MyBooksPage;