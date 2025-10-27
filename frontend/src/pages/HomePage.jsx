// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

function HomePage() {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('id_desc');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                // Формуємо параметри запиту
                const params = new URLSearchParams();
                if (search) params.append('search', search);
                params.append('sortBy', sortBy);

                const response = await api.get(`/books?${params.toString()}`);
                setBooks(response.data);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };
        fetchBooks();
    }, [search, sortBy]); // Перезавантажуємо дані при зміні пошуку або сортування

    return (
        <div>
            <h2>Вся бібліотека</h2>
            <div>
                <input
                    type="text"
                    placeholder="Пошук за назвою або автором..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ marginRight: '10px' }}
                />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="id_desc">Новіші</option>
                    <option value="title_asc">За назвою (А-Я)</option>
                    <option value="rating_desc">За рейтингом</option>
                </select>
            </div>
            <div style={{ marginTop: '20px' }}>
                {books.length > 0 ? (
                    books.map(book => (
                        <div key={book.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                            <h3><Link to={`/books/${book.id}`}>{book.title}</Link></h3>
                            <p><strong>Автор:</strong> {book.author_name}</p>
                            <p><strong>Жанр:</strong> {book.genre_name}</p>
                            <p><strong>Середній рейтинг:</strong> {book.average_rating ? parseFloat(book.average_rating).toFixed(1) : 'Немає оцінок'}</p>
                        </div>
                    ))
                ) : (
                    <p>Книг не знайдено.</p>
                )}
            </div>
        </div>
    );
}

export default HomePage;