import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { searchUsers, clearSearch, selectSearchResults } from '../../features/user/userSlice';
import Avatar from '../ui/Avatar';

const MOCK_SUGGESTIONS = [
  { id: 'u1', username: 'aurora_chen', displayName: 'Aurora Chen' },
  { id: 'u2', username: 'kai_wright', displayName: 'Kai Wright' },
  { id: 'u3', username: 'nova_patel', displayName: 'Nova Patel' },
];

const Icon = {
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
};

export default function RightPanel() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const results = useSelector(selectSearchResults) || [];
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        dispatch(clearSearch());
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dispatch]);

  useEffect(() => {
    if (!query.trim()) {
      dispatch(clearSearch());
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      await dispatch(searchUsers(query));
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, [query, dispatch]);

  return (
    <aside className="right-panel">
      <div ref={ref} style={{ position: 'relative' }}>
        <div className="search-wrap">
          {loading ? '⏳' : <Icon.Search />}
          <input 
            placeholder="Search people…" 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
          />
        </div>
        {results.length > 0 && query.trim() && !loading && (
          <div className="search-results" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, backgroundColor: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 12, marginTop: 8, overflow: 'hidden' }}>
            {results.map(u => (
              <div 
                key={u.id} 
                className="search-result-item"
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
                onClick={() => {
                  navigate(`/profile/${u.username}`);
                  dispatch(clearSearch());
                  setQuery('');
                }}
              >
                <Avatar user={u} size={34} />
                <div>
                  <div className="search-result-name" style={{ fontSize: 14, fontWeight: 600 }}>{u.displayName}</div>
                  <div className="search-result-handle" style={{ fontSize: 13, color: 'var(--text-2)' }}>@{u.username}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="panel-card">
        <div className="panel-title">Suggested</div>
        {MOCK_SUGGESTIONS.map(u => (
          <div className="suggest-item" key={u.id}>
            <Avatar user={u} size={36} />
            <div className="suggest-info">
              <div className="suggest-name">{u.displayName}</div>
              <div className="suggest-handle">@{u.username}</div>
            </div>
            <button className="btn-follow-sm">Follow</button>
          </div>
        ))}
      </div>

      <div className="panel-card">
        <div className="panel-title">Trending</div>
        {['#buildinpublic', '#designsystems', '#typescript', '#webdev'].map(t => (
          <div key={t} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{t}</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
              {Math.floor(Math.random() * 500) + 100} posts today
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
