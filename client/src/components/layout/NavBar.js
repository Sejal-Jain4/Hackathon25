import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path 
      ? 'bg-gradient-to-r from-accent-500 to-primary-500 bg-clip-text text-transparent' 
      : 'text-gray-400';
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-700 pb-safe shadow-lg z-50">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-500 via-primary-500 to-secondary-500"></div>
      <div className="flex justify-around items-center py-3">
        <Link to="/home" className={`flex flex-col items-center transition-all duration-200 hover:opacity-80 ${isActive('/home')}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${location.pathname === '/home' ? 'stroke-accent-500' : 'stroke-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1 font-medium">Home</span>
        </Link>
        <Link to="/goals" className={`flex flex-col items-center transition-all duration-200 hover:opacity-80 ${isActive('/goals')}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${location.pathname === '/goals' ? 'stroke-accent-500' : 'stroke-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs mt-1 font-medium">Goals</span>
        </Link>
        <Link to="/coach" className={`flex flex-col items-center transition-all duration-200 hover:opacity-80 ${isActive('/coach')}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${location.pathname === '/coach' ? 'stroke-accent-500' : 'stroke-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="text-xs mt-1 font-medium">Coach</span>
        </Link>
        <Link to="/achievements" className={`flex flex-col items-center transition-all duration-200 hover:opacity-80 ${isActive('/achievements')}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${location.pathname === '/achievements' ? 'stroke-accent-500' : 'stroke-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span className="text-xs mt-1 font-medium">Achievements</span>
        </Link>
        <Link to="/learn" className={`flex flex-col items-center transition-all duration-200 hover:opacity-80 ${isActive('/learn')}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${location.pathname === '/learn' ? 'stroke-accent-500' : 'stroke-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-xs mt-1 font-medium">Learn</span>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;