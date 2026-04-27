import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { updateProfileInStore } from '../../features/user/userSlice';
import { setUser } from '../../features/auth/authSlice';
import { userApi } from '../../api/user.api';
import Avatar from '../ui/Avatar';

const EditProfileModal = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [bio, setBio] = useState(user.bio || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl);
  const [isPrivate, setIsPrivate] = useState(user.isPrivate || false);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        toast.error('Only JPEG, PNG, WebP, and GIF images are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large (max 5MB)');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let updatedUser = { ...user };

      // Update avatar if changed
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        const res = await userApi.uploadAvatar(formData);
        updatedUser = res.data.data.user;
      }

      // Update profile info if changed
      if (displayName !== user.displayName || bio !== user.bio || isPrivate !== user.isPrivate) {
        const res = await userApi.updateProfile({ displayName, bio, isPrivate });
        updatedUser = res.data.data.user;
      }

      // Update Redux state so UI reflects changes instantly
      dispatch(updateProfileInStore(updatedUser));
      dispatch(setUser(updatedUser));
      
      toast.success('Profile updated successfully');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', 
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        backgroundColor: 'var(--bg-2)', padding: 24, borderRadius: 12, 
        width: '100%', maxWidth: 400, border: '1px solid var(--border)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: 24 }}>Edit Profile</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
              <Avatar src={avatarPreview} name={displayName || user.username} size="xl" />
              <div style={{
                position: 'absolute', bottom: 0, right: 0, background: 'var(--primary)', 
                color: 'white', width: 28, height: 28, borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                border: '2px solid var(--bg-2)', fontSize: 14
              }}>
                📷
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleAvatarChange}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'var(--text-2)' }}>Display Name</label>
            <input 
              type="text" 
              value={displayName} 
              onChange={e => setDisplayName(e.target.value)}
              className="post-input"
              style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-3)', color: 'var(--text)' }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'var(--text-2)' }}>Bio</label>
            <textarea 
              value={bio} 
              onChange={e => setBio(e.target.value)}
              className="post-input"
              rows={3}
              style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-3)', color: 'var(--text)', resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14, color: 'var(--text-2)' }}>Private Account</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Only followers can see your posts.</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: 40, height: 24 }}>
              <input 
                type="checkbox" 
                checked={isPrivate} 
                onChange={(e) => setIsPrivate(e.target.checked)} 
                style={{ opacity: 0, width: 0, height: 0 }} 
              />
              <span style={{
                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: isPrivate ? 'var(--primary)' : 'var(--bg-3)',
                transition: '.4s', borderRadius: 24, border: '1px solid var(--border)'
              }}>
                <span style={{
                  position: 'absolute', content: '""', height: 16, width: 16, left: 4, bottom: 3,
                  backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                  transform: isPrivate ? 'translateX(16px)' : 'none'
                }} />
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer' }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
