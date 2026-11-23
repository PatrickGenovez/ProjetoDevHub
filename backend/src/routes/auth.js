const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const verifyToken = require('../middlewares/auth');

/**
 * Rotas de Autenticação e Sessão de Usuário (Clean Code)
 */
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', verifyToken, AuthController.me);
router.patch('/plan', verifyToken, AuthController.updatePlan);
router.post('/reset-password', AuthController.resetPassword);

module.exports = router;
