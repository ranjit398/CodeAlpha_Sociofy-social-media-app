const formatPost = (post, currentUserId = null) => ({
  id: post.id,
  content: post.content,
  imageUrl: post.imageUrl || null,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  author: post.author
    ? {
        id: post.author.id,
        username: post.author.username,
        displayName: post.author.displayName || post.author.username,
        avatarUrl: post.author.avatarUrl || null,
      }
    : null,
  likesCount: post._count?.likes ?? 0,
  commentsCount: post._count?.comments ?? 0,
  isLiked: currentUserId
    ? post.likes?.some((l) => l.userId === currentUserId) ?? false
    : false,
});

const formatPostList = (posts, currentUserId = null) =>
  posts.map((p) => formatPost(p, currentUserId));

module.exports = { formatPost, formatPostList };