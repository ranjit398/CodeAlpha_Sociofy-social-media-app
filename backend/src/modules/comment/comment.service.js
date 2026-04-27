const prisma = require('../../config/database');
const AppError = require('../../utils/AppError');
const { parsePagination, buildPaginatedResponse } = require('../../utils/pagination');
const { cacheDel, CacheKeys } = require('../../utils/cache');

const AUTHOR_SELECT = {
  select: { id: true, username: true, displayName: true, avatarUrl: true },
};

const addComment = async (postId, authorId, content) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw AppError.notFound('Post not found');

  const comment = await prisma.comment.create({
    data: { content, postId, authorId },
    include: { author: AUTHOR_SELECT },
  });

  await cacheDel(CacheKeys.post(postId));
  return comment;
};

const getComments = async (postId, query) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw AppError.notFound('Post not found');

  const { cursor, limit } = parsePagination(query);

  const comments = await prisma.comment.findMany({
    where: { postId },
    include: { author: AUTHOR_SELECT },
    take: limit + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: { createdAt: 'asc' },
  });

  return buildPaginatedResponse(comments, limit, (c) => c.id);
};

const deleteComment = async (postId, commentId, userId) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { post: { select: { authorId: true } } },
  });

  if (!comment || comment.postId !== postId) throw AppError.notFound('Comment not found');

  const isOwner = comment.authorId === userId;
  const isPostOwner = comment.post.authorId === userId;

  if (!isOwner && !isPostOwner) throw AppError.forbidden('Not authorized');

  await prisma.comment.delete({ where: { id: commentId } });
  await cacheDel(CacheKeys.post(postId));
};

module.exports = { addComment, getComments, deleteComment };