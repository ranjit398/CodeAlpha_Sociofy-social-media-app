import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Avatar from '../ui/Avatar';
import Loader from '../ui/Loader';
import { fetchComments, addComment, deleteComment, selectComments } from '../../features/post/postSlice';

export default function CommentSection({ postId }) {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const comments = useSelector(selectComments(postId));
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Fetch comments on mount or when postId changes
  useEffect(() => {
    if (postId) {
      dispatch(fetchComments({ postId }));
    }
  }, [postId, dispatch]);

  const handleComment = useCallback(async (e) => {
    e.preventDefault();
    if (!commentText.trim() || commentLoading) return;
    
    setCommentLoading(true);
    try {
      const result = await dispatch(addComment({ postId, content: commentText.trim() }));
      
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Comment posted!');
        setCommentText('');
      } else {
        toast.error(result.payload || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Comment error:', error);
      toast.error('An error occurred while posting');
    } finally {
      setCommentLoading(false);
    }
  }, [dispatch, postId, commentText, commentLoading]);

  const handleDeleteComment = useCallback(async (commentId) => {
    try {
      const result = await dispatch(deleteComment({ postId, commentId }));
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Comment deleted');
      } else {
        toast.error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('An error occurred');
    }
  }, [dispatch, postId]);

  const isLoading = comments?.isLoading;
  const commentList = comments?.items || [];

  return (
    <div className="comments-section" role="region" aria-label="Comments">
      <div className="comments-list">
        {isLoading ? (
          <div className="loading-comments" aria-label="Loading comments">
            <Loader />
            <span>Loading comments...</span>
          </div>
        ) : commentList.length === 0 ? (
          <div className="no-comments" role="status">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          commentList.map(c => (
            <div className="comment-item" key={c.id} role="article" aria-label={`Comment by ${c.author?.displayName}`}>
              <Avatar user={c.author} size={28} />
              <div className="comment-body">
                <div className="comment-author">{c.author?.displayName}</div>
                <div className="comment-text">{c.content}</div>
                <div className="comment-meta">
                  {c.createdAt && (
                    <time dateTime={c.createdAt} aria-label={`Posted ${new Date(c.createdAt).toLocaleString()}`}>
                      {timeAgo(c.createdAt)}
                    </time>
                  )}
                </div>
              </div>
              {user?.id === c.author?.id && (
                <button
                  className="btn-delete-comment"
                  onClick={() => handleDeleteComment(c.id)}
                  aria-label={`Delete comment by ${c.author?.displayName}`}
                  title="Delete comment"
                >
                  ✕
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <form className="comment-input-row" onSubmit={handleComment} aria-label="Add a comment">
        <input
          className="comment-input"
          placeholder="Write a comment…"
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          maxLength={500}
          disabled={commentLoading}
          aria-label="Comment text input"
        />
        <button 
          className="btn-comment" 
          type="submit" 
          disabled={!commentText.trim() || commentLoading}
          aria-label={commentLoading ? 'Posting comment' : 'Post comment'}
        >
          {commentLoading ? <Loader /> : 'Post'}
        </button>
      </form>
    </div>
  );
}

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}
