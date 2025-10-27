// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookDetailsPage from './pages/BookDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyBooksPage from './pages/MyBooksPage';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import { isLoggedIn, isAdmin, logout } from './services/authService';

function Navigation() {
    const navigate = useNavigate();
    const loggedIn = isLoggedIn();
    const admin = isAdmin();

    const handleLogout = () => {
        logout();
        navigate('/'); // Перенаправляємо на головну після виходу
        window.location.reload(); // Перезавантажуємо сторінку, щоб оновити стан
    };

    return (
        <nav>
            <Link to="/" style={{ marginRight: '10px' }}>Головна</Link>
            {loggedIn && <Link to="/my-books" style={{ marginRight: '10px' }}>Мої книги</Link>}
            {admin && <Link to="/admin" style={{ marginRight: '10px' }}>Адмін-панель</Link>}

            <div style={{ float: 'right' }}>
                {!loggedIn ? (
                    <>
                        <Link to="/login" style={{ marginRight: '10px' }}>Вхід</Link>
                        <Link to="/register">Реєстрація</Link>
                    </>
                ) : (
                    <button onClick={handleLogout}>Вийти</button>
                )}
            </div>
        </nav>
    );
}


function App() {
    return (
        <BrowserRouter>
            <Navigation />
            <hr />
            <main style={{ padding: '20px' }}>
                <Routes>
                    {/* Публічні маршрути */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/books/:id" element={<BookDetailsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Захищені маршрути для користувачів */}
                    <Route path="/my-books" element={
                        <ProtectedRoute>
                            <MyBooksPage />
                        </ProtectedRoute>
                    } />

                    {/* Захищений маршрут для адмінів */}
                    <Route path="/admin" element={
                        <ProtectedRoute adminOnly={true}>
                            <AdminPanel />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;