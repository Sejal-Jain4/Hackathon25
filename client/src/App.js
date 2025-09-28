import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import React, { useState, useEffect } from 'react';

// Import pages
import HomePage from './pages/HomePage';
import GoalsPage from './pages/GoalsPage';
import AchievementsPage from './pages/AchievementsPage';
import AICoachPage from './pages/AICoachPage';
import ProfilePage from './pages/ProfilePage';
import OnboardingPage from './pages/OnboardingPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

// Import components
import NavBar from './components/layout/NavBar';

// Wrapper component to conditionally render NavBar only on dashboard pages
function NavBarWrapper({ isLoggedIn }) {
  const location = useLocation();
  
  // List of paths that should NOT show the navigation bar
  const noNavBarPaths = ['/', '/landing', '/login', '/onboarding'];
  
  // Only render NavBar if logged in AND we're on a dashboard page
  const shouldShowNavBar = isLoggedIn && !noNavBarPaths.includes(location.pathname);
  
  return shouldShowNavBar ? <NavBar /> : null;
}

function AppContent() {
  // Check localStorage for existing auth state on initial load
  const storedAuthState = localStorage.getItem('centsi_auth');
  const [isLoggedIn, setIsLoggedIn] = useState(storedAuthState === 'true');
  const [theme, setTheme] = useState('dark');
  
  // Function to handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('centsi_auth', 'true');
  };
  
  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('centsi_auth');
    localStorage.removeItem('centsi_username');
    localStorage.removeItem('centsi_user_profile');
  };

  return (
    <div className={`App min-h-screen ${theme === 'dark' ? 'bg-dark-900' : 'bg-background'}`}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/onboarding" element={<OnboardingPage onLogin={handleLogin} />} />
        
        {/* Protected routes that require authentication */}
        <Route 
          path="/home" 
          element={isLoggedIn ? <HomePage /> : <Navigate to="/" />} 
        />
        <Route 
          path="/goals" 
          element={isLoggedIn ? <GoalsPage /> : <Navigate to="/" />} 
        />
        <Route 
          path="/achievements" 
          element={isLoggedIn ? <AchievementsPage /> : <Navigate to="/" />} 
        />
        <Route 
          path="/coach" 
          element={isLoggedIn ? <AICoachPage /> : <Navigate to="/" />} 
        />
        <Route 
          path="/profile" 
          element={isLoggedIn ? <ProfilePage onLogout={handleLogout} /> : <Navigate to="/" />} 
        />
        
        {/* Default route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <NavBarWrapper isLoggedIn={isLoggedIn} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
