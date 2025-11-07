import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';

const initialBookState = {
    id: null,
    title: '',
    isbn: '',
    description: '',
    year: new Date().getFullYear(),
    author_id: '',
    genre_id: ''
};

function ManageBooks() {
    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [genres, setGenres] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [currentBook, setCurrentBook] = useState(initialBookState);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const [booksRes, authorsRes, genresRes] = await Promise.all([
                api.get('/books'),
                api.get('/authors'),
                api.get('/genres')
            ]);
            setBooks(booksRes.data.books); // Ми оновили цей ендпоінт для пагінації
            setAuthors(authorsRes.data);
            setGenres(genresRes.data);
        } catch (err) {
            setError('Не вдалося завантажити дані.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleClose = () => {
        setShowModal(false);
        setCurrentBook(initialBookState);
        setError('');
    };

    const handleShowAdd = () => {
        setCurrentBook(initialBookState);
        setShowModal(true);
    };

    const handleShowEdit = (book) => {
        setCurrentBook({
            id: book.id,
            title: book.title,
            isbn: book.isbn,
            description: book.description,
            year: book.year,
            // Нам потрібні ID, а не імена
            author_id: authors.find(a => a.name === book.author_name)?.id || '',
            genre_id: genres.find(g => g.name === book.genre_name)?.id || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цю книгу?')) {
            try {
                await api.delete(`/books/${id}`);
                fetchData();
            } catch (err) {
                alert('Помилка видалення книги.');
            }
        }
    };

    const handleSave = async () => {
        // Проста валідація
        if (!currentBook.title || !currentBook.author_id || !currentBook.genre_id) {
            setError('Назва, автор та жанр є обов\'язковими.');
            return;
        }

        try {
            if (currentBook.id) {
                await api.put(`/books/${currentBook.id}`, currentBook);
            } else {
                await api.post('/books', currentBook);
            }
            fetchData();
            handleClose();
        } catch (err) {
            setError('Помилка збереження книги.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentBook(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            {error && <Alert variant="danger">{error}</Alert>}
            <Table striped bordered hover responsive className="text-center align-middle">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Назва</th>
                    <th>Автор</th>
                    <th>Жанр</th>
                    <th>Рік</th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                {books.map(book => (
                    <tr key={book.id}>
                        <td>{book.id}</td>
                        <td>{book.title}</td>
                        <td>{book.author_name}</td>
                        <td>{book.genre_name}</td>
                        <td>{book.year}</td>
                        <td>
                            <Button variant="warning" size="sm" onClick={() => handleShowEdit(book)} className="me-2">
                                Редагувати
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(book.id)}>
                                Видалити
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {/* Модальне вікно для книг */}
            <Modal show={showModal} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{currentBook.id ? 'Редагувати книгу' : 'Додати книгу'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form>
                        <Row>
                            <Col md={8}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Назва</Form.Label>
                                    <Form.Control type="text" name="title" value={currentBook.title}
                                                  onChange={handleChange}/>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Рік</Form.Label>
                                    <Form.Control type="number" name="year" value={currentBook.year}
                                                  onChange={handleChange}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Автор</Form.Label>
                                    <Form.Select name="author_id" value={currentBook.author_id} onChange={handleChange}>
                                        <option value="">Оберіть автора</option>
                                        {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Жанр</Form.Label>
                                    <Form.Select name="genre_id" value={currentBook.genre_id} onChange={handleChange}>
                                        <option value="">Оберіть жанр</option>
                                        {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>ISBN</Form.Label>
                            <Form.Control type="text" name="isbn" value={currentBook.isbn} onChange={handleChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Опис</Form.Label>
                            <Form.Control as="textarea" rows={3} name="description" value={currentBook.description}
                                          onChange={handleChange}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Закрити
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Зберегти
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="d-flex justify-content-center">
                <Button variant="primary" onClick={handleShowAdd} className="mb-3">
                    ✚ Додати нову книгу
                </Button>
            </div>
        </div>
    );
}

export default ManageBooks;