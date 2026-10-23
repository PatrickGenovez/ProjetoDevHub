const express = require('express');
const router = express.Router();
const TenantController = require('../controllers/tenantController');

/**
 * Rotas de Gestão Multi-Tenant / Franquias (Clean Code)
 */
router.get('/', TenantController.list);
router.post('/', TenantController.provision);

module.exports = router;
