import React, { useState } from 'react';
import api from '../services/api';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState(''); // 1. Додано стан
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    const [message, setMessage] = useState('');
    const [serverError, setServerError] = useState(''); // Перейменовано, щоб уникнути плутанини
    const [errors, setErrors] = useState({}); // 2. Стан для помилок валідації

    // 3. Функція валідації
    const validate = () => {
        const newErrors = {};

        // Правила валідації
        if (!name) newErrors.name = "Ім'я є обов'язковим полем";
        if (!surname) newErrors.surname = "Прізвище є обов'язковим полем";
        if (!username) {
            newErrors.username = "Логін є обов'язковим полем";
        } else if (username.length < 4) {
            newErrors.username = "Логін має містити щонайменше 3 символи";
        }
        if (!password) {
            newErrors.password = "Пароль є обов'язковим полем";
        } else if (password.length < 6) {
            newErrors.password = "Пароль має містити щонайменше 6 символів";
        }
        if (password !== passwordConfirm) {
            newErrors.passwordConfirm = "Паролі не співпадають";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Скидаємо старі помилки
        setServerError('');
        setMessage('');

        // 4. Запускаємо валідацію
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors); // Якщо є помилки, показуємо їх
            return; // Не відправляємо форму
        }

        // Якщо валідація пройшла, відправляємо запит
        try {
            await api.post('/auth/register', { username, password, name, surname });
            setMessage('Реєстрація успішна! Тепер ви можете увійти.');
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setServerError('Такий користувач вже існує.');
            } else {
                setServerError('Помилка реєстрації.');
            }
            console.error(err);
        }
    };

    return (
        <div
            className="container d-flex justify-content-center align-items-start"
        >
            <div className="card p-4 shadow" style={{width: '100%', maxWidth: '500px'}}>
                <h2 className="text-center mb-4">Реєстрація</h2>
                <form onSubmit={handleSubmit} noValidate>

                    <div className="mb-3">
                        <label className="form-label">Ім'я:</label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Прізвище:</label>
                        <input
                            type="text"
                            className={`form-control ${errors.surname ? 'is-invalid' : ''}`}
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                        />
                        {errors.surname && <div className="invalid-feedback">{errors.surname}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Ім'я користувача (логін):</label>
                        <input
                            type="text"
                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Пароль:</label>
                        <input
                            type="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Підтвердіть пароль:</label>
                        <input
                            type="password"
                            className={`form-control ${errors.passwordConfirm ? 'is-invalid' : ''}`}
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                        {errors.passwordConfirm && <div className="invalid-feedback">{errors.passwordConfirm}</div>}
                    </div>

                    {serverError && <p className="text-danger">{serverError}</p>}
                    {message && <p className="text-success">{message}</p>}
                    <button type="submit" className="btn btn-success w-100">Зареєструватися</button>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;