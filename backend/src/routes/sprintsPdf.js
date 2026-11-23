const express = require('express');
const router = express.Router();
const SprintPdfController = require('../controllers/sprintPdfController');

/**
 * Rota de Geração e Consulta do PDF do Plano de Sprints (Clean Code)
 */
router.get('/', SprintPdfController.handlePdf);

module.exports = router;
