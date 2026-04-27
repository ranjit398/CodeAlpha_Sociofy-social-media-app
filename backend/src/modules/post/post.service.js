const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { cacheGet, cacheSet, cacheDel, cacheDelPattern, CacheKeys, CACHE_TTL } = require('../../utils/cache');

const POST_INCLUDE = (currentUserId) => ({
  author: { select: { id: true, username: true, displayName: true, avatarUrl: true, isPrivate: true } },
  _count: { select: { likes: true, comments: true } },
  ...(currentUserId && {
    likes: { where: { userId: currentUserId }, select: { userId: true } },
  }),
});

const createPost = async (authorId, content, imageUrl = null, videoUrl = null) => {
  const post = await prisma.post.create({
    data: { content, imageUrl, videoUrl, authorId },
    include: POST_INCLUDE(authorId),
  });

  await cacheDelPattern('feed:global:*');
  await cacheDelPattern(`feed:user:${authorId}:*`);

  return post;
};

const getPostById = async (postId, currentUserId = null) => {
  const cacheKey = CacheKeys.post(postId);

  const cached = await cacheGet(cacheKey);
  if (cached && !currentUserId) return cached;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: POST_INCLUDE(currentUserId),
  });

  if (!post) throw AppError.notFound('Post not found');

  // Check private account visibility
  if (post.author.isPrivate && currentUserId && currentUserId !== post.author.id) {
    const isFollowing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: currentUserId, followingId: post.author.id } },
    });
    if (!isFollowing) throw AppError.forbidden('This account is private');
  }

  if (!currentUserId) {
    await cacheSet(cacheKey, post, CACHE_TTL.POST);
  }

  return post;
};

const updatePost = async (postId, userId, content) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw AppError.notFound('Post not found');
  if (post.authorId !== userId) throw AppError.forbidden('Not your post');

  const updated = await prisma.post.update({
    where: { id: postId },
    data: { content },
    include: POST_INCLUDE(userId),
  });

  await cacheDel(CacheKeys.post(postId));
  await cacheDelPattern('feed:global:*');
  await cacheDelPattern(`feed:user:${userId}:*`);

  return updated;
};

const deletePost = async (postId, userId) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw AppError.notFound('Post not found');
  if (post.authorId !== userId) throw AppError.forbidden('Not your post');

  await prisma.post.delete({ where: { id: postId } });

  await cacheDel(CacheKeys.post(postId));
  await cacheDelPattern('feed:global:*');
  await cacheDelPattern(`feed:user:${userId}:*`);
};

const likePost = async (postId, userId) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw AppError.notFound('Post not found');

  await prisma.like.create({ data: { postId, userId } }).catch(() => {
    throw AppError.conflict('Already liked');
  });

  await cacheDel(CacheKeys.post(postId));
  await cacheDelPattern('feed:global:*');
  await cacheDelPattern(`feed:user:*`);
};

const unlikePost = async (postId, userId) => {
  const like = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });
  if (!like) throw AppError.notFound('Like not found');

  await prisma.like.delete({ where: { userId_postId: { userId, postId } } });

  await cacheDel(CacheKeys.post(postId));
  await cacheDelPattern('feed:global:*');
  await cacheDelPattern(`feed:user:*`);
};

module.exports = { createPost, getPostById, updatePost, deletePost, likePost, unlikePost };