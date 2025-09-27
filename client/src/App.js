import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import React, { useState } from 'react';

// Import pages
import HomePage from './pages/HomePage';
import GoalsPage from './pages/GoalsPage';
import AchievementsPage from './pages/AchievementsPage';
import AICoachPage from './pages/AICoachPage';
import ProfilePage from './pages/ProfilePage';
import OnboardingPage from './pages/OnboardingPage';

// Import components
import NavBar from './components/layout/NavBar';

function App() {
  // Set to true for development/testing to bypass onboarding
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  
  return (
    <div className="App bg-background min-h-screen">
      <Router>
        <Routes>
          {!isLoggedIn ? (
            <Route path="/*" element={<OnboardingPage />} />
          ) : (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/coach" element={<AICoachPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </>
          )}
        </Routes>
        {isLoggedIn && <NavBar />}
      </Router>
    </div>
  );
}

export default App;
