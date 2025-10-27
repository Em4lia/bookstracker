// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import api from '../services/api';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            await api.post('/auth/register', { username, password, name, surname });
            setMessage('Реєстрація успішна! Тепер ви можете увійти.');
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setError('Такий користувач вже існує.');
            } else {
                setError('Помилка реєстрації.');
            }
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Реєстрація</h2>
            <form onSubmit={handleSubmit}>
                {/* 3. Додаємо нові поля вводу у JSX */}
                <div>
                    <label>Ім'я:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Прізвище:</label>
                    <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} required />
                </div>
                <div>
                    <label>Ім'я користувача (логін):</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Пароль:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {message && <p style={{ color: 'green' }}>{message}</p>}
                <button type="submit">Зареєструватися</button>
            </form>
        </div>
    );
}

export default RegisterPage;