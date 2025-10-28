import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, isAdmin, logout } from '../services/authService';

function Header() {
    const navigate = useNavigate();
    const loggedIn = isLoggedIn();
    const admin = isAdmin();

    const handleLogout = () => {
        logout();
        navigate('/');
        window.location.reload();
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
            <Container fluid>
                <Navbar.Brand as={Link} to="/">📚 Book Tracker</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Головна</Nav.Link>
                        {loggedIn && <Nav.Link as={Link} to="/my-books">Мої книги</Nav.Link>}
                        {admin && <Nav.Link as={Link} to="/admin">Адмін-панель</Nav.Link>}
                    </Nav>
                    <Nav>
                        {!loggedIn ? (
                            <>
                                <Button as={Link} to="/login" variant="outline-light" className="me-2">
                                    Вхід
                                </Button>
                                <Button as={Link} to="/register" variant="primary">
                                    Реєстрація
                                </Button>
                            </>
                        ) : (
                            <Button onClick={handleLogout} variant="outline-danger">
                                Вийти
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;