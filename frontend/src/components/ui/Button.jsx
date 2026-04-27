import React from 'react';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn bg-red-500/10 hover:bg-red-500/20 text-red-400 px-5 py-2.5 text-sm',
};

const sizes = {
  sm: 'btn-sm',
  md: '',
  lg: 'px-7 py-3.5 text-base rounded-2xl',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading…
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;