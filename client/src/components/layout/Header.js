import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ title, showBackButton = false, onBack, username }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // If the title contains "Welcome", handle it specially like the HomePage header
  const isWelcomeHeader = title && title.toLowerCase().includes('welcome');
  
  return (
    <header className="bg-dark-800 px-6 py-4 shadow-md border-b border-dark-700 flex items-center justify-between">
      <div className="flex items-center">
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
            {username && <span className="ml-2 text-2xl font-bold text-white">, {username}!</span>}
          </h1>
        ) : (
          <h1 className="text-2xl font-bold text-white text-left">
            <span className="bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">{title}</span>
          </h1>
        )}
      </div>
      
      {/* Profile button in top right */}
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/profile')}
          className="flex flex-col items-center transition-all duration-200 hover:opacity-80 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
            className={`h-7 w-7 ${location.pathname === '/profile' ? 'stroke-accent-500' : 'stroke-white'}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;