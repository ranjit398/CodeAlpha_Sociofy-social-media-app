const formatUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  displayName: user.displayName || user.username,
  avatarUrl: user.avatarUrl || null,
  bio: user.bio || null,
  createdAt: user.createdAt,
});

const formatAuthResponse = (user, accessToken, refreshToken) => ({
  user: formatUser(user),
  accessToken,
  refreshToken,
});

module.exports = { formatUser, formatAuthResponse };