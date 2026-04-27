import React from 'react';
import { getInitials } from '../../utils/helpers';

const sizeMap = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
  '2xl': 'w-28 h-28 text-2xl',
};

const Avatar = ({ src, alt, name, size = 'md', className = '' }) => {
  const sizeClass = sizeMap[size] || sizeMap.md;

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'avatar'}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-surface-3 flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center font-display font-bold text-white flex-shrink-0 ring-2 ring-surface-3 ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;