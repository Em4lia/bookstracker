// client/src/components/Footer.jsx
import React from 'react';
import { Container } from 'react-bootstrap';

function Footer() {
    return (
        // mt-auto (margin-top: auto) притискає футер до низу
        <footer className="footer mt-auto py-3 bg-light border-top">
            <Container fluid className="text-center">
                <span className="text-muted">© {new Date().getFullYear()} Book Tracker. Всі права захищено.</span>
            </Container>
        </footer>
    );
}

export default Footer;