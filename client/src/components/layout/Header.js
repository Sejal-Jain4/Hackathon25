import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title, showBackButton = false, onBack, username }) => {
  const navigate = useNavigate();
  
  // If the title contains "Welcome", handle it specially like the HomePage header
  const isWelcomeHeader = title && title.toLowerCase().includes('welcome');
  
  return (
    <header className="bg-dark-800 px-6 py-4 shadow-md border-b border-dark-700 flex items-center">
      {showBackButton && (
        <button 
          onClick={onBack}
          className="mr-4 text-white focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      {isWelcomeHeader ? (
        <h1 className="text-2xl font-bold text-white text-left">
          Welcome to <span 
            onClick={() => navigate('/')} 
            className="bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
          >
            Centsi
          </span>
          {username && <span className="ml-2 text-2xl font-bold text-white">{username}</span>}
        </h1>
      ) : (
        <h1 className="text-2xl font-bold text-white text-left">
          <span className="bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">{title}</span>
        </h1>
      )}
    </header>
  );
};

export default Header;