const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { cacheDel, cacheDelPattern, CacheKeys, CACHE_TTL } = require('../../utils/cache');

const followUser = async (followerId, targetUsername) => {
  const target = await prisma.user.findUnique({ where: { username: targetUsername } });
  if (!target) throw AppError.notFound('User not found');
  if (target.id === followerId) throw AppError.badRequest('Cannot follow yourself');

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId: target.id } },
  });
  if (existing) throw AppError.conflict('Already following this user');

  const follow = await prisma.follow.create({
    data: { followerId, followingId: target.id },
    include: {
      following: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
    },
  });

  // Invalidate caches
  await Promise.all([
    cacheDel(CacheKeys.userFollowers(target.id)),
    cacheDel(CacheKeys.userFollowing(followerId)),
    cacheDel(CacheKeys.userProfile(targetUsername)),
    cacheDelPattern(`feed:user:${followerId}:*`),
  ]);

  return follow;
};

const unfollowUser = async (followerId, targetUsername) => {
  const target = await prisma.user.findUnique({ where: { username: targetUsername } });
  if (!target) throw AppError.notFound('User not found');

  const follow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId: target.id } },
  });
  if (!follow) throw AppError.notFound('Not following this user');

  await prisma.follow.delete({
    where: { followerId_followingId: { followerId, followingId: target.id } },
  });

  await Promise.all([
    cacheDel(CacheKeys.userFollowers(target.id)),
    cacheDel(CacheKeys.userFollowing(followerId)),
    cacheDel(CacheKeys.userProfile(targetUsername)),
    cacheDelPattern(`feed:user:${followerId}:*`),
  ]);
};

module.exports = { followUser, unfollowUser };