import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';

function ManageGenres() {
    const [genres, setGenres] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentGenre, setCurrentGenre] = useState({ id: null, name: '' });
    const [error, setError] = useState('');

    const fetchGenres = async () => {
        const res = await api.get('/genres');
        setGenres(res.data);
    };

    useEffect(() => {
        fetchGenres();
    }, []);

    const handleClose = () => {
        setShowModal(false);
        setCurrentGenre({ id: null, name: '' });
        setError('');
    };

    const handleShowAdd = () => {
        setCurrentGenre({ id: null, name: '' });
        setShowModal(true);
    };

    const handleShowEdit = (genre) => {
        setCurrentGenre(genre);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цей жанр?')) {
            try {
                await api.delete(`/genres/${id}`);
                fetchGenres();
            } catch (err) {
                alert('Помилка видалення жанру.');
            }
        }
    };

    const handleSave = async () => {
        if (!currentGenre.name) {
            setError('Назва не може бути порожньою.');
            return;
        }

        try {
            if (currentGenre.id) {
                // Оновлення
                await api.put(`/genres/${currentGenre.id}`, { name: currentGenre.name });
            } else {
                // Створення
                await api.post('/genres', { name: currentGenre.name });
            }
            fetchGenres();
            handleClose();
        } catch (err) {
            setError('Помилка збереження.');
        }
    };

    return (
        <div>
            <Table striped bordered hover responsive className="text-center align-middle">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Назва</th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                {genres.map(genre => (
                    <tr key={genre.id}>
                        <td>{genre.id}</td>
                        <td>{genre.name}</td>
                        <td>
                            <Button variant="warning" size="sm" onClick={() => handleShowEdit(genre)} className="me-2">
                                Редагувати
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(genre.id)}>
                                Видалити
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {/* Модальне вікно для додавання/редагування */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentGenre.id ? 'Редагувати жанр' : 'Додати жанр'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form>
                        <Form.Group>
                            <Form.Label>Назва жанру</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentGenre.name}
                                onChange={(e) => setCurrentGenre({...currentGenre, name: e.target.value})}
                            />
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
                    ✚ Додати новий жанр
                </Button>
            </div>
        </div>
    );
}

export default ManageGenres;