const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { cacheGet, cacheSet, cacheDel, cacheDelPattern, CacheKeys, CACHE_TTL } = require('../../utils/cache');
const { parsePagination, buildPaginatedResponse } = require('../../utils/pagination');

const USER_SELECT = {
  id: true,
  username: true,
  displayName: true,
  bio: true,
  avatarUrl: true,
  isPrivate: true,
  createdAt: true,
  _count: { select: { posts: true, followers: true, following: true } },
};

const searchUsers = async (q, limit = 10) => {
  return prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: q, mode: 'insensitive' } },
        { displayName: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: USER_SELECT,
    take: limit,
  });
};

const getUserProfile = async (username, currentUserId = null) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      ...USER_SELECT,
      followers: currentUserId
        ? { where: { followerId: currentUserId }, select: { followerId: true } }
        : false,
    },
  });

  if (!user) throw AppError.notFound('User not found');
  return user;
};

const updateProfile = async (userId, updates) => {
  // Only allow safe fields
  const allowed = {};
  if (updates.displayName !== undefined) allowed.displayName = updates.displayName;
  if (updates.bio !== undefined) allowed.bio = updates.bio;
  if (updates.isPrivate !== undefined) allowed.isPrivate = Boolean(updates.isPrivate);

  const user = await prisma.user.update({
    where: { id: userId },
    data: allowed,
    select: USER_SELECT,
  });

  await cacheDel(CacheKeys.userProfile(user.username));
  return user;
};

const updateAvatar = async (userId, avatarUrl) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl },
    select: USER_SELECT,
  });
  await cacheDel(CacheKeys.userProfile(user.username));
  return user;
};

const getFollowers = async (username, query) => {
  const user = await _requireUser(username);
  const { cursor, limit } = parsePagination(query);

  const followers = await prisma.follow.findMany({
    where: { followingId: user.id },
    include: { follower: { select: USER_SELECT } },
    take: limit + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: { createdAt: 'desc' },
  });

  return buildPaginatedResponse(
    followers.map((f) => f.follower),
    limit,
    (item) => item.id
  );
};

const getFollowing = async (username, query) => {
  const user = await _requireUser(username);
  const { cursor, limit } = parsePagination(query);

  const following = await prisma.follow.findMany({
    where: { followerId: user.id },
    include: { following: { select: USER_SELECT } },
    take: limit + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: { createdAt: 'desc' },
  });

  return buildPaginatedResponse(
    following.map((f) => f.following),
    limit,
    (item) => item.id
  );
};

const getUserPosts = async (username, query, currentUserId = null) => {
  const user = await _requireUser(username);
  const { cursor, limit } = parsePagination(query);

  // Private account: only show posts to self or followers
  if (user.isPrivate && currentUserId !== user.id) {
    if (currentUserId) {
      const isFollowing = await prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: currentUserId, followingId: user.id } },
      });
      if (!isFollowing) return { items: [], pagination: { hasMore: false }, isPrivate: true };
    } else {
      return { items: [], pagination: { hasMore: false }, isPrivate: true };
    }
  }

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    include: {
      author: { select: { id: true, username: true, displayName: true, avatarUrl: true, isPrivate: true } },
      _count: { select: { likes: true, comments: true } },
      likes: currentUserId
        ? { where: { userId: currentUserId }, select: { userId: true } }
        : false,
    },
    take: limit + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: { createdAt: 'desc' },
  });

  return buildPaginatedResponse(posts, limit, (p) => p.id);
};

const getSuggestedUsers = async (currentUserId, limit = 10) => {
  // Get users the current user already follows
  const following = await prisma.follow.findMany({
    where: { followerId: currentUserId },
    select: { followingId: true },
  });
  const followingIds = following.map(f => f.followingId);
  const excludeIds = [...followingIds, currentUserId];

  return prisma.user.findMany({
    where: { id: { notIn: excludeIds } },
    select: USER_SELECT,
    take: limit,
    orderBy: { followers: { _count: 'desc' } },
  });
};

// ── Private ───────────────────────────────────────────────────────────────────

const _requireUser = async (username) => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw AppError.notFound('User not found');
  return user;
};

module.exports = {
  searchUsers,
  getUserProfile,
  updateProfile,
  updateAvatar,
  getFollowers,
  getFollowing,
  getUserPosts,
  getSuggestedUsers,
};