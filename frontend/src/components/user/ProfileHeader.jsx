import { useState } from 'react';
import Avatar from '../ui/Avatar';
import FollowButton from './FollowButton';

const Icon = {
  Edit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
};

export default function ProfileHeader({ profile, isOwn, onNavigate }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="profile-card fade-up">
      <div className="profile-cover">
        <div className="profile-cover-gradient" />
      </div>
      <div className="profile-info">
        <div className="profile-top">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-border">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.displayName} />
              ) : (
                profile.displayName?.charAt(0).toUpperCase()
              )}
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            {isOwn ? (
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                <Icon.Edit /> Edit Profile
              </button>
            ) : (
              <FollowButton user={profile} />
            )}
          </div>
        </div>
        <h1 className="profile-name">{profile.displayName}</h1>
        <div className="profile-handle">@{profile.username}</div>
        {profile.bio && <p className="profile-bio">{profile.bio}</p>}
        <div className="profile-stats">
          <div className="stat">
            <div className="stat-num">{profile._count?.posts || 0}</div>
            <div className="stat-label">Posts</div>
          </div>
          <div className="stat">
            <div className="stat-num">{profile._count?.followers || 0}</div>
            <div className="stat-label">Followers</div>
          </div>
          <div className="stat">
            <div className="stat-num">{profile._count?.following || 0}</div>
            <div className="stat-label">Following</div>
          </div>
        </div>
      </div>
    </div>
  );
}
