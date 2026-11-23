const express = require('express');
const router = express.Router();
const CheckoutController = require('../controllers/checkoutController');

// Rotas de Cupons
router.post('/coupons/validate', CheckoutController.validateCoupon);
router.get('/coupons', CheckoutController.listCoupons);

// Rotas de Frete
router.post('/shipping/calculate', CheckoutController.calculateShipping);
router.get('/shipping/cep/:cep', CheckoutController.lookupCep);

module.exports = router;
