import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
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
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/onboarding" element={<OnboardingPage onLogin={handleLogin} />} />
          
          {/* Protected routes that require authentication */}
          <Route 
            path="/" 
            element={isLoggedIn ? <HomePage /> : <Navigate to="/landing" />} 
          />
          <Route 
            path="/goals" 
            element={isLoggedIn ? <GoalsPage /> : <Navigate to="/landing" />} 
          />
          <Route 
            path="/achievements" 
            element={isLoggedIn ? <AchievementsPage /> : <Navigate to="/landing" />} 
          />
          <Route 
            path="/coach" 
            element={isLoggedIn ? <AICoachPage /> : <Navigate to="/landing" />} 
          />
          <Route 
            path="/profile" 
            element={isLoggedIn ? <ProfilePage onLogout={handleLogout} /> : <Navigate to="/landing" />} 
          />
          
          {/* Default route */}
          <Route path="*" element={<Navigate to="/landing" />} />
        </Routes>
        {isLoggedIn && <NavBar />}
      </Router>
    </div>
  );
}

export default App;
