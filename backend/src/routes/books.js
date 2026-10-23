const express = require('express');
const router = express.Router();
const BookController = require('../controllers/bookController');

/**
 * Rotas de Livros e Catálogo (Clean Code / Single Responsibility)
 */
router.get('/', BookController.getAll);
router.post('/', BookController.create);
router.patch('/:id/toggle-status', BookController.toggleStatus);
router.delete('/:id', BookController.delete);

module.exports = router;
