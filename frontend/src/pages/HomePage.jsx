import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Row, Col, Form, Card, Button, Alert, Pagination } from 'react-bootstrap';

function HomePage() {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('id_desc');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchBooks = async (pageToFetch) => {
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            params.append('sortBy', sortBy);
            params.append('page', pageToFetch); // Надсилаємо номер сторінки

            const response = await api.get(`/books?${params.toString()}`);

            setBooks(response.data.books);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);

        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    useEffect(() => {
        fetchBooks(currentPage);
    }, [search, sortBy, currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber === currentPage || pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    const renderPaginationItems = () => {
        let items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Pagination.Item>,
            );
        }
        return items;
    };

    return (
        <>
            <h2 className="mb-4">Вся бібліотека 📚</h2>

            <Row className="mb-4 p-3 bg-light rounded border">
                <Col md={8}>
                    <Form.Control
                        type="text"
                        placeholder="Пошук за назвою або автором..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Col>
                <Col md={4}>
                    <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="id_desc">Новіші</option>
                        <option value="title_asc">За назвою (А-Я)</option>
                        <option value="rating_desc">За рейтингом</option>
                    </Form.Select>
                </Col>
            </Row>

            <Row>
                {books.length > 0 ? (
                    books.map(book => (
                        <Col xs={12} md={6} lg={4} key={book.id} className="mb-4">
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
                                    <Card.Text>
                                        <strong>Жанр:</strong> {book.genre_name}<br/>
                                        <strong>Рейтинг:</strong> {book.average_rating ?
                                        parseFloat(book.average_rating).toFixed(1) + ' ⭐' : 'Немає оцінок'}
                                    </Card.Text>
                                    <Button
                                        as={Link}
                                        to={`/books/${book.id}`}
                                        variant="primary"
                                        className="mt-auto"
                                    >
                                        Детальніше
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <Alert variant="info">Книг не знайдено за вашим запитом.</Alert>
                    </Col>
                )}
            </Row>

            {totalPages > 1 && (
                <Row>
                    <Col className="d-flex justify-content-center">
                        <Pagination>
                            <Pagination.Prev
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            />
                            {renderPaginationItems()}
                            <Pagination.Next
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                    </Col>
                </Row>
            )}
        </>
    );
}

export default HomePage;