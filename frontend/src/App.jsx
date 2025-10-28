import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import Header from './components/Header';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import BookDetailsPage from './pages/BookDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyBooksPage from './pages/MyBooksPage';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <div className="d-flex flex-column min-vh-100">
                <Header />

                <main className="flex-grow-1">
                    <Container fluid className="my-4">
                        <Routes>
                            {/* Публічні маршрути */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/books/:id" element={<BookDetailsPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />

                            {/* Захищені маршрути */}
                            <Route path="/my-books" element={
                                <ProtectedRoute>
                                    <MyBooksPage />
                                </ProtectedRoute>
                            } />
                            <Route path="/admin" element={
                                <ProtectedRoute adminOnly={true}>
                                    <AdminPanel />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </Container>
                </main>

                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;