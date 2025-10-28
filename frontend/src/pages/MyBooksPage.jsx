import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { statusMap } from '../services/statusMapper';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Alert, ListGroup } from 'react-bootstrap';

function MyBooksPage() {
    const [books, setBooks] = useState([]);

    const fetchUserBooks = async () => {
        try {
            const response = await api.get('/books/my/list');
            setBooks(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUserBooks();
    }, []);

    const handleRemove = async (bookId) => {
        if (window.confirm("Ви впевнені, що хочете видалити цю книгу зі списку?")) {
            try {
                await api.delete(`/books/my/list/${bookId}`);
                fetchUserBooks();
            } catch (error) {
                console.error("Error removing book:", error);
                alert("Не вдалося видалити книгу.");
            }
        }
    };

    return (
        <>
            <h2 className="mb-4">Моя бібліотека 📖</h2>

            {books.length === 0 ? (
                <Alert variant="info">
                    У вас ще немає доданих книг. {' '}
                    <Alert.Link as={Link} to="/">Перейти до бібліотеки</Alert.Link>,
                    щоб додати свою першу книгу!
                </Alert>
            ) : (
                <Row>
                    {books.map((book) => (
                        <Col md={6} lg={4} key={book.id} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>
                                        <Link to={`/books/${book.id}`} className="text-decoration-none">
                                            {book.title}
                                        </Link>
                                    </Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        {book.author_name}
                                    </Card.Subtitle>

                                    <ListGroup variant="flush" className="my-3">
                                        <ListGroup.Item className="px-0">
                                            <strong>Статус:</strong> {statusMap[book.status] || book.status}
                                        </ListGroup.Item>
                                        <ListGroup.Item className="px-0">
                                            <strong>Відгук:</strong> {book.rating ? `${book.rating}/10 ⭐` : 'Немає оцінки'}
                                        </ListGroup.Item>
                                    </ListGroup>

                                    {/* Кнопка "Видалити"*/}
                                    <Button
                                        variant="outline-danger"
                                        onClick={() => handleRemove(book.id)}
                                        className="mt-auto"
                                    >
                                        Видалити зі списку
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </>
    );
}

export default MyBooksPage;