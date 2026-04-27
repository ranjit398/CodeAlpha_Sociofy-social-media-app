import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function MainLayout({ children }) {
  const location = useLocation();
  const getActivePage = () => {
    if (location.pathname === '/') return 'feed';
    if (location.pathname.startsWith('/profile')) return 'profile';
    return 'feed';
  };

  return (
    <div className="app-layout">
      <Sidebar activePage={getActivePage()} />
      {children}
      <nav className="mobile-nav">
        <div className="mobile-nav-inner">
          <button className="mobile-nav-btn">🏠 Home</button>
          <button className="mobile-nav-btn">🔍 Search</button>
          <button className="mobile-nav-btn">👤 Profile</button>
          <button className="mobile-nav-btn">🚪 Logout</button>
        </div>
      </nav>
    </div>
  );
}
