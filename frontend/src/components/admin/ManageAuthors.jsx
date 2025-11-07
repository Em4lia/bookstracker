import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';

function ManageAuthors() {
    const [authors, setAuthors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentAuthor, setCurrentAuthor] = useState({ id: null, name: '' });
    const [error, setError] = useState('');

    const fetchAuthors = async () => {
        const res = await api.get('/authors');
        setAuthors(res.data);
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    const handleClose = () => {
        setShowModal(false);
        setCurrentAuthor({ id: null, name: '' });
        setError('');
    };

    const handleShowAdd = () => {
        setCurrentAuthor({ id: null, name: '' });
        setShowModal(true);
    };

    const handleShowEdit = (author) => {
        setCurrentAuthor(author);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Ви впевнені, що хочете видалити цього автора?')) {
            try {
                await api.delete(`/authors/${id}`);
                fetchAuthors();
            } catch (err) {
                alert('Помилка видалення автора. Можливо, до нього прив\'язані книги.');
            }
        }
    };

    const handleSave = async () => {
        if (!currentAuthor.name) {
            setError('Ім\'я не може бути порожнім.');
            return;
        }
        try {
            if (currentAuthor.id) {
                await api.put(`/authors/${currentAuthor.id}`, { name: currentAuthor.name });
            } else {
                await api.post('/authors', { name: currentAuthor.name });
            }
            fetchAuthors();
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
                    <th>Ім'я</th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                {authors.map(author => (
                    <tr key={author.id}>
                        <td>{author.id}</td>
                        <td>{author.name}</td>
                        <td>
                            <Button variant="warning" size="sm" onClick={() => handleShowEdit(author)} className="me-2">
                                Редагувати
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(author.id)}>
                                Видалити
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentAuthor.id ? 'Редагувати автора' : 'Додати автора'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form>
                        <Form.Group>
                            <Form.Label>Ім'я автора</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentAuthor.name}
                                onChange={(e) => setCurrentAuthor({...currentAuthor, name: e.target.value})}
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
                    ✚ Додати нового автора
                </Button>
            </div>
        </div>
    );
}

export default ManageAuthors;