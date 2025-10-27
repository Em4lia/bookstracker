// src/pages/BookDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { isLoggedIn, isAdmin, getCurrentUser } from '../services/authService';

function BookDetailsPage() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);

    // Стан для форми відгуку
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const loggedIn = isLoggedIn();
    const admin = isAdmin();
    const currentUser = getCurrentUser();

    // Функція для завантаження даних
    const fetchData = async () => {
        try {
            const [bookRes, reviewsRes] = await Promise.all([
                api.get(`/books/${id}`),
                api.get(`/books/${id}/reviews`)
            ]);
            setBook(bookRes.data);
            setReviews(reviewsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Будь ласка, виберіть рейтинг.");
            return;
        }
        try {
            await api.post('/books/my/list', {
                book_id: book.id,
                status: 'read', // Якщо залишає відгук, значить прочитав
                rating,
                comment,
            });
            alert('Дякуємо за ваш відгук!');
            fetchData(); // Оновлюємо дані, щоб побачити новий відгук
        } catch (error) {
            console.error("Error submitting review:", error);
            alert('Не вдалося надіслати відгук.');
        }
    };

    const handleReviewDelete = async (userId) => {
        if (window.confirm("Ви впевнені, що хочете видалити цей відгук?")) {
            try {
                await api.delete(`/admin/reviews/${id}/${userId}`);
                alert('Відгук видалено.');
                fetchData(); // Оновлюємо дані
            } catch (error) {
                console.error("Error deleting review:", error);
                alert('Не вдалося видалити відгук.');
            }
        }
    };

    const handleAddToList = async () => {
        if (!isLoggedIn()) {
            alert("Будь ласка, увійдіть, щоб додати книгу.");
            return;
        }
        try {
            await api.post('/books/my/list', {
                book_id: book.id,
                status: 'to_read', // Статус за замовчуванням
            });
            alert('Книгу додано до вашого списку!');
        } catch (error) {
            alert('Помилка додавання книги.');
            console.error(error);
        }
    };

    if (!book) return <p>Завантаження...</p>;

    return (
        <div>
            <div>
                <h2>{book.title}</h2>
                <p><strong>Автор:</strong> {book.author_name}</p>
                <p><strong>Жанр:</strong> {book.genre_name}</p>
                <p><strong>Рік:</strong> {book.year}</p>
                <p><strong>ISBN:</strong> {book.isbn}</p>
                <p><strong>Опис:</strong> {book.description}</p>
                <button onClick={handleAddToList}>Додати до мого списку</button>
            </div>

            {/* --- Секція відгуків --- */}
            <h3>Відгуки</h3>

            {/* Форма для додавання відгуку (тільки для залогінених) */}
            {loggedIn && (
                <div style={{border: '1px solid blue', padding: '15px', marginBottom: '20px'}}>
                    <h4>Залишити свій відгук</h4>
                    <form onSubmit={handleReviewSubmit}>
                        <div>
                            <label>Рейтинг (від 1 до 10): </label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                                required
                            />
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <label>Ваш коментар:</label><br/>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows="4"
                                cols="50"
                                placeholder="Поділіться своїми враженнями..."
                            ></textarea>
                        </div>
                        <button type="submit">Надіслати</button>
                    </form>
                </div>
            )}

            {/* Список існуючих відгуків */}
            {reviews.length > 0 ? (
                reviews.map(review => (
                    <div key={review.user_id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        <p>
                            {/* Змінюємо відображення з username на name + surname */}
                            <strong>{review.name} {review.surname}</strong> поставив(ла) оцінку: <strong>{review.rating}/10</strong>
                        </p>
                        <p>{review.comment}</p>
                        <small>Дата: {new Date(review.created_at).toLocaleDateString()}</small>

                        {/* Кнопка видалення для адміна (без змін) */}
                        {admin && (
                            <button
                                onClick={() => handleReviewDelete(review.user_id)}
                                style={{ marginLeft: '20px', color: 'red' }}
                            >
                                Видалити (Admin)
                            </button>
                        )}
                    </div>
                ))
            ) : (
                <p>До цієї книги ще немає відгуків. Будьте першим!</p>
            )}
        </div>
    );
}

export default BookDetailsPage;