import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../api/user.api';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

const FollowListModal = ({ username, initialType, onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialType || 'followers');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [username, activeTab]);

  const fetchUsers = async (cursor = null) => {
    if (!cursor) setLoading(true);
    else setLoadingMore(true);

    try {
      const apiMethod = activeTab === 'followers' ? userApi.getFollowers : userApi.getFollowing;
      const res = await apiMethod(username, cursor, 20);
      const { users: newUsers, pagination: newPag } = res.data.data;
      
      setUsers(prev => cursor ? [...prev, ...newUsers] : newUsers);
      setPagination(newPag);
    } catch (err) {
      console.error('Failed to fetch follow list', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(u => 
      u.username.toLowerCase().includes(q) || 
      u.displayName.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  const handleUserClick = (targetUsername) => {
    onClose();
    navigate(`/profile/${targetUsername}`);
  };

  return createPortal(
    <div className="modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(10px)'
    }}>
      <div className="modal-content" style={{
        backgroundColor: '#111118',
        width: '100%',
        maxWidth: '400px',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '80vh',
        overflow: 'hidden'
      }}>
        
        {/* Tabs - Instagram Style */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', position: 'relative' }}>
          <button 
            style={{
              flex: 1,
              paddingBottom: '12px',
              fontSize: '14px',
              fontWeight: '700',
              background: 'transparent',
              border: 'none',
              color: activeTab === 'followers' ? '#ffffff' : '#606070',
              position: 'relative',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('followers')}
          >
            Followers
            {activeTab === 'followers' && <div style={{ position: 'absolute', bottom: 0, left: '20px', right: '20px', height: '2.5px', backgroundColor: '#ffffff', borderRadius: '4px' }} />}
          </button>
          <button 
            style={{
              flex: 1,
              paddingBottom: '12px',
              fontSize: '14px',
              fontWeight: '700',
              background: 'transparent',
              border: 'none',
              color: activeTab === 'following' ? '#ffffff' : '#606070',
              position: 'relative',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('following')}
          >
            Following
            {activeTab === 'following' && <div style={{ position: 'absolute', bottom: 0, left: '20px', right: '20px', height: '2.5px', backgroundColor: '#ffffff', borderRadius: '4px' }} />}
          </button>
          <button 
            onClick={onClose} 
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              padding: '8px',
              background: 'transparent',
              border: 'none',
              color: '#606070',
              cursor: 'pointer'
            }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '16px 16px 8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#18181f',
            padding: '10px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <svg width="16" height="16" color="#606070" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search" 
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                width: '100%',
                color: '#ffffff'
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* User List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#606070' }}>Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#606070' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>👤</div>
              <p style={{ fontSize: '14px' }}>No results found</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {filteredUsers.map(user => (
                <div 
                  key={user.id} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  className="user-list-item"
                  onClick={() => handleUserClick(user.username)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar src={user.avatarUrl} name={user.displayName} size="md" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: '700', fontSize: '14px', color: '#ffffff', lineHeight: 1.2 }}>
                        {user.username}
                      </span>
                      <span style={{ fontSize: '12px', color: '#606070', lineHeight: 1.2 }}>
                        {user.displayName}
                      </span>
                    </div>
                  </div>
                  <button style={{
                    padding: '6px 16px',
                    backgroundColor: '#18181f',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}>
                    {activeTab === 'following' ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}

              {pagination?.hasMore && !searchQuery && (
                <button 
                  onClick={() => fetchUsers(pagination.nextCursor)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#606070',
                    cursor: 'pointer'
                  }}
                >
                  {loadingMore ? 'Loading...' : 'Load more'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FollowListModal;

