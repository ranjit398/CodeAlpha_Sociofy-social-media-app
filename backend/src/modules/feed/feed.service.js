const prisma = require('../../config/database');
const { cacheGet, cacheSet, CacheKeys, CACHE_TTL } = require('../../utils/cache');

const POST_INCLUDE = (requestingUserId) => ({
  author: {
    select: { id: true, username: true, displayName: true, avatarUrl: true, isPrivate: true },
  },
  _count: { select: { likes: true, comments: true } },
  ...(requestingUserId && {
    likes: { where: { userId: requestingUserId }, select: { id: true }, take: 1 },
  }),
});

function formatPost(post, requestingUserId) {
  const { likes, _count, ...rest } = post;
  return {
    ...rest,
    likesCount: _count.likes,
    commentsCount: _count.comments,
    isLiked: requestingUserId ? (likes?.length > 0) : false,
  };
}

async function getGlobalFeed(requestingUserId, page = 1, limit = 15) {
  // Only cache for unauthenticated requests
  if (!requestingUserId) {
    const cacheKey = `feed:global:${page}:${limit}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;
  }

  const skip = (page - 1) * limit;

  // Get IDs of users the requester follows (to allow private posts through)
  let followingIds = new Set();
  if (requestingUserId) {
    const follows = await prisma.follow.findMany({
      where: { followerId: requestingUserId },
      select: { followingId: true },
    });
    followingIds = new Set(follows.map(f => f.followingId));
  }

  const [allPosts, total] = await Promise.all([
    prisma.post.findMany({
      include: POST_INCLUDE(requestingUserId),
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit * 2, // fetch more to account for private filtering
    }),
    prisma.post.count(),
  ]);

  // Filter out posts from private accounts the user doesn't follow
  const posts = allPosts.filter(post => {
    if (!post.author.isPrivate) return true;
    if (!requestingUserId) return false;
    if (post.author.id === requestingUserId) return true; // own posts always visible
    return followingIds.has(post.author.id);
  }).slice(0, limit);

  const result = {
    posts: posts.map((p) => formatPost(p, requestingUserId)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + posts.length < total,
    },
  };

  if (!requestingUserId) {
    await cacheSet(`feed:global:${page}:${limit}`, result, CACHE_TTL.FEED);
  }

  return result;
}

async function getPersonalizedFeed(userId, page = 1, limit = 15) {
  // Do NOT cache following feed — it must always be fresh
  const followingIds = await prisma.follow
    .findMany({
      where: { followerId: userId },
      select: { followingId: true },
    })
    .then((follows) => follows.map((f) => f.followingId));

  if (followingIds.length === 0) {
    return {
      posts: [],
      pagination: { page, limit, total: 0, totalPages: 0, hasMore: false },
    };
  }

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { authorId: { in: followingIds } },
      include: POST_INCLUDE(userId),
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.post.count({ where: { authorId: { in: followingIds } } }),
  ]);

  return {
    posts: posts.map((p) => formatPost(p, userId)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + posts.length < total,
    },
  };
}

module.exports = { getGlobalFeed, getPersonalizedFeed };