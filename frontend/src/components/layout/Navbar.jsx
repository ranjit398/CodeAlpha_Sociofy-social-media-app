import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { logout } from '../../features/auth/authSlice';
import { searchUsers, clearSearch } from '../../features/user/userSlice';
import { useSelector } from 'react-redux';
import { selectSearchResults } from '../../features/user/userSlice';
import { useDebounce } from '../../hooks/useDebounce';
import Avatar from '../ui/Avatar';

const SearchBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const results = useSelector(selectSearchResults);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (debouncedQuery.trim().length >= 1) dispatch(searchUsers(debouncedQuery));
    else dispatch(clearSearch());
  }, [debouncedQuery, dispatch]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (username) => {
    setQuery('');
    setFocused(false);
    dispatch(clearSearch());
    navigate(`/profile/${username}`);
  };

  const showDropdown = focused && query.length >= 1 && results.length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xs">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search people…"
          className="w-full bg-surface-2 border border-surface-3 rounded-xl pl-9 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition-colors"
        />
      </div>
      {showDropdown && (
        <div className="absolute top-full mt-2 left-0 right-0 card shadow-2xl z-50 overflow-hidden animate-fade-in">
          {results.slice(0, 6).map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelect(user.username)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-2 transition-colors text-left"
            >
              <Avatar src={user.avatarUrl} name={user.displayName} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-100 truncate">{user.displayName}</p>
                <p className="text-xs text-zinc-500 truncate">@{user.username}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-surface-3">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="font-display font-bold text-xl text-brand-500 tracking-tight flex-shrink-0">
          sociofy
        </Link>

        {/* Search */}
        <div className="flex-1 flex justify-center">
          <SearchBar />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isAuthenticated ? (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-xl p-1 hover:bg-surface-2 transition-colors"
              >
                <Avatar src={user?.avatarUrl} name={user?.displayName} size="sm" />
                <span className="hidden sm:block text-sm font-medium text-zinc-300 max-w-[100px] truncate">
                  {user?.displayName}
                </span>
                <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 card shadow-2xl z-50 overflow-hidden animate-fade-in py-1">
                  <Link
                    to={`/profile/${user?.username}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-surface-2 hover:text-zinc-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    Profile
                  </Link>
                  <div className="divider my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost btn btn-sm">Sign in</Link>
              <Link to="/register" className="btn-primary btn btn-sm">Join</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
