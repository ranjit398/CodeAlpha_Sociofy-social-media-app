// Data Transfer Object for Feed responses
const formatFeed = (posts, pagination, userId) => {
  return {
    posts: posts.map(post => ({
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      videoUrl: post.videoUrl,
      likesCount: post.likesCount || post._count?.likes || 0,
      commentsCount: post.commentsCount || post._count?.comments || 0,
      isLiked: post.isLiked !== undefined ? post.isLiked : (post.likes?.length > 0 ? true : false),
      createdAt: post.createdAt,
      author: {
        id: post.author?.id,
        username: post.author?.username,
        displayName: post.author?.displayName,
        avatarUrl: post.author?.avatarUrl,
        isPrivate: post.author?.isPrivate,
      },
    })),
    pagination: pagination || { hasMore: false, nextCursor: null },
  };
};

module.exports = { formatFeed };