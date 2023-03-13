const { authService } = require('../services/auth.service');

const { REFRESH_TOKEN_LIFETIME } = process.env;

class AuthController {
  async signIn(req, res, next) {
    try {
      const { id, password } = req.body;
      const tokens = await authService.signIn({ id, password });
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        maxAge: +REFRESH_TOKEN_LIFETIME.slice(0, -1) * 24 * 60 * 60 * 1000,
      });
      res.json(tokens);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const tokens = await authService.refresh(refreshToken);
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        maxAge: +REFRESH_TOKEN_LIFETIME.slice(0, -1) * 24 * 60 * 60 * 1000,
      });
      res.json(tokens);
    } catch (error) {
      next(error);
    }
  }

  async signUp(req, res, next) {
    try {
      const { id, password } = req.body;
      const tokens = await authService.signUp({ id, password });
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        maxAge: +REFRESH_TOKEN_LIFETIME.slice(0, -1) * 24 * 60 * 60 * 1000,
      });
      res.json(tokens);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      await authService.logout(refreshToken);
      res.clearCookie('refreshToken');
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async info(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userId = authService.getUserId(refreshToken);
      res.json({ userId });
    } catch (error) {
      next(error);
    }
  }
}

exports.authController = new AuthController();
