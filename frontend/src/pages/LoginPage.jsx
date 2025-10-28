import React, { useState } from 'react';
import api from '../services/api';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            window.location.href = '/my-books';
        } catch (err) {
            setError('Неправильний логін або пароль.');
            console.error(err);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card p-4 shadow" style={{width: '100%', maxWidth: '400px'}}>
                <h2 className="text-center mb-4">Вхід</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Ім'я користувача:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Пароль:</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    <button type="submit" className="btn btn-primary w-100">Увійти</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;