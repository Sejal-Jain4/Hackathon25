import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import { getUserProfile, getUsername } from '../utils/mockDataService';
import { FaUpload, FaSpinner } from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load user name on component mount, but not financial data yet
  useEffect(() => {
    const name = getUsername();
    setUsername(name);
  }, []);
  
  // Function to simulate uploading financial data
  const handleUploadData = () => {
    setUploading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const profile = getUserProfile();
      setUserProfile(profile);
      
      // Calculate total balance
      const totalExpenses = profile.expenses.reduce((sum, expense) => sum + expense.amount, 0);
      let incomeAmount = profile.income.amount;
      
      // Convert to monthly equivalent for consistency
      if (profile.income.frequency === 'weekly') {
        incomeAmount = incomeAmount * 4;
      } else if (profile.income.frequency === 'bi-weekly') {
        incomeAmount = incomeAmount * 2;
      }
      
      setBalance(incomeAmount - totalExpenses);
      setDataLoaded(true);
      setUploading(false);
    }, 1500); // 1.5 second simulated loading time
  };  return (
    <div className="pb-16 bg-dark-900 min-h-screen">
      <Header title={`Welcome${username ? ', ' + username : '!'}`} />
      
      <div className="p-4">
        {!dataLoaded ? (
          // Empty state - no financial data yet
          <motion.div
            className="flex flex-col items-center justify-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-dark-800 rounded-xl shadow-xl p-8 border border-dark-700 mb-8 text-center max-w-md">
              <motion.div
                className="bg-dark-700 rounded-full p-4 mx-auto mb-6 w-20 h-20 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                <FaUpload className="text-accent-400 text-3xl" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-white mb-3">Connect Your Finances</h2>
              <p className="text-gray-400 mb-6">
                Upload your financial data to get personalized insights, track your spending, and reach your goals faster.
              </p>
              
              <motion.button
                onClick={handleUploadData}
                disabled={uploading}
                className="bg-gradient-to-r from-accent-500 to-secondary-500 hover:from-accent-600 hover:to-secondary-600 text-white font-medium py-3 px-6 rounded-lg shadow-lg flex items-center justify-center w-full"
                whileHover={{ scale: uploading ? 1 : 1.02 }}
                whileTap={{ scale: uploading ? 1 : 0.98 }}
              >
                {uploading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> 
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaUpload className="mr-2" /> 
                    Upload Financial Data
                  </>
                )}
              </motion.button>
              
              <p className="text-xs text-gray-500 mt-4">
                Your data is encrypted and secure. We never share your financial information.
              </p>
            </div>
            
            {/* Empty state placeholders */}
            <div className="w-full space-y-4">
              <div className="h-32 bg-dark-800 rounded-xl shadow-lg animate-pulse"></div>
              <div className="h-48 bg-dark-800 rounded-xl shadow-lg animate-pulse"></div>
              <div className="h-32 bg-dark-800 rounded-xl shadow-lg animate-pulse"></div>
            </div>
          </motion.div>
        ) : (
          // Data loaded state - show financial information
          <>
            <motion.div 
              className="bg-dark-800 rounded-xl shadow-xl p-6 mb-6 border border-dark-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-gray-400 font-medium">Monthly Balance</h2>
                  <p className="text-3xl font-bold bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">
                    ${balance.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Last updated today</p>
                </div>
                <div className="bg-dark-700 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-dark-700 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">Income</p>
                  <p className="text-xl font-semibold text-primary-400">
                    ${userProfile.income.amount}
                    <span className="text-xs text-gray-500 ml-1">/{userProfile.income.frequency}</span>
                  </p>
                </div>
                <div className="bg-dark-700 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">Expenses</p>
                  <p className="text-xl font-semibold text-secondary-400">
                    ${userProfile.expenses.reduce((sum, expense) => sum + expense.amount, 0)}
                    <span className="text-xs text-gray-500 ml-1">/month</span>
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-dark-800 rounded-xl shadow-xl p-6 mb-6 border border-dark-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {userProfile.expenses.slice(0, 3).map((expense, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-dark-600 pb-3">
                    <div>
                      <p className="font-medium text-white">{expense.category}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(Date.now() - (index * 2 * 86400000)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <p className="text-error font-medium">-${expense.amount.toFixed(2)}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-white">{userProfile.income.source}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(Date.now() - (6 * 86400000)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <p className="text-success font-medium">+${userProfile.income.amount.toFixed(2)}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-dark-800 rounded-xl shadow-xl p-6 mb-6 border border-dark-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-white mb-4">Savings Goal</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-medium text-white">{userProfile.savingsGoal.name}</p>
                      <p className="text-xs text-gray-500">
                        Next milestone: {userProfile.nextMilestone.name}
                      </p>
                    </div>
                    <p className="text-accent-400 font-medium">
                      ${userProfile.savingsGoal.current}/${userProfile.savingsGoal.target}
                    </p>
                  </div>
                  <div className="w-full bg-dark-600 rounded-full h-3">
                    <motion.div 
                      className="bg-gradient-to-r from-accent-500 to-primary-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(userProfile.savingsGoal.current / userProfile.savingsGoal.target) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    ></motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Next Milestone / Achievement */}
            <motion.div 
              className="bg-dark-800 rounded-xl shadow-xl p-6 mb-6 border border-dark-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-secondary-500 to-accent-500 p-1 rounded-full">
                  <div className="bg-dark-800 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-white">Your Next Achievement</h3>
                  <p className="text-sm text-gray-400">{userProfile.nextMilestone.reward}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
        
        {/* Button Group */}
        <div className="fixed bottom-24 right-6 space-y-4">
          {/* AI Coach Button */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.8
            }}
          >
            <button 
              className="bg-gradient-to-r from-accent-500 to-secondary-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl"
              onClick={() => navigate('/coach')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <p className="text-xs text-center mt-2 text-gray-400">AI Coach</p>
          </motion.div>
          
          {/* Upload/Refresh Data Button - only shown if data is already loaded */}
          {dataLoaded && (
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
              <p className="text-xs text-center mt-2 text-gray-400">Update Data</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;