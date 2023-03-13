const jwt = require('jsonwebtoken');
const { prisma } = require('./prisma.service');

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_LIFETIME,
} = process.env;

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
      expiresIn: ACCESS_TOKEN_LIFETIME,
    });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_LIFETIME,
    });
    return { accessToken, refreshToken };
  }

  generateAccessToken(payload) {
    return jwt.sign(payload, JWT_ACCESS_SECRET, {
      expiresIn: ACCESS_TOKEN_LIFETIME,
    });
  }

  async saveToken(userId, token) {
    const tokenData = await prisma.token.upsert({
      where: { userId },
      update: { refreshToken: token },
      create: { refreshToken: token, userId },
    });
    return tokenData;
  }

  async deleteToken(refreshToken) {
    await prisma.token.delete({ where: { refreshToken } });
  }

  verifyRefreshToken(refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      return payload;
    } catch (error) {
      return null;
    }
  }

  verifyAccessToken(accessToken) {
    try {
      const payload = jwt.verify(accessToken, JWT_ACCESS_SECRET);
      return payload;
    } catch (error) {
      return null;
    }
  }

  async findRefreshToken(refreshToken) {
    const existsToken = await prisma.token.findFirst({
      where: { refreshToken },
    });
    return existsToken;
  }

  getUserId(refreshToken) {
    const { userId } = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    return userId;
  }
}

exports.tokenService = new TokenService();
