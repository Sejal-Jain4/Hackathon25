import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUserProfile } from '../utils/mockDataService';
import { FaPlus, FaCoins, FaPiggyBank, FaChartLine, FaUpload, FaSpinner } from 'react-icons/fa';

const GoalsPage = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Only load username on mount, financial data is loaded on user action
  useEffect(() => {
    // Nothing to load automatically
  }, []);
  
  // Function to simulate uploading financial data - shared with HomePage
  const handleUploadData = () => {
    setUploading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const profile = getUserProfile();
      setUserProfile(profile);
      setDataLoaded(true);
      setUploading(false);
    }, 1500); // 1.5 second simulated loading time
  };
  
  // Empty dashboard with placeholders - matches HomePage pattern
  const renderEmptyGoals = () => (
    <>
      {/* Savings Goals Card - Empty state */}
      <motion.div 
        className="bg-dark-800 rounded-xl shadow-xl p-6 mb-6 border border-dark-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <FaPiggyBank className="h-6 w-6 text-gray-600 mr-3" />
          <h2 className="text-xl font-bold text-white">Savings Goals</h2>
        </div>
        
        <div className="space-y-6">
          {/* Multiple empty goal placeholders */}
          {[...Array(3)].map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="bg-dark-700 h-5 w-32 rounded animate-pulse mb-1"></div>
                  <div className="bg-dark-700 h-3 w-24 rounded animate-pulse"></div>
                </div>
                <div className="bg-dark-700 h-5 w-24 rounded animate-pulse"></div>
              </div>
              <div className="w-full bg-dark-600 rounded-full h-3">
                <div className="bg-dark-700 h-3 rounded-full w-0"></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Budget Limits Card - Empty state */}
      <motion.div 
        className="bg-dark-800 rounded-xl shadow-xl p-6 mb-6 border border-dark-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center mb-6">
          <FaChartLine className="h-6 w-6 text-gray-600 mr-3" />
          <h2 className="text-xl font-bold text-white">Budget Limits</h2>
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <div className="bg-dark-700 h-5 w-32 rounded animate-pulse"></div>
                <div className="bg-dark-700 h-5 w-24 rounded animate-pulse"></div>
              </div>
              <div className="w-full bg-dark-600 rounded-full h-3">
                <div className="bg-dark-700 h-3 rounded-full w-0"></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );

  // Dashboard with real data
  const renderLoadedGoals = () => {
    // Create savings goals array matching the HomePage structure
    const savingsGoals = [
      userProfile.savingsGoal,
      { 
        name: 'New Car Fund', 
        target: 15000, 
        current: 3500,
        milestone: 'Save $5000',
        category: 'Vehicle',
        deadline: '2027-06-15'
      },
      { 
        name: 'Home Down Payment', 
        target: 25000, 
        current: 2000,
        milestone: 'Save $5000',
        category: 'Housing',
        deadline: '2028-01-20'
      }
    ];
    
    // Calculate budget limits data for display
    const budgetLimits = [
      {
        category: 'Monthly Food',
        spent: 160,
        limit: 200,
        usedPercentage: 80,
        status: 'warning' // warning when over 70%
      },
      {
        category: 'Entertainment',
        spent: 45,
        limit: 100,
        usedPercentage: 45,
        status: 'success' // success when under 50%
      },
      {
        category: 'Transportation',
        spent: 110,
        limit: 120,
        usedPercentage: 92,
        status: 'error' // error when over 90%
      }
    ];
    
    return (
      <>
        {/* Savings Goals Section */}
        <motion.div 
          className="bg-dark-800 rounded-xl shadow-xl p-6 mb-6 border border-dark-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <FaPiggyBank className="h-6 w-6 text-accent-400 mr-3" />
              <h2 className="text-xl font-bold bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">
                Savings Goals
              </h2>
            </div>
            <motion.button 
              className="bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus className="mr-2" /> New Goal
            </motion.button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savingsGoals.map((goal, index) => (
              <motion.div 
                key={index} 
                className="bg-dark-700 rounded-lg p-5 border border-dark-600 hover:border-accent-500 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-bold text-white text-lg">{goal.name}</h3>
                    <p className="text-xs text-gray-400">
                      Next milestone: {goal.milestone || userProfile.nextMilestone.name}
                    </p>
                  </div>
                  <div className="bg-dark-600 text-accent-400 text-xs px-3 py-1 rounded-full font-medium">
                    {goal.category || 'Savings'}
                  </div>
                </div>
                
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Current</p>
                    <p className="text-lg font-bold text-white">${goal.current}</p>
                  </div>
                  <div className="text-2xl text-gray-600 font-light">
                    /
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">Target</p>
                    <p className="text-lg font-bold text-white">${goal.target}</p>
                  </div>
                </div>
                
                <div className="w-full bg-dark-600 rounded-full h-3 mb-2">
                  <motion.div 
                    className="bg-gradient-to-r from-accent-500 to-primary-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((goal.current / goal.target) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 + (index * 0.2) }}
                  ></motion.div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-400 mb-4">
                  <span>
                    {goal.deadline 
                      ? `Due by ${new Date(goal.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}` 
                      : 'No deadline'}
                  </span>
                  <span className="font-medium text-accent-400">
                    {Math.round((goal.current / goal.target) * 100)}%
                  </span>
                </div>
                
                <motion.button 
                  className="w-full bg-dark-600 hover:bg-dark-500 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaCoins className="mr-2" /> Add Funds
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Budget Limits Section */}
        <motion.div 
          className="bg-dark-800 rounded-xl shadow-xl p-6 mb-6 border border-dark-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center mb-6">
            <FaChartLine className="h-6 w-6 text-secondary-400 mr-3" />
            <h2 className="text-xl font-bold bg-gradient-to-r from-secondary-400 to-primary-400 bg-clip-text text-transparent">
              Budget Limits
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {budgetLimits.map((budget, index) => (
              <motion.div 
                key={index}
                className="bg-dark-700 rounded-lg p-5 border border-dark-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + (0.1 * index) }}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-white text-lg">{budget.category}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium
                    ${budget.status === 'success' ? 'text-success bg-success bg-opacity-20' : 
                      budget.status === 'warning' ? 'text-warning bg-warning bg-opacity-20' : 
                      'text-error bg-error bg-opacity-20'}`}>
                    {budget.usedPercentage}% used
                  </span>
                </div>
                
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">${budget.spent} spent</span>
                  <span className="text-gray-400">Limit: ${budget.limit}</span>
                </div>
                
                <div className="w-full bg-dark-600 rounded-full h-3">
                  <motion.div 
                    className={`h-3 rounded-full
                      ${budget.status === 'success' ? 'bg-success' : 
                        budget.status === 'warning' ? 'bg-warning' : 
                        'bg-error'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${budget.usedPercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 + (index * 0.2) }}
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </>
    );
  };
  
  return (
    <div className="pb-16 bg-dark-900 min-h-screen">
      <div className="bg-dark-800 px-6 py-4 shadow-md border-b border-dark-700">
        <h1 className="text-2xl font-bold text-white">My Goals</h1>
      </div>
      
      <div className="p-4">
        {/* Conditionally render empty or loaded content */}
        {!dataLoaded ? renderEmptyGoals() : renderLoadedGoals()}
        
        {/* Upload/Refresh Data Button - shown on both empty and loaded states */}
        <div className="fixed bottom-24 right-6">
          <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 1
            }}
          >
            <button 
              className="bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl"
              onClick={handleUploadData}
              disabled={uploading}
            >
              {uploading ? (
                <FaSpinner className="h-8 w-8 animate-spin" />
              ) : (
                <FaUpload className="h-7 w-7" />
              )}
            </button>
            <p className="text-xs text-center mt-2 text-gray-400">
              {dataLoaded ? "Refresh Data" : "Upload Data"}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;