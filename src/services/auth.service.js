const bcrypt = require('bcrypt');
const { BadRequest, NotFound, Unauthorized } = require('http-errors');
const { prisma } = require('./prisma.service');
const { tokenService } = require('./token.service');

class AuthService {
  async signIn({ id, password }) {
    const user = await prisma.user.findFirst({ where: { id } });
    if (!user)
      throw NotFound(
        'Пользователя с таким email или номером телефона не существует'
      );

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw BadRequest('Указан неверный пароль');

    const tokens = tokenService.generateTokens({ userId: id });
    await tokenService.saveToken(id, tokens.refreshToken);

    return tokens;
  }

  async refresh(refreshToken) {
    const userData = tokenService.verifyRefreshToken(refreshToken);
    const existsToken = await tokenService.findRefreshToken(refreshToken);
    if (!userData || !existsToken) throw Unauthorized('Неверный токен');

    const tokens = tokenService.generateTokens({ userId: userData.userId });
    await tokenService.saveToken(userData.userId, tokens.refreshToken);

    return tokens;
  }

  async signUp({ id, password }) {
    const candidate = await prisma.user.findFirst({ where: { id } });
    if (candidate)
      throw BadRequest(
        'Пользователь с такой почтой или номером телефона уже зарегистрирован'
      );
    const hashPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { id, password: hashPassword },
    });

    const tokens = tokenService.generateTokens({ userId: id });
    await tokenService.saveToken(id, tokens.refreshToken);

    return tokens;
  }

  async logout(refreshToken) {
    await tokenService.deleteToken(refreshToken);
  }

  getUserId(refreshToken) {
    return tokenService.getUserId(refreshToken);
  }
}

exports.authService = new AuthService();
