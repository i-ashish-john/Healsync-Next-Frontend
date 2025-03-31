import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  type = 'button', 
  children, 
  onClick, 
  disabled = false,
  className = ''
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 rounded-xl hover:from-purple-700 hover:to-purple-900 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${disabled ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};