import React from 'react';

const Header = ({ title, showBackButton = false, onBack }) => {
  return (
    <header className="bg-white shadow-sm px-4 py-3 flex items-center">
      {showBackButton && (
        <button 
          onClick={onBack}
          className="mr-2 text-gray-600 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
    </header>
  );
};

export default Header;