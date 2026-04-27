import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import MainLayout from '../../components/layout/MainLayout';
import CreatePost from '../../components/post/CreatePost';
import PostCard from '../../components/post/PostCard';
import Loader from '../../components/ui/Loader';
import RightPanel from '../../components/layout/RightPanel';
import { fetchGlobalFeed, fetchFollowingFeed, prependPost } from '../../features/feed/feedSlice';
import { upsertPost } from '../../features/post/postSlice';

export default function FeedPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('global');

  // Redux selectors
  const globalFeed = useSelector(s => s.feed.global);
  const followingFeed = useSelector(s => s.feed.following);
  const postEntities = useSelector(s => s.post.entities);

  const currentFeed = activeTab === 'global' ? globalFeed : followingFeed;
  const feedPosts = currentFeed.postIds
    .map(id => postEntities[id])
    .filter(Boolean);

  // Load initial feed
  useEffect(() => {
    const thunk = activeTab === 'global' ? fetchGlobalFeed : fetchFollowingFeed;
    
    if (!currentFeed.initialized) {
      dispatch(thunk());
    }
  }, [activeTab, dispatch, currentFeed.initialized]);

  const handlePost = useCallback((newPost) => {
    // Add to Redux state
    dispatch(upsertPost(newPost));
    dispatch(prependPost(newPost.id));
    toast.success('Post created!');
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    const thunk = activeTab === 'global' ? fetchGlobalFeed : fetchFollowingFeed;
    dispatch(thunk({ cursor: currentFeed.pagination?.nextCursor }));
  }, [dispatch, activeTab, currentFeed.pagination]);

  const handleNavigate = useCallback((target) => {
    navigate(target);
  }, [navigate]);

  const isLoading = currentFeed.isLoading;
  const isLoadingMore = currentFeed.isLoadingMore;
  const hasMore = currentFeed.pagination?.hasMore || false;
  const error = currentFeed.error;

  return (
    <MainLayout>
      <div className="main-content">
        <div className="feed-header">
          <div className="feed-tabs">
            <button
              className={`feed-tab ${activeTab === 'global' ? 'active' : ''}`}
              onClick={() => setActiveTab('global')}
              aria-label="Global feed"
              aria-pressed={activeTab === 'global'}
            >
              Global
            </button>
            <button
              className={`feed-tab ${activeTab === 'following' ? 'active' : ''}`}
              onClick={() => setActiveTab('following')}
              aria-label="Following feed"
              aria-pressed={activeTab === 'following'}
            >
              Following
            </button>
          </div>
        </div>

        {error && (
          <div className="error-banner" role="alert" aria-live="polite">
            <p>{error}</p>
            <button 
              onClick={() => dispatch(activeTab === 'global' ? fetchGlobalFeed() : fetchFollowingFeed())}
              className="btn-retry"
            >
              Retry
            </button>
          </div>
        )}

        <CreatePost onPost={handlePost} />

        {isLoading ? (
          <div className="loading-state" role="status" aria-live="polite" aria-label="Loading feed">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="skeleton-post">
                <div className="skeleton-header">
                  <div className="skeleton-avatar" />
                  <div className="skeleton-info">
                    <div className="skeleton-line" style={{ width: '100px' }} />
                    <div className="skeleton-line" style={{ width: '60px' }} />
                  </div>
                </div>
                <div className="skeleton-content">
                  <div className="skeleton-line" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line" style={{ width: '80%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : feedPosts.length === 0 ? (
          <div className="empty-state" role="status">
            <div className="empty-icon">✦</div>
            <div className="empty-title">Nothing here yet</div>
            <div className="empty-sub">
              {activeTab === 'following'
                ? 'Follow people to see their posts here.'
                : 'Be the first to post something.'}
            </div>
          </div>
        ) : (
          <>
            <div className="posts-container" role="feed" aria-label={`${activeTab} feed`}>
              {feedPosts.map((post, i) => (
                <div key={post.id} style={{ animationDelay: `${i * 0.06}s` }}>
                  <PostCard post={post} onNavigate={handleNavigate} />
                </div>
              ))}
            </div>

            {(hasMore || isLoadingMore) && (
              <div className="load-more-section" role="status" aria-live="polite">
                {isLoadingMore ? (
                  <div className="loading-more" aria-label="Loading more posts">
                    <Loader />
                    <span>Loading more posts...</span>
                  </div>
                ) : (
                  <button 
                    className="load-more-btn" 
                    onClick={handleLoadMore}
                    aria-label="Load more posts"
                  >
                    Load more
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <RightPanel />
    </MainLayout>
  );
}
