import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import React, { useState } from 'react';

// Import pages
import HomePage from './pages/HomePage';
import GoalsPage from './pages/GoalsPage';
import AchievementsPage from './pages/AchievementsPage';
import AICoachPage from './pages/AICoachPage';
import ProfilePage from './pages/ProfilePage';
import OnboardingPage from './pages/OnboardingPage';
import LandingPage from './pages/LandingPage';

// Import components
import NavBar from './components/layout/NavBar';

function App() {
  // State for authentication and theme
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState('dark');
  
  // Function to handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  return (
    <div className={`App min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-background'}`}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          
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
            element={isLoggedIn ? <ProfilePage /> : <Navigate to="/landing" />} 
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
