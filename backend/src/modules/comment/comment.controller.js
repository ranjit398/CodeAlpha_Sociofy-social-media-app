const commentService = require('./comment.service');
const { formatComment, formatCommentList } = require('./comment.dto');

const addComment = async (req, res, next) => {
  try {
    const comment = await commentService.addComment(req.params.id, req.user.id, req.body.content);
    res.status(201).json({ success: true, data: { comment: formatComment(comment) }, message: 'Comment added' });
  } catch (err) {
    next(err);
  }
};

const getComments = async (req, res, next) => {
  try {
    const result = await commentService.getComments(req.params.id, req.query);
    res.json({ success: true, data: { comments: formatCommentList(result.items), pagination: result.pagination } });
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    await commentService.deleteComment(req.params.id, req.params.commentId, req.user.id);
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { addComment, getComments, deleteComment };