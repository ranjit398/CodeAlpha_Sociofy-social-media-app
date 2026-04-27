import { useEffect, useRef, useCallback } from 'react';

export const useInfiniteScroll = (onLoadMore, { hasMore, isLoading, threshold = 200 } = {}) => {
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const handleObserver = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [onLoadMore, hasMore, isLoading]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: `${threshold}px`,
      threshold: 0,
    });

    observerRef.current.observe(sentinel);
    return () => observerRef.current?.disconnect();
  }, [handleObserver, threshold]);

  return { sentinelRef };
};