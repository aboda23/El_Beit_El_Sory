import React from 'react';

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98] select-none rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100';

  const variants = {
    primary: 'bg-accent hover:bg-accent-hover text-black font-semibold shadow-md shadow-accent/20 focus:ring-accent',
    secondary: 'bg-bg-card hover:bg-bg-cardHover text-text-primary border border-border-dark hover:border-border-light focus:ring-slate-500',
    whatsapp: 'bg-whatsapp hover:bg-whatsapp-hover text-white font-semibold shadow-md shadow-whatsapp/25 focus:ring-whatsapp',
    danger: 'bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-bg-card text-text-secondary hover:text-text-primary focus:ring-slate-500',
    outline: 'bg-transparent border border-border-dark hover:border-accent text-text-primary hover:text-accent focus:ring-accent',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 rounded-2xl font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}

export default Button;
