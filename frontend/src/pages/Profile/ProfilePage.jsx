import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, selectProfile, followUser, unfollowUser } from '../../features/user/userSlice';
import { upsertPost } from '../../features/post/postSlice';
import { userApi } from '../../api/user.api';
import PostCard from '../../components/post/PostCard';
import Avatar from '../../components/ui/Avatar';
import MainLayout from '../../components/layout/MainLayout';
import RightPanel from '../../components/layout/RightPanel';
import EditProfileModal from '../../components/user/EditProfileModal';
import FollowListModal from '../../components/user/FollowListModal';

// ─── Skeleton loader ──────────────────────────────────────────────────────────
const SkeletonProfile = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div className="skeleton-post">
      <div className="skeleton-header">
        <div className="skeleton-avatar" style={{ width: 80, height: 80 }} />
        <div className="skeleton-info">
          <div className="skeleton-line" style={{ width: '40%' }} />
          <div className="skeleton-line" style={{ width: '25%' }} />
          <div className="skeleton-line" style={{ width: '60%', marginTop: 8 }} />
        </div>
      </div>
    </div>
    {[1, 2].map((i) => (
      <div key={i} className="skeleton-post">
        <div className="skeleton-header">
          <div className="skeleton-avatar" />
          <div className="skeleton-info">
            <div className="skeleton-line" style={{ width: '30%' }} />
            <div className="skeleton-line" style={{ width: '20%' }} />
          </div>
        </div>
        <div className="skeleton-content">
          <div className="skeleton-line" />
          <div className="skeleton-line" style={{ width: '80%' }} />
        </div>
      </div>
    ))}
  </div>
);

// ─── Stat item ────────────────────────────────────────────────────────────────
const StatItem = ({ label, value, onClick }) => {
  const fmt = (n) => {
    if (!n && n !== 0) return '0';
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
  };
  return (
    <button 
      className="profile-stat-btn"
      onClick={onClick}
      disabled={!onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        padding: '8px 12px',
        borderRadius: '12px',
        background: 'transparent !important',
        border: 'none !important',
        boxShadow: 'none !important',
        transition: 'all 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        minWidth: '80px'
      }}
    >
      <div style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff !important' }}>{fmt(value)}</div>
      <div style={{ fontSize: '11px', fontWeight: '600', color: '#a0a0b0 !important', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</div>
    </button>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const ProfilePage = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Get auth user from YOUR store shape (s.auth.user, not s.auth directly)
  const currentUser = useSelector((s) => s.auth.user);
  const profile = useSelector(selectProfile(username));

  const [profileLoading, setProfileLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [postsLoading, setPostsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [followListModal, setFollowListModal] = useState(null); // { type: 'followers' | 'following' }

  // ✅ Own-profile check: use BOTH id and username as fallback
  const isOwn =
    !!currentUser &&
    (
      (currentUser.id && currentUser.id === profile?.id) ||
      (currentUser.username && currentUser.username === username)
    );

  // Load profile
  useEffect(() => {
    setProfileLoading(true);
    setPosts([]);
    setPagination(null);
    setInitialized(false);
    dispatch(fetchProfile(username)).finally(() => setProfileLoading(false));
    loadPosts(null, true);
  }, [username]);

  // Load posts (cursor-based)
  const loadPosts = useCallback(async (cursor = null, initial = false) => {
    if (initial) setPostsLoading(true);
    else setLoadingMore(true);

    try {
      const res = await userApi.getUserPosts(username, cursor, 15);
      const { posts: newPosts, pagination: newPag } = res.data.data;
      newPosts.forEach((p) => dispatch(upsertPost(p)));
      setPosts((prev) => cursor ? [...prev, ...newPosts] : newPosts);
      setPagination(newPag);
    } catch (_) {}

    if (initial) setPostsLoading(false);
    else setLoadingMore(false);
    setInitialized(true);
  }, [username, dispatch]);

  const handleLoadMore = () => {
    if (pagination?.nextCursor && !loadingMore) loadPosts(pagination.nextCursor);
  };

  // Infinite scroll sentinel — callback ref must NOT return a function
  const observerRef = React.useRef(null);
  const sentinelRef = useCallback((node) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (!node) return;
    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && pagination?.hasMore && !loadingMore) handleLoadMore();
    }, { rootMargin: '200px' });
    observerRef.current.observe(node);
  }, [pagination, loadingMore]);

  const handleFollow = async () => {
    if (!currentUser) { navigate('/auth'); return; }
    setFollowLoading(true);
    try {
      if (profile?.isFollowing) {
        await dispatch(unfollowUser(username));
      } else {
        await dispatch(followUser(username));
      }
    } finally {
      setFollowLoading(false);
    }
  };

  // ─── Loading state ─────────────────────────────────────────────────────────
  if (profileLoading && !profile) return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <SkeletonProfile />
    </div>
  );

  // ─── Not found ─────────────────────────────────────────────────────────────
  if (!profile && initialized) return (
    <div className="empty-state" style={{ marginTop: 60 }}>
      <div className="empty-state-icon">👤</div>
      <div className="empty-state-title">User not found</div>
      <div className="empty-state-text">@{username} doesn't exist.</div>
      <button className="btn-secondary" onClick={() => navigate('/')}>
        Go home
      </button>
    </div>
  );

  if (!profile) return null;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <MainLayout activePage="profile">
      <div className="main-content">

      {/* ── Profile card ─────────────────────────────────────────────────── */}
      <div className="profile-card" style={{ marginBottom: 20 }}>
        {/* Cover */}
        <div className="profile-cover" />

        {/* Header */}
        <div className="profile-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ marginBottom: 12 }}>
                <Avatar
                  src={profile.avatarUrl}
                  name={profile.displayName}
                  size="2xl"
                  style={{ border: '4px solid var(--bg-3)', marginTop: -60 }}
                />
              </div>
              <div className="profile-name">{profile.displayName}</div>
              <div className="profile-handle">@{profile.username}</div>
              {profile.bio && (
                <div className="profile-bio" style={{ marginTop: 8 }}>{profile.bio}</div>
              )}
            </div>

            {/* ✅ Action button — only shown once profile AND currentUser are loaded */}
            <div style={{ paddingTop: 8, flexShrink: 0 }}>
              {isOwn ? (
                <button
                  className="btn-edit"
                  style={{ minWidth: 100 }}
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit profile
                </button>
              ) : currentUser ? (
                <button
                  className={`btn-follow ${profile.isFollowing ? 'following' : ''}`}
                  style={{ minWidth: 100 }}
                  disabled={followLoading}
                  onClick={handleFollow}
                >
                  {followLoading
                    ? <span className="spinner" style={{ width: 14, height: 14 }} />
                    : profile.isFollowing ? 'Following' : 'Follow'}
                </button>
              ) : null}
            </div>
          </div>

          {/* Stats */}
          <div className="profile-stats">
            <StatItem label="Posts" value={profile.postsCount} />
            <StatItem 
              label="Followers" 
              value={profile.followersCount} 
              onClick={() => setFollowListModal({ type: 'followers' })}
            />
            <StatItem 
              label="Following" 
              value={profile.followingCount} 
              onClick={() => setFollowListModal({ type: 'following' })}
            />
          </div>
        </div>
      </div>

      {/* ── Posts ────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 16 }}>
          Posts
        </div>
      </div>

      {postsLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-post">
              <div className="skeleton-header">
                <div className="skeleton-avatar" />
                <div className="skeleton-info">
                  <div className="skeleton-line" style={{ width: '30%' }} />
                  <div className="skeleton-line" style={{ width: '20%' }} />
                </div>
              </div>
              <div className="skeleton-content">
                <div className="skeleton-line" />
                <div className="skeleton-line" style={{ width: '75%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : profile.isPrivate && !profile.isFollowing && !isOwn ? (
        <div className="empty-state">
          <div className="empty-state-icon" style={{ opacity: 0.5 }}>🔒</div>
          <div className="empty-state-title">This account is private</div>
          <div className="empty-state-text">
            Follow {profile.displayName} to see their posts.
          </div>
        </div>
      ) : posts.length === 0 && initialized ? (
        <div className="empty-state">
          <div className="empty-state-icon">✦</div>
          <div className="empty-state-title">No posts yet</div>
          <div className="empty-state-text">
            {isOwn ? "You haven't posted anything yet." : `${profile.displayName} hasn't posted yet.`}
          </div>
        </div>
      ) : (
        <div className="posts-container">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} style={{ height: 4 }} />

          {loadingMore && (
            <div className="loading-more">
              <span className="spinner" />
              <span>Loading more…</span>
            </div>
          )}

          {initialized && !pagination?.hasMore && posts.length > 0 && (
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-3)', padding: '20px 0' }}>
              All posts loaded
            </p>
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal 
          user={profile} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}
      {/* Follower/Following List Modal */}
      {followListModal && (
        <FollowListModal
          username={profile.username}
          initialType={followListModal.type}
          onClose={() => setFollowListModal(null)}
        />
      )}
      </div>
      <RightPanel />
    </MainLayout>
  );
};

export default ProfilePage;