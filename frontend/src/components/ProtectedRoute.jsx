import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn, isAdmin as checkIsAdmin } from '../services/authService';

function ProtectedRoute({ children, adminOnly = false }) {
    if (!isLoggedIn()) {
        // Якщо користувач не увійшов, перенаправляємо на сторінку входу
        return <Navigate to="/login" />;
    }

    if (adminOnly && !checkIsAdmin()) {
        // Якщо маршрут для адміна, а користувач не адмін, перенаправляємо на головну
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;