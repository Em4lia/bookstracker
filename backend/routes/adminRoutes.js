// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

// Всі маршрути тут вимагають прав адміністратора
router.use(verifyToken, isAdmin);

router.get('/users', adminController.getAllUsers);
router.put('/users/:userId/toggle-block', adminController.toggleUserBlock);
router.delete('/reviews/:bookId/:userId', adminController.deleteReview);

module.exports = router;