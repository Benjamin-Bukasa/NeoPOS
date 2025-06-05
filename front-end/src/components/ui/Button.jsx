import React from 'react';


const Button = ({ onClick, children, className = '', type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-8 py-2 rounded-md font-semibold shadow-md transition duration-200 hover:opacity-90 ${className}`}
      
    >
      {children}
    </button>
  );
}

export default Button;
