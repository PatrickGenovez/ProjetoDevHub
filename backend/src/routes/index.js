const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const bookRoutes = require('./books');
const cartRoutes = require('./cart');
const checkoutRoutes = require('./checkout');
const sprintsPdfRoutes = require('./sprintsPdf');
const tenantRoutes = require('./tenants');

const tenantMiddleware = require('../middlewares/tenantMiddleware');

// Middleware global de resolução e injeção do tenant ativo
router.use(tenantMiddleware);

// Registro modular de rotas da aplicação
router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/cart', cartRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/coupons', (req, res, next) => {
  req.url = '/coupons' + req.url;
  checkoutRoutes(req, res, next);
});
router.use('/shipping', (req, res, next) => {
  req.url = '/shipping' + req.url;
  checkoutRoutes(req, res, next);
});
router.use('/sprints-pdf', sprintsPdfRoutes);
router.use('/tenants', tenantRoutes);

// Health check da API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bibliotech API em execução!',
    version: '1.0.0',
    tenant: req.tenant ? req.tenant.name : 'Padrão'
  });
});

module.exports = router;
