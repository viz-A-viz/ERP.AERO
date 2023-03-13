const { Router } = require('express');
const { authController } = require('../controllers/auth.controller');
const verifyTokensMiddleware = require('../middlewares/verify-tokens.middleware');

const authRoute = Router();

authRoute
  .post('/signin', authController.signIn)
  .post('/signin/new_token', authController.refresh)
  .post('/signup', authController.signUp)
  .get('/info', verifyTokensMiddleware, authController.info)
  .get('/logout', verifyTokensMiddleware, authController.logout);

module.exports = { authRoute };
