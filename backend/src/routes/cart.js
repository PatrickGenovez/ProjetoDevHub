const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const verifyToken = require('../middlewares/auth');

// Todas as rotas de sincronização de carrinho da conta exigem autenticação
router.use(verifyToken);

router.get('/', CartController.getCart);
router.put('/', CartController.saveCart);
router.post('/merge', CartController.mergeCart);
router.delete('/', CartController.clearCart);

module.exports = router;
