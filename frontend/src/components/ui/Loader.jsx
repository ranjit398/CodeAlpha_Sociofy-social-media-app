import React from 'react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }[size] || 'w-6 h-6';
  return (
    <span
      className={`${s} border-2 border-surface-4 border-t-brand-500 rounded-full animate-spin inline-block ${className}`}
    />
  );
};

export const PageLoader = () => (
  <div className="fixed inset-0 bg-surface flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-4">
      <span className="font-display font-bold text-2xl text-brand-500 tracking-tight">pulse</span>
      <Spinner size="lg" />
    </div>
  </div>
);

export const SkeletonPost = () => (
  <div className="card p-5 animate-pulse">
    <div className="flex gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-surface-3 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-surface-3 rounded w-1/3" />
        <div className="h-3 bg-surface-3 rounded w-1/5" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-surface-3 rounded w-full" />
      <div className="h-3 bg-surface-3 rounded w-4/5" />
      <div className="h-3 bg-surface-3 rounded w-3/5" />
    </div>
  </div>
);

const Loader = ({ className = '' }) => (
  <div className={`flex justify-center py-8 ${className}`}>
    <Spinner />
  </div>
);

export default Loader;