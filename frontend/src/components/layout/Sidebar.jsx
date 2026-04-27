import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import Avatar from '../ui/Avatar';

const Icon = {
  Home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  LogOut: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

export default function Sidebar({ activePage }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">✦</div>
        <span className="sidebar-logo-text">Pulse</span>
      </div>
      <nav className="sidebar-nav">
        <div 
          className={`nav-item ${activePage === 'feed' ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          <Icon.Home /><span>Home</span>
        </div>
        <div 
          className={`nav-item ${activePage === 'profile' ? 'active' : ''}`}
          onClick={() => navigate(`/profile/${user?.username}`)}
        >
          <Icon.User /><span>Profile</span>
        </div>
        <div 
          className={`nav-item ${activePage === 'explore' ? 'active' : ''}`}
          onClick={() => navigate('/explore')}
        >
          <Icon.Users /><span>Explore</span>
        </div>
        <div 
          className="nav-item" 
          style={{ marginTop: 'auto' }} 
          onClick={() => {
            dispatch(logout());
            navigate('/auth');
          }}
        >
          <Icon.LogOut /><span>Logout</span>
        </div>
      </nav>
      <div className="sidebar-user" onClick={() => navigate(`/profile/${user?.username}`)}>
        <Avatar user={user} size={34} />
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user?.displayName}</div>
          <div className="sidebar-user-handle">@{user?.username}</div>
        </div>
      </div>
    </aside>
  );
}
