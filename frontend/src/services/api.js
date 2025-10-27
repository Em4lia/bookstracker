// src/services/api.js
import axios from 'axios';

// Створюємо екземпляр axios з базовими налаштуваннями
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Базова URL вашого бекенду
});

// Перехоплювач запитів (Interceptor)
// Ця функція буде виконуватися перед кожним запитом
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Беремо токен з localStorage
        if (token) {
            // Якщо токен є, додаємо його в заголовок Authorization
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Якщо виникає помилка при налаштуванні запиту
        return Promise.reject(error);
    }
);

export default api;