import React from 'react';
import { useSelector } from 'react-redux';
import PostCard from './PostCard';
import { SkeletonPost, Spinner } from '../ui/Loader';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

const PostList = ({ postIds, feedState, onLoadMore, emptyMessage = 'No posts yet.' }) => {
  const posts = useSelector((state) =>
    postIds.map((id) => state.post.entities[id]).filter(Boolean)
  );

  const { sentinelRef } = useInfiniteScroll(onLoadMore, {
    hasMore: feedState?.pagination?.hasMore,
    isLoading: feedState?.isLoadingMore,
  });

  if (feedState?.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(4)].map((_, i) => <SkeletonPost key={i} />)}
      </div>
    );
  }

  if (!feedState?.isLoading && posts.length === 0 && feedState?.initialized) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-zinc-500 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <div ref={sentinelRef} className="h-4" />
      {feedState?.isLoadingMore && (
        <div className="flex justify-center py-4"><Spinner /></div>
      )}
      {feedState?.initialized && !feedState?.pagination?.hasMore && posts.length > 0 && (
        <p className="text-center text-xs text-zinc-600 py-6">You are all caught up</p>
      )}
    </div>
  );
};

export default PostList;