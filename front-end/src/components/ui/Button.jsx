import React from 'react';


const Button = ({ onClick, children, className = '', type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`font-semibold transition duration-200  ${className}`}
      
    >
      {children}
    </button>
  );
}

export default Button;
