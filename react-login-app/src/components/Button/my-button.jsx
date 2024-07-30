import React from 'react';

function MyButton({ children, className = '', type = 'button', onClick, ...rest }) {
  // Define styles for different types
  const buttonStyles = {
    submit: 'bg-red-900 text-white px-4 py-2 rounded hover:bg-red-700',
    reset: 'bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-4',
    button: 'bg-red-900 text-white px-4 py-2 rounded hover:bg-red-700',
  };

  // Determine style based on type
  const style = buttonStyles[type] || '';

  return (
    <button type={type} className={`${style} ${className}`} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}

export default MyButton;
