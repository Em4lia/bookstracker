// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import api from '../services/api';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Запобігаємо перезавантаженню сторінки
        setError(''); // Скидаємо помилку

        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', response.data.token); // Зберігаємо токен
            window.location.href = '/my-books'; // Перенаправляємо на сторінку з книгами
        } catch (err) {
            setError('Неправильний логін або пароль.');
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Вхід</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Ім'я користувача:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Увійти</button>
            </form>
        </div>
    );
}

export default LoginPage;