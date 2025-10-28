const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

router.get('/', authorController.getAllAuthors);

// Адмінські маршрути
router.post('/', verifyToken, isAdmin, authorController.addAuthor);
router.put('/:id', verifyToken, isAdmin, authorController.updateAuthor);
router.delete('/:id', verifyToken, isAdmin, authorController.deleteAuthor);

module.exports = router;