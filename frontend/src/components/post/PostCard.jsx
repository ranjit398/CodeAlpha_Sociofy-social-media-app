import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import CommentSection from './CommentSection';
import { likePost, unlikePost, optimisticLike, optimisticUnlike } from '../../features/post/postSlice';
import { selectCurrentUser } from '../../features/auth/authSlice';

const HeartIcon = ({ filled }) => filled
  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--red)" stroke="var(--red)" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;

const CommentIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;

const ShareIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function PostCard({ post, onNavigate }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const [showComments, setShowComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // Read post from Redux entities so like updates are reactive
  const livePost = useSelector(s => s.post.entities[post?.id]) || post;

  const handleLike = useCallback(async () => {
    if (likeLoading || !currentUser) return;
    setLikeLoading(true);

    // Optimistic update immediately
    if (livePost.isLiked) {
      dispatch(optimisticUnlike(livePost.id));
    } else {
      dispatch(optimisticLike(livePost.id));
    }

    try {
      const action = livePost.isLiked ? unlikePost : likePost;
      const result = await dispatch(action(livePost.id));
      if (result.meta.requestStatus === 'rejected') {
        // Roll back optimistic update
        if (livePost.isLiked) {
          dispatch(optimisticLike(livePost.id));
        } else {
          dispatch(optimisticUnlike(livePost.id));
        }
        toast.error('Failed to update like');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setLikeLoading(false);
    }
  }, [dispatch, livePost, likeLoading, currentUser]);

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/post/${livePost.id}`;
    if (navigator.share) {
      navigator.share({ title: 'Sociofy Post', url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  }, [livePost.id]);

  const goToProfile = useCallback(() => {
    const path = `/profile/${livePost.author?.username}`;
    if (onNavigate) onNavigate(path);
    else navigate(path);
  }, [livePost.author?.username, navigate, onNavigate]);

  return (
    <div className="post-card" role="article" aria-label={`Post by ${livePost.author?.displayName}`}>
      <div className="post-header">
        <div
          className="post-author"
          onClick={goToProfile}
          role="button"
          tabIndex={0}
          aria-label={`View profile of ${livePost.author?.displayName}`}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToProfile(); } }}
        >
          <Avatar user={livePost.author} size={40} />
          <div className="post-author-info">
            <div className="post-author-name">{livePost.author?.displayName}</div>
            <div className="post-author-handle">@{livePost.author?.username}</div>
          </div>
        </div>
        <span className="post-time">{livePost.createdAt ? timeAgo(livePost.createdAt) : 'now'}</span>
      </div>

      <p className="post-content">{livePost.content}</p>

      {livePost.imageUrl && (
        <div className="post-image">
          <img src={livePost.imageUrl} alt="Post content" loading="lazy" />
        </div>
      )}

      {livePost.videoUrl && (
        <div className="post-image">
          <video
            src={livePost.videoUrl}
            controls
            playsInline
            style={{ width: '100%', borderRadius: 12, maxHeight: 400, background: '#000' }}
          />
        </div>
      )}

      <div className="post-actions">
        <button
          className={`action-btn ${livePost.isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={likeLoading}
          aria-label={livePost.isLiked ? `Unlike (${livePost.likesCount || 0})` : `Like (${livePost.likesCount || 0})`}
          aria-pressed={livePost.isLiked}
          title={livePost.isLiked ? 'Unlike' : 'Like'}
        >
          <HeartIcon filled={livePost.isLiked} />
          <span>{livePost.likesCount || 0}</span>
        </button>

        <button
          className="action-btn"
          onClick={() => setShowComments(s => !s)}
          aria-label={`Comments (${livePost.commentsCount || 0})`}
          title="Comments"
        >
          <CommentIcon />
          <span>{livePost.commentsCount || 0}</span>
        </button>

        <button
          className="action-btn"
          onClick={handleShare}
          aria-label="Share post"
          title="Share"
        >
          <ShareIcon />
          <span>Share</span>
        </button>
      </div>

      {showComments && <CommentSection postId={livePost.id} />}
    </div>
  );
}
