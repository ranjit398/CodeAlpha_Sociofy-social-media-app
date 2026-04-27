const formatComment = (comment) => ({
  id: comment.id,
  content: comment.content,
  createdAt: comment.createdAt,
  author: comment.author
    ? {
        id: comment.author.id,
        username: comment.author.username,
        displayName: comment.author.displayName || comment.author.username,
        avatarUrl: comment.author.avatarUrl || null,
      }
    : null,
});

const formatCommentList = (comments) => comments.map(formatComment);

module.exports = { formatComment, formatCommentList };