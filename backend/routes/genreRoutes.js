// routes/genreRoutes.js
const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

router.get('/', genreController.getAllGenres);
router.post('/', verifyToken, isAdmin, genreController.addGenre);
router.put('/:id', verifyToken, isAdmin, genreController.updateGenre);
router.delete('/:id', verifyToken, isAdmin, genreController.deleteGenre);

module.exports = router;