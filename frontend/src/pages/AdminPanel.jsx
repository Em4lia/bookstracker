import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import ManageBooks from '../components/admin/ManageBooks';
import ManageAuthors from '../components/admin/ManageAuthors';
import ManageGenres from '../components/admin/ManageGenres';
import ManageUsers from '../components/admin/ManageUsers';

function AdminPanel() {
    return (
        <>
            <div style={{textAlign: 'center'}}>
                <h2 className="mb-4">Панель Адміністратора ⚙️</h2>
            </div>
            <Tabs defaultActiveKey="books" id="admin-tabs" className="mb-3" fill>
            <Tab eventKey="books" title="Книги">
                    <ManageBooks />
                </Tab>
                <Tab eventKey="authors" title="Автори">
                    <ManageAuthors />
                </Tab>
                <Tab eventKey="genres" title="Жанри">
                    <ManageGenres />
                </Tab>
                <Tab eventKey="users" title="Користувачі">
                    <ManageUsers />
                </Tab>
            </Tabs>
        </>
    );
}

export default AdminPanel;