const { Unauthorized } = require('http-errors');
const { authService } = require('../services/auth.service');
const { tokenService } = require('../services/token.service');

const { REFRESH_TOKEN_LIFETIME } = process.env;

module.exports = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw Unauthorized('Авторизация не пройдена');

    const validRefreshToken = tokenService.verifyRefreshToken(refreshToken);
    if (!validRefreshToken) throw Unauthorized('Авторизация не пройдена');

    const authorizationHeader = req.get('authorization');
    const accessToken = authorizationHeader?.split(' ')[1];

    // Автопродление access токена, но на фронт его не отправляю,
    // т.к. по идее фронт сам должен запрашивать новый access токен.
    // В данной реализации access токен бессмысленен.
    if (!accessToken) {
      const tokens = await authService.refresh(refreshToken);
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        maxAge: +REFRESH_TOKEN_LIFETIME.slice(0, -1) * 24 * 60 * 60 * 1000,
      });
      req.tokens = tokens;
      return next();
    }

    req.tokens = { accessToken, refreshToken };
    next();
  } catch (error) {
    next(error);
  }
};
