const formatUser = (user, currentUserId = null) => ({
  id: user.id,
  username: user.username,
  displayName: user.displayName || user.username,
  bio: user.bio || null,
  avatarUrl: user.avatarUrl || null,
  createdAt: user.createdAt,
  followersCount: user._count?.followers ?? undefined,
  followingCount: user._count?.following ?? undefined,
  postsCount: user._count?.posts ?? undefined,
  isFollowing: currentUserId
    ? user.followers?.some((f) => f.followerId === currentUserId) ?? false
    : undefined,
});

const formatUserList = (users, currentUserId = null) =>
  users.map((u) => formatUser(u, currentUserId));

module.exports = { formatUser, formatUserList };