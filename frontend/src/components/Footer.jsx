import React from 'react';
import { Container } from 'react-bootstrap';

function Footer() {
    return (
        <footer className="footer mt-auto py-3 bg-light border-top">
            <Container fluid className="text-center">
                <span className="text-muted">© {new Date().getFullYear()} Book Tracker. Всі права захищено.</span>
            </Container>
        </footer>
    );
}

export default Footer;