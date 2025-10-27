// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

// --- Публічні маршрути ---
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.get('/:id/reviews', bookController.getBookReviews);

// --- Захищені маршрути для користувача ---
router.get('/my/list', verifyToken, bookController.getUserBooks); // Змінив шлях для уникнення конфліктів
router.post('/my/list', verifyToken, bookController.manageUserBook);
router.delete('/my/list/:bookId', verifyToken, bookController.deleteUserBookInteraction);

// --- Захищені маршрути тільки для адміністратора ---
router.post('/', verifyToken, isAdmin, bookController.addBook);
router.put('/:id', verifyToken, isAdmin, bookController.updateBook);
router.delete('/:id', verifyToken, isAdmin, bookController.deleteBook);

module.exports = router;