import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { isLoggedIn, isAdmin } from '../services/authService';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import { statusMap, dbStatuses } from '../services/statusMapper';

function BookDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);

    const [userInteraction, setUserInteraction] = useState(null);
    const [loading, setLoading] = useState(true);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const loggedIn = isLoggedIn();
    const admin = isAdmin();

    const fetchData = async () => {
        try {
            const [bookRes, reviewsRes] = await Promise.all([
                api.get(`/books/${id}`),
                api.get(`/books/${id}/reviews`)
            ]);
            setBook(bookRes.data);
            setReviews(reviewsRes.data);

            if (loggedIn) {
                const interactionRes = await api.get(`/books/my/status/${id}`);
                setUserInteraction(interactionRes.data);

                if (interactionRes.data) {
                    setRating(interactionRes.data.rating || 0);
                    setComment(interactionRes.data.comment || '');
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id, loggedIn]);


    const handleAddToList = async () => {
        try {
            await api.post('/books/my/list', {
                book_id: book.id,
                status: 'to_read',
            });
            alert('Книгу додано до вашого списку!');
            fetchData();
        } catch (error) {
            alert('Помилка додавання книги.');
            console.error("Error adding book:", error);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await api.post('/books/my/list', {
                book_id: book.id,
                status: newStatus,
                rating: userInteraction?.rating,
                comment: userInteraction?.comment
            });
            setUserInteraction(prev => ({ ...prev, status: newStatus }));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };


    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0 || rating > 10 || rating < 1) {
            alert("Будь ласка, виберіть рейтинг від 1 до 10.");
            return;
        }
        try {
            await api.post('/books/my/list', {
                book_id: book.id,
                status: 'read',
                rating,
                comment,
            });
            alert('Дякуємо за ваш відгук!');
            fetchData();
        } catch (error) {
            alert('Не вдалося надіслати відгук.');
            console.error("Error sending review:", error);
        }
    };

    const handleReviewDelete = async (userId) => {
        if (window.confirm("Ви впевнені?")) {
            try {
                await api.delete(`/admin/reviews/${id}/${userId}`);
                alert('Відгук видалено.');
                fetchData(); // Оновлюємо дані
            } catch (error) {
                alert('Не вдалося видалити відгук.');
                console.error("Error deleting review:", error);
            }
        }
    };

    if (loading) return <p>Завантаження...</p>;
    if (!book) return <Alert variant="danger">Книгу не знайдено.</Alert>;

    return (
        <Container>
            <Row>
                <Col md={8}>
                    <h2>{book.title}</h2>
                    <p className="text-muted">Автор: {book.author_name} | Жанр: {book.genre_name} | Рік: {book.year}</p>
                    <p>{book.description}</p>
                    <hr />

                    <h3>Відгуки</h3>
                    {reviews.length > 0 ? (
                        <ListGroup variant="flush">
                            {reviews.map(review => (
                                <ListGroup.Item key={review.user_id} className="mb-3 border p-3">
                                    <Row>
                                        <Col>
                                            <strong>{review.name} {review.surname}</strong>
                                            <span className="ms-2 text-warning">⭐ {review.rating}/10</span>
                                        </Col>
                                        {admin && (
                                            <Col xs="auto">
                                                <Button variant="outline-danger" size="sm" onClick={() => handleReviewDelete(review.user_id)}>
                                                    Видалити
                                                </Button>
                                            </Col>
                                        )}
                                    </Row>
                                    <p className="mb-1 mt-2">{review.comment}</p>
                                    <small className="text-muted">{new Date(review.created_at).toLocaleDateString()}</small>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <p>До цієї книги ще немає відгуків. Будьте першим!</p>
                    )}
                </Col>

                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Керування книгою</Card.Title>

                            {!loggedIn && (
                                <Alert variant="info">
                                    <Alert.Link href="/login">Увійдіть</Alert.Link>, щоб додати книгу та залишити відгук.
                                </Alert>
                            )}

                            {loggedIn && !userInteraction && (
                                <Button variant="primary" className="w-100" onClick={handleAddToList}>
                                    Додати до мого списку
                                </Button>
                            )}

                            {loggedIn && userInteraction && (
                                <div>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Мій статус:</Form.Label>
                                        <Form.Select
                                            value={userInteraction.status}
                                            onChange={(e) => handleStatusChange(e.target.value)}
                                        >
                                            {dbStatuses.map(key => (
                                                <option key={key} value={key}>
                                                    {statusMap[key]}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <hr />

                                    {userInteraction.status === 'read' ? (
                                        <Form onSubmit={handleReviewSubmit}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Ваш відгук (⭐ {rating}/10):</Form.Label>
                                                <Form.Range
                                                    min="1" max="10" step="1"
                                                    value={rating}
                                                    onChange={(e) => setRating(Number(e.target.value))}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Control
                                                    as="textarea"
                                                    rows={4}
                                                    placeholder="Поділіться враженнями..."
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                />
                                            </Form.Group>
                                            <Button type="submit" variant="success" className="w-100">
                                                {userInteraction.comment ? 'Оновити відгук' : 'Надіслати відгук'}
                                            </Button>
                                        </Form>
                                    ) : (
                                        <Alert variant="secondary" size="sm">
                                            Ви можете залишити відгук, коли позначите книгу як "Прочитано".
                                        </Alert>
                                    )}
                                </div>
                            )}

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default BookDetailsPage;