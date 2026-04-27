const bcrypt = require('bcryptjs');
const prisma = require('../../config/database');
const { signAccessToken, signRefreshToken, verifyRefreshToken, getRefreshExpiryDate } = require('../../config/jwt');
const AppError = require('../../utils/AppError');
const { BCRYPT_SALT_ROUNDS } = require('../../utils/constants');

const register = async ({ username, email, password, displayName }) => {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (existing) {
    if (existing.email === email) throw AppError.conflict('Email already in use');
    throw AppError.conflict('Username already taken');
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { username, email, passwordHash, displayName: displayName || username },
  });

  const { accessToken, refreshToken } = await _issueTokens(user.id);
  return { user, accessToken, refreshToken };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const { accessToken, refreshToken } = await _issueTokens(user.id);
  return { user, accessToken, refreshToken };
};

const refresh = async (token) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw AppError.unauthorized('Invalid or expired refresh token');
  }

  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.expiresAt < new Date()) {
    throw AppError.unauthorized('Refresh token revoked or expired');
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user) throw AppError.unauthorized('User not found');

  // Rotate refresh token
  await prisma.refreshToken.delete({ where: { token } });
  const { accessToken, refreshToken: newRefreshToken } = await _issueTokens(user.id);
  return { user, accessToken, refreshToken: newRefreshToken };
};

const logout = async (token) => {
  if (!token) return;
  await prisma.refreshToken.deleteMany({ where: { token } });
};

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: { select: { posts: true, followers: true, following: true } },
    },
  });
  if (!user) throw AppError.notFound('User not found');
  return user;
};

// ── Private ──────────────────────────────────────────────────────────────────

const { v4: uuidv4 } = require('uuid');

const _issueTokens = async (userId) => {
  const tokenId = uuidv4(); // 🔥 unique ID

  const accessToken = signAccessToken({ userId });

  const refreshToken = signRefreshToken({
    userId,
    tokenId, // 👈 IMPORTANT
  });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt: getRefreshExpiryDate(),
    },
  });

  return { accessToken, refreshToken };
};
module.exports = { register, login, refresh, logout, getMe };