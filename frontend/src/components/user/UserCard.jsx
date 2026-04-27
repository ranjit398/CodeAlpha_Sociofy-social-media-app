import Avatar from '../ui/Avatar';
import FollowButton from './FollowButton';

export default function UserCard({ user, onNavigate }) {
  return (
    <div className="suggest-item">
      <Avatar user={user} size={36} />
      <div className="suggest-info">
        <div 
          className="suggest-name" 
          onClick={() => onNavigate(`/profile/${user.username}`)}
          style={{ cursor: 'pointer' }}
        >
          {user.displayName}
        </div>
        <div className="suggest-handle">@{user.username}</div>
      </div>
      <FollowButton user={user} />
    </div>
  );
}
