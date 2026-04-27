import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../features/auth/authSlice';
import Login from './Login';
import Register from './Register';

export default function AuthPage() {
  const [tab, setTab] = useState('login');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAuth = (user) => {
    dispatch(setUser(user));
    navigate('/');
  };

  return (
    <div className="auth-root">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-mark">✦</div>
          <span className="auth-logo-text">Pulse</span>
        </div>
        <h1 className="auth-title">{tab === 'login' ? 'Welcome back' : 'Join Pulse'}</h1>
        <p className="auth-sub">
          {tab === 'login' 
            ? 'Sign in to your account to continue.' 
            : 'Create your account and start sharing.'}
        </p>
        <div className="auth-tabs">
          <div 
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`} 
            onClick={() => setTab('login')}
          >
            Sign In
          </div>
          <div 
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`} 
            onClick={() => setTab('register')}
          >
            Register
          </div>
        </div>

        {tab === 'login' ? (
          <Login onAuth={handleAuth} />
        ) : (
          <Register onAuth={handleAuth} />
        )}
      </div>
    </div>
  );
}
