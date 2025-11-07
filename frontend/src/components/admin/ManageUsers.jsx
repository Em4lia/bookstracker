import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table, Button, Alert } from 'react-bootstrap';

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            setError('Не вдалося завантажити користувачів.');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleBlock = async (userId) => {
        try {
            await api.put(`/admin/users/${userId}/toggle-block`);
            // Оновлюємо стан локально для миттєвого відображення
            setUsers(users.map(user =>
                user.id === userId ? { ...user, is_blocked: !user.is_blocked } : user
            ));
        } catch (err) {
            alert('Помилка зміни статусу блокування.');
        }
    };

    return (
        <div>
            {error && <Alert variant="danger">{error}</Alert>}
            <Table striped bordered hover responsive className="text-center align-middle">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Ім'я</th>
                    <th>Прізвище</th>
                    <th>Логін</th>
                    <th>Роль</th>
                    <th>Статус</th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.surname}</td>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                        <td>
                            {user.is_blocked ?
                                <span className="text-danger">Заблоковано</span> :
                                <span className="text-success">Активний</span>
                            }
                        </td>
                        <td>
                            <Button
                                variant={user.is_blocked ? 'success' : 'danger'}
                                size="sm"
                                onClick={() => handleToggleBlock(user.id)}
                            >
                                {user.is_blocked ? 'Розблокувати' : 'Заблокувати'}
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}

export default ManageUsers;