import React, { useState } from 'react';
import Header from '../components/layout/Header';

const AchievementsPage = () => {
  const [stats, setStats] = useState({
    level: 5,
    xp: 1250,
    xpToNextLevel: 500,
    streak: 7,
    badges: [
      { id: 'budget_boss_1', name: 'Budget Boss Level 1', description: 'Created your first budget', earned: true, date: '2025-09-01' },
      { id: 'saver_1', name: 'Saver Level 1', description: 'Saved your first $100', earned: true, date: '2025-09-10' },
      { id: 'streak_7', name: 'Week Warrior', description: 'Maintained a 7-day streak', earned: true, date: '2025-09-20' },
      { id: 'saver_2', name: 'Saver Level 2', description: 'Saved your first $500', earned: false },
      { id: 'budget_boss_2', name: 'Budget Boss Level 2', description: 'Stick to your budget for a month', earned: false }
    ],
    achievements: [
      { id: 'first_budget', name: 'First Budget', completed: true, date: '2025-09-01' },
      { id: 'track_week', name: 'Expense Tracking Week', completed: true, date: '2025-09-07' },
      { id: 'save_100', name: 'Save $100', completed: true, date: '2025-09-10' },
      { id: 'save_500', name: 'Save $500', completed: false, progress: 50 }
    ]
  });
  
  return (
    <div className="pb-16">
      <Header title="Achievements" />
      
      <div className="p-4">
        {/* User Stats */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center mb-3">
            <div className="w-14 h-14 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {stats.level}
            </div>
            <div className="ml-4">
              <h2 className="font-semibold">Level {stats.level}</h2>
              <div className="flex items-center text-sm text-gray-500">
                <span>{stats.xp} XP</span>
                <span className="mx-2">•</span>
                <span>{stats.xpToNextLevel} XP to Level {stats.level + 1}</span>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full" 
              style={{ width: `${(stats.xp / (stats.xp + stats.xpToNextLevel)) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-center">
              <div className="font-semibold text-lg">{stats.streak}</div>
              <div className="text-xs text-gray-500">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg">{stats.badges.filter(b => b.earned).length}</div>
              <div className="text-xs text-gray-500">Badges</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg">{stats.achievements.filter(a => a.completed).length}</div>
              <div className="text-xs text-gray-500">Achievements</div>
            </div>
          </div>
        </div>
        
        {/* Badges */}
        <h2 className="text-lg font-semibold mb-3">Badges</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.badges.map(badge => (
            <div 
              key={badge.id} 
              className={`bg-white rounded-lg shadow p-3 flex flex-col items-center ${!badge.earned ? 'opacity-50' : ''}`}
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-2">
                {badge.earned ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>
              <h3 className="font-medium text-sm text-center">{badge.name}</h3>
              <p className="text-xs text-gray-500 text-center mt-1">{badge.description}</p>
              {badge.earned && <p className="text-xs text-primary-500 mt-2">Earned {badge.date}</p>}
            </div>
          ))}
        </div>
        
        {/* Achievements */}
        <h2 className="text-lg font-semibold mb-3">Achievements</h2>
        <div className="space-y-4">
          {stats.achievements.map(achievement => (
            <div key={achievement.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{achievement.name}</h3>
                {achievement.completed ? (
                  <span className="text-xs px-2 py-1 bg-success text-white rounded-full">Completed</span>
                ) : (
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">In Progress</span>
                )}
              </div>
              
              {!achievement.completed && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span>{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-primary-500 h-1.5 rounded-full" 
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {achievement.completed && (
                <p className="text-xs text-gray-500 mt-1">Completed on {achievement.date}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;