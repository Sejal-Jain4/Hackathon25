import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import { Card, AchievementCelebration } from '../components/ui';
import { 
  getAchievements, 
  getCompleteUserData, 
  isDataLoaded,
  checkAchievementsProgress
} from '../utils/dataService';

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [userData, setUserData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [stats, setStats] = useState({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    streak: 0
  });
  const [completedAchievement, setCompletedAchievement] = useState(null);
  
  // Load user data on component mount
  useEffect(() => {
    // Get achievements from data service
    const achievementsData = getAchievements();
    setAchievements(achievementsData);
    
    // Get user data from data service
    const data = getCompleteUserData();
    setUserData(data);
    
    // Check if data has been loaded before
    const dataLoaded = isDataLoaded();
    setDataLoaded(dataLoaded);
    
    // If data is loaded, check for achievement progress
    if (dataLoaded) {
      const result = checkAchievementsProgress();
      setAchievements(result.achievements);
      
      // Calculate stats based on achievements
      calculateStats(result.achievements);
    }
  }, []);
  
  // Calculate user stats based on achievements
  const calculateStats = (achievementsData) => {
    // Count completed achievements
    const completedAchievements = achievementsData.filter(a => a.status === 'completed');
    
    // Calculate XP based on completed achievements (each gives xpReward)
    const totalXP = completedAchievements.reduce((sum, achievement) => sum + (achievement.xpReward || 100), 0);
    
    // Define XP thresholds for each level (level 1: 0-299, level 2: 300-799, level 3: 800+)
    const levelThresholds = [0, 300, 800];
    
    // Calculate current level
    let level = 1;
    for (let i = 1; i < levelThresholds.length; i++) {
      if (totalXP >= levelThresholds[i]) {
        level = i + 1;
      } else {
        break;
      }
    }
    
    // Calculate XP needed for next level
    let xpToNextLevel;
    if (level < levelThresholds.length) {
      xpToNextLevel = levelThresholds[level] - totalXP;
    } else {
      // If beyond our defined levels, use a standard progression (500 XP per level after level 3)
      xpToNextLevel = 500 - (totalXP - levelThresholds[levelThresholds.length - 1]) % 500;
      if (xpToNextLevel === 500) xpToNextLevel = 0;
    }
    
    // Get streak from local storage or default to 0
    const streak = parseInt(localStorage.getItem('centsi_login_streak') || '0');
    
    setStats({
      level,
      xp: totalXP,
      xpToNextLevel,
      streak
    });
  };
  
  // Generate badges from achievements
  const generateBadges = () => {
    if (!achievements.length) return [];
    
    return [
      {
        id: 'savings_goals_creator',
        name: 'Goal Setter',
        description: 'Add 3 savings goals',
        earned: achievements.find(a => a.id === 'savings_goals_creator')?.status === 'completed',
        date: '2025-09-15',
        icon: '🎯'
      },
      {
        id: 'financial_learner',
        name: 'Financial Scholar',
        description: 'Complete a learning activity',
        earned: achievements.find(a => a.id === 'financial_learner')?.status === 'completed',
        date: '2025-09-20',
        icon: '📚'
      },
      {
        id: 'voice_assistant_user',
        name: 'Voice Explorer',
        description: 'Interact with the AI voice assistant',
        earned: achievements.find(a => a.id === 'voice_assistant_user')?.status === 'completed',
        date: '2025-09-22',
        icon: '🎤'
      },
      {
        id: 'savings_milestone',
        name: 'First $100 Saved',
        description: 'Save your first $100',
        earned: achievements.find(a => a.id === 'savings_milestone')?.status === 'completed',
        date: '2025-09-18',
        icon: '💰'
      },
      {
        id: 'budget_master',
        name: 'Budget Master',
        description: 'Create a budget with 3+ categories',
        earned: userData?.finances?.expenses?.length >= 3,
        date: '2025-09-25',
        icon: '📊'
      },
      {
        id: 'expense_tracker',
        name: 'Expense Tracker',
        description: 'Track expenses for a week',
        earned: userData?.finances?.expenses?.length > 0,
        date: '2025-09-12',
        icon: '📝'
      }
    ];
  };
  
  // Generate milestone achievements from user data
  const generateMilestones = () => {
    const badges = generateBadges();
    
    // Convert badges to milestone format
    const fromBadges = badges.map(badge => ({
      id: badge.id,
      name: badge.name,
      completed: badge.earned,
      date: badge.earned ? badge.date : null,
      progress: achievements.find(a => a.id === badge.id)?.progress || 0,
      description: badge.description,
      icon: badge.icon
    }));
    
    // Add additional milestones based on financial data
    const additionalMilestones = [];
    
    if (userData && userData.finances) {
      // Check for savings milestones
      const totalSaved = (userData.finances.savingsGoals || []).reduce((sum, goal) => sum + goal.current, 0);
      
      if (totalSaved >= 100) {
        additionalMilestones.push({
          id: 'save_100',
          name: 'Save $100',
          completed: true,
          date: '2025-09-10',
          progress: 100,
          description: 'Save your first $100',
          icon: '💰'
        });
        
        if (totalSaved >= 500) {
          additionalMilestones.push({
            id: 'save_500',
            name: 'Save $500',
            completed: true,
            date: '2025-09-25',
            progress: 100,
            description: 'Save your first $500',
            icon: '💰'
          });
        } else {
          additionalMilestones.push({
            id: 'save_500',
            name: 'Save $500',
            completed: false,
            progress: Math.round((totalSaved / 500) * 100),
            description: 'Save your first $500',
            icon: '💰'
          });
        }
      }
    }
    
    // Combine and sort by completion status and date
    return [...fromBadges, ...additionalMilestones]
      .sort((a, b) => {
        // Completed items first, then sort by date
        if (a.completed && !b.completed) return -1;
        if (!a.completed && b.completed) return 1;
        if (a.completed && b.completed) {
          // Sort completed items by date (most recent first)
          return new Date(b.date) - new Date(a.date);
        }
        // Sort incomplete items by progress (highest first)
        return b.progress - a.progress;
      });
  };

  // Empty achievements placeholders
  const renderEmptyAchievements = () => (
    <div className="p-4 bg-dark-900">
      {/* User Stats */}
      <Card className="p-6 mb-6" gradientTop>
        <div className="flex items-center mb-3">
          <div className="w-14 h-14 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {stats.level}
          </div>
          <div className="ml-4">
            <h2 className="font-semibold text-white">Level {stats.level}</h2>
            <div className="flex items-center text-sm text-gray-400">
              <span>{stats.xp} XP</span>
              <span className="mx-2">•</span>
              <span>{stats.xpToNextLevel} XP to Level {stats.level + 1}</span>
            </div>
          </div>
        </div>
        
          <div className="w-full bg-dark-600 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-accent-500 to-primary-500 h-2 rounded-full" 
              style={{ 
                width: stats.level === 1 
                  ? `${(stats.xp / 300) * 100}%`  // Level 1: 0-300 XP
                  : stats.level === 2 
                    ? `${((stats.xp - 300) / 500) * 100}%`  // Level 2: 300-800 XP
                    : `${((stats.xp - 800) % 500) / 500 * 100}%`  // Level 3+: 500 XP per level
              }}
            ></div>
          </div>        <div className="flex justify-between items-center mt-4">
          <div className="text-center">
            <div className="font-semibold text-lg text-white">{stats.streak}</div>
            <div className="text-xs text-gray-400">Day Streak</div>
          </div>
          <div className="text-center flex items-center">
            <div className="font-semibold text-lg text-white mr-1">0</div>
            <div className="text-xs text-gray-400 flex flex-col items-start">
              <span>Badges</span>
              <span>Earned</span>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Badges Placeholder */}
      <h2 className="text-lg font-semibold mb-3 text-white">Badges</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[...Array(4)].map((_, index) => (
          <Card 
            key={index} 
            className="p-4 flex flex-col items-center opacity-50"
            delay={0.1 * index}
          >
            <div className="w-12 h-12 bg-dark-600 rounded-full flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-medium text-sm text-center text-white">???</h3>
            <p className="text-xs text-gray-400 text-center mt-1">Upload data to unlock</p>
          </Card>
        ))}
      </div>
      
      {/* Achievements Placeholder */}
      <h2 className="text-lg font-semibold mb-3 text-white">Achievements</h2>
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card 
            key={index} 
            className="p-4"
            delay={0.1 * index + 0.2}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-white">???</h3>
              <span className="text-xs px-2 py-1 bg-dark-600 text-gray-400 rounded-full">Upload data</span>
            </div>
            
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Progress</span>
                <span>0%</span>
              </div>
              <div className="w-full bg-dark-600 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-dark-700 h-1.5 rounded-full" 
                  style={{ width: '0%' }}
                ></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
  
  // Loaded achievements
  const renderLoadedAchievements = () => {
    const badges = generateBadges();
    const milestones = generateMilestones();
    
    return (
      <div className="p-4 bg-dark-900">
        {/* User Stats */}
        <Card className="p-6 mb-6" gradientTop>
          <div className="flex items-center mb-3">
            <div className="w-14 h-14 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {stats.level}
            </div>
            <div className="ml-4">
              <h2 className="font-semibold text-white">Level {stats.level}</h2>
              <div className="flex items-center text-sm text-gray-400">
                <span>{stats.xp} XP</span>
                <span className="mx-2">•</span>
                <span>{stats.xpToNextLevel} XP to Level {stats.level + 1}</span>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-dark-600 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-accent-500 to-primary-500 h-2 rounded-full" 
              initial={{ width: 0 }}
              animate={{ 
                width: stats.level === 1 
                  ? `${(stats.xp / 300) * 100}%`  // Level 1: 0-300 XP
                  : stats.level === 2 
                    ? `${((stats.xp - 300) / 500) * 100}%`  // Level 2: 300-800 XP
                    : `${((stats.xp - 800) % 500) / 500 * 100}%`  // Level 3+: 500 XP per level
              }}
              transition={{ duration: 1, delay: 0.2 }}
            ></motion.div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-center">
              <div className="font-semibold text-lg text-white">{stats.streak}</div>
              <div className="text-xs text-gray-400">Day Streak</div>
            </div>
            <div className="text-center flex items-center">
              <div className="font-semibold text-lg text-white mr-1">{badges.filter(b => b.earned).length}</div>
              <div className="text-xs text-gray-400 flex flex-col items-start">
                <span>Badges</span>
                <span>Earned</span>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Badges */}
        <h2 className="text-lg font-semibold mb-3 text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Badges
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {badges.map((badge, index) => (
            <Card 
              key={badge.id} 
              className={`p-4 flex flex-col items-center ${!badge.earned ? 'opacity-60' : ''}`}
              delay={0.1 * index}
            >
              <div className={`w-12 h-12 ${badge.earned ? 'bg-gradient-to-r from-accent-500 to-primary-500' : 'bg-dark-600'} rounded-full flex items-center justify-center mb-2`}>
                {badge.earned ? (
                  <span className="text-xl">{badge.icon}</span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>
              <h3 className="font-medium text-sm text-center text-white">{badge.name}</h3>
              <p className="text-xs text-gray-400 text-center mt-1">{badge.description}</p>
              {badge.earned && <p className="text-xs text-accent-400 mt-2">Earned {badge.date}</p>}
            </Card>
          ))}
        </div>
        
        {/* Achievement Timeline */}
        <h2 className="text-lg font-semibold mb-3 text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          Achievement Timeline
        </h2>
        <div className="space-y-4">
          <div className="relative">
            {/* Timeline */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-dark-600"></div>
            
            {/* Timeline Events */}
            <div className="space-y-6 pl-12 mb-6">
              {/* Completed achievements */}
              {milestones.filter(m => m.completed).map((achievement, index) => (
                <div key={achievement.id} className="relative mb-6">
                  <div className="absolute -left-12 mt-1">
                    <div className="w-7 h-7 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-lg">{achievement.icon || '✅'}</span>
                    </div>
                  </div>
                  
                  <div className="bg-dark-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-white">{achievement.name}</h3>
                      <span className="text-xs px-2 py-1 bg-success text-white rounded-full">Completed</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                    <p className="text-xs text-accent-400 mt-2">Completed on {achievement.date}</p>
                  </div>
                </div>
              ))}
              
              {/* In-progress achievements */}
              {milestones.filter(m => !m.completed).slice(0, 3).map((achievement, index) => (
                <div key={achievement.id} className="relative mb-6">
                  <div className="absolute -left-12 mt-1">
                    <div className="w-7 h-7 bg-dark-600 rounded-full flex items-center justify-center">
                      <span className="text-sm text-gray-400">•</span>
                    </div>
                  </div>
                  
                  <div className="bg-dark-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-white">{achievement.name}</h3>
                      <span className="text-xs px-2 py-1 bg-dark-600 text-gray-400 rounded-full">In Progress</span>
                    </div>
                    
                    <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                    
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <div className="w-full bg-dark-600 rounded-full h-1.5 mt-1">
                        <motion.div 
                          className="bg-gradient-to-r from-accent-500 to-primary-500 h-1.5 rounded-full" 
                          initial={{ width: 0 }}
                          animate={{ width: `${achievement.progress}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + (index * 0.1) }}
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="pb-16 bg-dark-900 min-h-screen">
      <Header title="Achievements" />
      
      {/* Conditionally render empty or loaded achievements */}
      {!dataLoaded ? renderEmptyAchievements() : renderLoadedAchievements()}
      
      {/* Achievement celebration */}
      {completedAchievement && (
        <AchievementCelebration 
          achievement={completedAchievement} 
          onClose={() => setCompletedAchievement(null)}
        />
      )}
    </div>
  );
};

export default AchievementsPage;