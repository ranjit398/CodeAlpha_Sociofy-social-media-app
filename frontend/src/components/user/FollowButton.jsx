import { useState } from 'react';
import Loader from '../ui/Loader';

export default function FollowButton({ user }) {
  const [following, setFollowing] = useState(user?.isFollowing || false);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setFollowing(f => !f);
    setLoading(false);
  };

  return (
    <button 
      className={following ? 'btn-unfollow' : 'btn-follow'}
      onClick={handleFollow}
      disabled={loading}
    >
      {loading ? <Loader /> : (following ? 'Unfollow' : 'Follow')}
    </button>
  );
}
