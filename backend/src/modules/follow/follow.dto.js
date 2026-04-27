const formatFollow = (follow) => ({
  id: follow.id,
  createdAt: follow.createdAt,
  user: follow.following || follow.follower
    ? {
        id: (follow.following || follow.follower).id,
        username: (follow.following || follow.follower).username,
        displayName: (follow.following || follow.follower).displayName,
        avatarUrl: (follow.following || follow.follower).avatarUrl || null,
      }
    : null,
});

module.exports = { formatFollow };