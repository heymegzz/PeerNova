function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = ''
}) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-white text-black hover:bg-gray-100 disabled:bg-gray-300 disabled:opacity-50 focus:ring-white',
    secondary: 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-black disabled:opacity-50 focus:ring-white',
    ghost: 'text-gray-300 hover:text-white hover:bg-[#1a1a1a] disabled:opacity-50 focus:ring-gray-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
    >
      {isLoading && (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}

export default Button;
