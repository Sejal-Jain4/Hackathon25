import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import { 
  Card, 
  SmallCard, 
  AchievementCard,
  AchievementCelebration,
  SavingsGoalCelebration
} from '../components/ui';
import { 
  getCompleteUserData, 
  saveFinancialData,
  getUsername,
  getAchievements,
  recordSectionExplored,
  checkAchievementsProgress,
  addIncome,
  addExpense,
  addSavingsGoal,
  updateSavingsGoal,
  isDataLoaded,
  clearDataLoadState
} from '../utils/dataService';
import { 
  FaUpload, 
  FaSpinner, 
  FaCommentDots, 
  FaMoneyBillWave, 
  FaPlus
} from 'react-icons/fa';
import { BsDash } from 'react-icons/bs';
import piggyBank from '../assets/piggy.png';
import Confetti from 'react-confetti';
import WelcomePopup from '../components/chatbot/WelcomePopup';
import ChatbotModal from '../components/chatbot/ChatbotModal';
import FinancialEntryForm from '../components/FinancialEntryForm';
import '../components/chatbot/ChatDot.css';
import '../styles/FinancialEntry.css';
import '../styles/FloatingMenu.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [completedAchievement, setCompletedAchievement] = useState(null);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [questionnaire, setQuestionnaire] = useState(null);
  const [activeForm, setActiveForm] = useState(null);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [completedGoal, setCompletedGoal] = useState(null); // Track goals that hit 100%
  const menuRef = useRef(null);  // Can be string ('income', 'expense', 'savings') or object ({type: 'expense', index: 0})

  // Load user data on component mount
  useEffect(() => {
    // Always get user data from enhanced data service for questionnaire and profile info
    const data = getCompleteUserData();
    setUserData(data);
    
    // Use getUsername to get the username directly from localStorage
    setUsername(getUsername());
    
    // Check if data has been loaded before (from localStorage)
    // This allows data to persist when navigating between tabs
    // ONLY if the user has explicitly clicked "Upload Data" button
    const dataLoaded = isDataLoaded();
    setDataLoaded(dataLoaded);
    
    // Check for questionnaire responses (needed for the welcome popup)
    if (data.questionnaire) {
      setQuestionnaire(data.questionnaire);
      // Show welcome popup if this is the first time after completing questionnaire
      if (localStorage.getItem('centsi_welcome_shown') !== 'true') {
        setShowWelcomePopup(true);
        
        // If coming from login/questionnaire, ensure data is not pre-loaded
        clearDataLoadState();
      }
    }
    
    // Only check achievements if data has been loaded by user clicking upload
    if (dataLoaded) {
      checkAchievementsProgress();
    }
    
    // Add event listener to close menu when clicking outside
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuExpanded(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle form submissions for financial entries
  const handleFormSubmit = (formData) => {
    let updatedData;
    let newlyCompleted = null;
    
    // Check if activeForm is an object with type and index (for editing)
    if (activeForm && typeof activeForm === 'object') {
      const { type, index } = activeForm;
      
      if (type === 'expense') {
        updatedData = saveFinancialData({
          ...userData.finances,
          expenses: userData.finances.expenses.map((expense, i) => 
            i === index ? formData : expense
          )
        });
      } else if (type === 'savings') {
        // Use updateSavingsGoal to handle achievement checking
        const result = updateSavingsGoal(index, formData);
        updatedData = result.financialData;
        newlyCompleted = result.newlyCompleted;
      }
    } else {
      // Handle new entries with achievement checks
      switch(activeForm) {
        case 'income': {
          const result = addIncome(formData);
          updatedData = result.financialData;
          newlyCompleted = result.newlyCompleted;
          break;
        }
        case 'expense': {
          const result = addExpense(formData);
          updatedData = result.financialData;
          newlyCompleted = result.newlyCompleted;
          break;
        }
        case 'savings': {
          const result = addSavingsGoal(formData);
          updatedData = result.financialData;
          newlyCompleted = result.newlyCompleted;
          break;
        }
      }
    }
    
    // Update user data if we got updated data back
    if (updatedData) {
      setUserData({
        ...userData,
        finances: updatedData
      });
      
      // Check if an achievement was newly completed
      if (newlyCompleted) {
        setCompletedAchievement(newlyCompleted);
      }
    }
    
    // Close the form
    setActiveForm(null);
  };
  
  // Function to simulate uploading financial data
  const handleUploadData = () => {
    setUploading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setDataLoaded(true);
      setUploading(false);
      
      // Store both flags in localStorage to persist across navigation
      // Using consistent constants from dataService
      localStorage.setItem('centsi_data_uploaded', 'true');
      localStorage.setItem('centsi_data_loaded', 'true');
      
      // Update the data in context/state
      const data = getCompleteUserData();
      setUserData(data);
      
      // Check for achievement progress after data is loaded
      const result = checkAchievementsProgress();
      
      // If any achievements were newly completed, show notification
      if (result.newlyCompletedAchievements.length > 0) {
        // Show the first completed achievement
        setCompletedAchievement(result.newlyCompletedAchievements[0]);
        
        // If there are more, queue them up to show after the first one closes
        if (result.newlyCompletedAchievements.length > 1) {
          setTimeout(() => {
            setCompletedAchievement(result.newlyCompletedAchievements[1]);
          }, 6000); // Show second achievement after 6 seconds
        }
      }
    }, 1500); // 1.5 second simulated loading time
  };
  
  // Dashboard with placeholder content (same layout as loaded state but with placeholders)
  const renderPlaceholderDashboard = () => {
    // Create placeholder data structure similar to loaded state
    const placeholderFinances = {
      totalBalance: 0,
      income: {
        amount: 0,
        frequency: "monthly",
        source: "Not specified"
      },
      expenses: [],
      savingsGoals: []
    };
    
    return (
    <>
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Monthly Balance</h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">
              $0.00
            </p>
            <p className="text-sm text-gray-500 mt-1">Upload to view data</p>
          </div>
          <div className="bg-dark-700 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        <div className="mt-4">
          <Card className="mb-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Income</p>
                <p className="text-xl font-semibold text-primary-400">
                  $0.00
                  <span className="text-xs text-gray-500 ml-1">/monthly</span>
                </p>
                <p className="text-xs text-gray-500">Source: Not specified</p>
              </div>
              <button 
                disabled={!dataLoaded}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg px-3 py-1 text-sm transition-colors flex items-center shadow-md opacity-50 cursor-not-allowed"
              >
                <FaPlus className="mr-1" size={10} /> Adjust
              </button>
            </div>
          </Card>
          
          <Card>
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-gray-400 text-sm">Expenses</p>
                <p className="text-xl font-semibold text-secondary-400">
                  $0.00
                  <span className="text-xs text-gray-500 ml-1">/month</span>
                </p>
                <p className="text-xs text-gray-500">0 expense categories</p>
              </div>
              <button 
                disabled={!dataLoaded}
                className="bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white rounded-lg px-3 py-1 text-sm transition-colors flex items-center shadow-md opacity-50 cursor-not-allowed"
              >
                <FaPlus className="mr-1" size={10} /> Add
              </button>
            </div>
            
            <div className="text-center py-4">
              <p className="text-gray-400">No expenses recorded yet</p>
              <button 
                disabled={!dataLoaded}
                className="mt-2 px-4 py-2 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white rounded-lg shadow-md transition-colors opacity-50 cursor-not-allowed"
              >
                Add an expense
              </button>
            </div>
          </Card>
        </div>
      </Card>
      
      {/* Savings Goals Card */}
      <Card className="mb-6" delay={0.1}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Savings Goals</h2>
          <button 
            disabled={!dataLoaded}
            className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-full p-2 transition-colors shadow-md opacity-50 cursor-not-allowed"
          >
            <FaPlus />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="text-center py-4">
            <p className="text-gray-400">No savings goals yet</p>
            <button 
              disabled={!dataLoaded}
              className="mt-2 px-4 py-2 bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600 text-white rounded-lg shadow-md transition-colors opacity-50 cursor-not-allowed"
            >
              Add a goal
            </button>
          </div>
        </div>
      </Card>
      
      {/* Recent Activity Card */}
      <Card className="mb-6" delay={0.2}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          <button 
            disabled={!dataLoaded}
            className="bg-dark-700 hover:bg-dark-600 text-white rounded-full p-2 transition-colors opacity-50 cursor-not-allowed"
          >
            <FaPlus />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="text-center py-4">
            <p className="text-gray-400">No activities recorded yet</p>
            <p className="text-xs text-gray-500 mt-2">Upload data to view your financial activity</p>
          </div>
        </div>
      </Card>
    </>
    );
  };

  // Dashboard with real data
  const renderLoadedDashboard = () => {
    const finances = userData.finances;
    
    // Mark the dashboard sections as explored for the Financial Explorer achievement
    recordSectionExplored('income');
    recordSectionExplored('expenses');
    recordSectionExplored('savings');
    
    return (
    <>
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Monthly Balance</h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">
              ${(finances.income.amount - finances.expenses.reduce((sum, expense) => sum + expense.amount, 0) - finances.savingsGoals.reduce((sum, goal) => sum + goal.current, 0)).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Last updated today</p>
          </div>
          <div className="bg-dark-700 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        <div className="mt-4">
          <Card className="mb-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Income</p>
                <p className="text-xl font-semibold text-primary-400">
                  ${finances.income.amount}
                  <span className="text-xs text-gray-500 ml-1">/{finances.income.frequency}</span>
                </p>
                <p className="text-xs text-gray-500">Source: {finances.income.source || 'Not specified'}</p>
              </div>
              <button 
                onClick={() => setActiveForm('income')}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg px-3 py-1 text-sm transition-colors flex items-center shadow-md"
              >
                <FaPlus className="mr-1" size={10} /> Adjust
              </button>
            </div>
          </Card>
          
          <Card>
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-gray-400 text-sm">Expenses</p>
                <p className="text-xl font-semibold text-secondary-400">
                  ${finances.expenses.reduce((sum, expense) => sum + expense.amount, 0)}
                  <span className="text-xs text-gray-500 ml-1">/month</span>
                </p>
                <p className="text-xs text-gray-500">{finances.expenses.length} expense categories</p>
              </div>
              <button 
                onClick={() => setActiveForm('expense')}
                className="bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white rounded-lg px-3 py-1 text-sm transition-colors flex items-center shadow-md"
              >
                <FaPlus className="mr-1" size={10} /> Add
              </button>
            </div>
            
            {finances.expenses.length > 0 && (
              <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                {finances.expenses.map((expense, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-dark-700 rounded">
                    <div>
                      <p className="text-sm font-medium text-white">{expense.name}</p>
                      <p className="text-xs text-gray-500">{expense.category}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-secondary-400 font-medium mr-3">
                        ${expense.amount}
                        <span className="text-xs text-gray-500">/{expense.frequency || 'month'}</span>
                      </p>
                      <button 
                        onClick={() => setActiveForm({ type: 'expense', index: index })}
                        className="bg-gradient-to-r from-dark-600 to-dark-500 hover:from-dark-500 hover:to-dark-400 text-white rounded px-2 py-1 text-xs transition-colors mr-1 shadow-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => {
                          const updatedData = {
                            ...userData.finances,
                            expenses: userData.finances.expenses.filter((_, i) => i !== index)
                          };
                          const savedData = saveFinancialData(updatedData);
                          setUserData({
                            ...userData,
                            finances: savedData
                          });
                        }}
                        className="bg-gradient-to-r from-secondary-700 to-secondary-800 hover:from-secondary-800 hover:to-secondary-900 text-white rounded px-2 py-1 text-xs transition-colors shadow-sm"
                      >
                        <BsDash size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {finances.expenses.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-400">No expenses recorded yet</p>
                <button 
                  onClick={() => setActiveForm('expense')}
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white rounded-lg shadow-md transition-colors"
                >
                  Add an expense
                </button>
              </div>
            )}
          </Card>
        </div>
      </Card>
      
      {/* Savings Goals Card */}
      <Card className="mb-6" delay={0.1}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Savings Goals</h2>
          <button 
            onClick={() => setActiveForm('savings')}
            className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-full p-2 transition-colors shadow-md"
          >
            <FaPlus />
          </button>
        </div>
        
        <div className="space-y-6">
          {finances.savingsGoals.map((goal, index) => {
            // Calculate progress percentage
            const progressPercentage = Math.min(100, (goal.current / goal.target) * 100);
            const isComplete = progressPercentage >= 100;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <p className="font-medium text-white">{goal.name}</p>
                    <p className="text-xs text-gray-500">
                      {goal.deadline ? `Target date: ${new Date(goal.deadline).toLocaleDateString()}` : 'Ongoing goal'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-accent-400 font-medium mr-3">
                      ${goal.current}/${goal.target} {isComplete && '✓'}
                    </p>
                    <button 
                      onClick={() => setActiveForm({ type: 'savings', index: index })}
                      className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-lg px-3 py-1 text-sm transition-colors shadow-sm mr-1"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        const updatedData = {
                          ...userData.finances,
                          savingsGoals: userData.finances.savingsGoals.filter((_, i) => i !== index)
                        };
                        const savedData = saveFinancialData(updatedData);
                        setUserData({
                          ...userData,
                          finances: savedData
                        });
                      }}
                      className="bg-gradient-to-r from-accent-700 to-accent-800 hover:from-accent-800 hover:to-accent-900 text-white rounded px-2 py-1 text-xs transition-colors shadow-sm"
                    >
                      <BsDash size={12} />
                    </button>
                  </div>
                </div>
                <div className="w-full bg-dark-600 rounded-full h-3 relative">
                  {/* Progress bar animation */}
                  <motion.div 
                    className={`bg-gradient-to-r ${isComplete ? 'from-green-500 to-accent-500' : 'from-accent-500 to-primary-500'} h-3 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 + (index * 0.2) }}
                    onAnimationComplete={() => {
                      // Check if goal just hit 100% (completed)
                      // This will trigger only once when the animation finishes at 100%
                      if (isComplete && goal.current === goal.target) {
                        // Check if this goal's completion celebration has already been shown
                        const celebratedGoals = JSON.parse(localStorage.getItem('centsi_celebrated_goals') || '[]');
                        const goalId = goal.id || `${goal.name}_${goal.target}`;
                        
                        // Only show celebration if this goal hasn't been celebrated before
                        if (!celebratedGoals.includes(goalId)) {
                          // Add this goal to the celebrated goals list
                          celebratedGoals.push(goalId);
                          localStorage.setItem('centsi_celebrated_goals', JSON.stringify(celebratedGoals));
                          
                          // Set the completed goal to trigger celebration
                          setCompletedGoal(goal);
                        }
                      }
                    }}
                  />
                </div>
              </div>
            );
          })}
          
          {finances.savingsGoals.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-400">No savings goals yet</p>
              <button 
                onClick={() => setActiveForm('savings')}
                className="mt-2 px-4 py-2 bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600 text-white rounded-lg shadow-md transition-colors"
              >
                Add a goal
              </button>
            </div>
          )}
        </div>
      </Card>
      
      {/* Recent Activity Card */}
      <Card className="mb-6" delay={0.2}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          <button 
            onClick={() => setActiveForm('expense')}
            className="bg-dark-700 hover:bg-dark-600 text-white rounded-full p-2 transition-colors"
          >
            <FaPlus />
          </button>
        </div>
        
        <div className="space-y-4">
          {finances.expenses.slice(0, 3).map((expense, index) => (
            <div key={index} className="flex justify-between items-center border-b border-dark-600 pb-3">
              <div>
                <p className="font-medium text-white">{expense.name || expense.category}</p>
                <p className="text-xs text-gray-500">
                  {new Date(Date.now() - (index * 2 * 86400000)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <p className="text-error font-medium">-${expense.amount.toFixed(2)}</p>
            </div>
          ))}
          
          {finances.expenses.length > 0 && (
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-white">{finances.income.source}</p>
                <p className="text-xs text-gray-500">
                  {new Date(Date.now() - (6 * 86400000)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <p className="text-success font-medium">+${finances.income.amount.toFixed(2)}</p>
            </div>
          )}
          
          {finances.expenses.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-400">No expenses recorded yet</p>
              <button 
                onClick={() => setActiveForm('expense')}
                className="mt-2 px-4 py-2 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white rounded-lg shadow-md transition-colors"
              >
                Add an expense
              </button>
            </div>
          )}
        </div>
      </Card>
    </>
  );
  };
  
  // Top stats cards for placeholder state (similar to loaded but with placeholders)
  const renderPlaceholderTopCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {/* Monthly Savings Card */}
        <motion.div 
          className="bg-dark-800 rounded-xl shadow-xl overflow-hidden border border-dark-700 flex flex-col h-[250px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-5 flex flex-col flex-grow">
            <h2 className="text-lg font-bold text-white mb-2">Monthly Savings</h2>
            <div className="flex items-center mb-3">
              <span className="text-2xl font-bold text-accent-400">$0.00</span>
              <span className="text-sm text-gray-500 ml-2">/ $0.00</span>
              <span className="text-xs text-accent-300 ml-2">(0% saved)</span>
            </div>
            
            <div className="w-full flex flex-col items-center justify-center flex-grow">
              <div className="w-36 h-32 relative">
                <img 
                  src={piggyBank} 
                  alt="Piggy Bank Outline" 
                  className="w-full h-full object-contain"
                  style={{ filter: "brightness(0) invert(1) drop-shadow(0 0 2px white)" }}
                />
                
                {/* Piggy bank outline with animated pulsing effect for placeholder */}
                <div 
                  className="absolute inset-0" 
                  style={{
                    maskImage: `url(${piggyBank})`,
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskImage: `url(${piggyBank})`,
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                  }}
                >
                  {/* Animated pulsing effect for placeholder */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-accent-600/20 to-primary-500/20"
                    animate={{ 
                      opacity: [0.15, 0.35, 0.15],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse" 
                    }}
                  ></motion.div>
                  
                  {/* Outline glow effect with stronger highlight */}
                  <div className="absolute inset-0 bg-primary-400/40"></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">Upload data to track savings</p>
            </div>
          </div>
        </motion.div>

        {/* Next Achievement Card */}
        <motion.div 
          className="bg-dark-800 rounded-xl shadow-xl overflow-hidden border border-dark-700 flex flex-col h-[250px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="p-5 flex flex-col flex-grow">
            <h2 className="text-lg font-bold text-white mb-2">Next Achievement</h2>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-700 rounded-full flex items-center justify-center">
                <span className="text-xl">🎯</span>
              </div>
              <div>
                <p className="font-medium text-white">Budget Master</p>
                <p className="text-xs text-gray-500">Created your first budget</p>
              </div>
            </div>
            
            <div className="flex flex-col justify-center flex-grow mt-11">
              <div className="w-full bg-dark-600 rounded-lg h-12 relative overflow-hidden">
                <div className="bg-dark-700 h-12 w-0"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-500 font-medium">Upload to view</span>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">Upload to unlock achievements</p>
            </div>
          </div>
        </motion.div>

        {/* Budget Remaining Card */}
        <motion.div 
          className="bg-dark-800 rounded-xl shadow-xl overflow-hidden border border-dark-700 flex flex-col h-[250px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="p-5 flex flex-col flex-grow">
            <h2 className="text-lg font-bold text-white mb-2">Budget Remaining</h2>
            <div className="flex items-center mb-3">
              <span className="text-2xl font-bold text-accent-400">$0.00</span>
              <span className="text-sm text-gray-500 ml-2">/ $0.00</span>
            </div>
            
            <div className="flex flex-col justify-center flex-grow mt-4">
              <div className="w-full rounded-lg bg-dark-600 h-12 relative overflow-hidden">
                <div className="flex h-full w-full">
                  {[...Array(10)].map((_, index) => (
                    <div
                      key={index}
                      className="h-full flex-1 mx-0.5 bg-dark-700"
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">Upload to view budget</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // Top stats cards for loaded state
  const renderLoadedTopCards = () => {
    // Get key financial data
    const monthlyIncome = userData.finances.income.amount;
    const monthlyExpenses = userData.finances.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate total savings goal contributions
    const totalSavingsContributions = userData.finances.savingsGoals.reduce((sum, goal) => sum + goal.current, 0);
    
    // Calculate monthly balance: income - expenses - savings
    const monthlyBalance = monthlyIncome - monthlyExpenses - totalSavingsContributions;
    
    // Budget remaining is the same as monthly balance
    const budgetRemaining = monthlyBalance;
    const monthlyBudget = monthlyIncome; // Total available budget is income
    const budgetPercentage = Math.min(Math.round((budgetRemaining / monthlyBudget) * 100), 100);
    
    // Calculate savings values
    // Monthly savings target is 30% of income after expenses
    const availableForSavings = Math.max(0, monthlyIncome - monthlyExpenses);
    const monthlySavingsTarget = Math.max(availableForSavings * 0.30, 1); // At least $1 to avoid division by zero
    const savingsPercentage = Math.min(Math.round((totalSavingsContributions / monthlySavingsTarget) * 100), 100);

    // Get achievements from data service
    const achievementsResult = checkAchievementsProgress();
    const achievements = achievementsResult.achievements;
    
    // Next achievement (we'll pick the first incomplete one or the one with the highest progress)
    const incompleteAchievements = achievements.filter(a => a.status !== 'completed');
    const nextAchievement = incompleteAchievements.length > 0 
      ? incompleteAchievements.sort((a, b) => b.progress - a.progress)[0] 
      : achievements[0]; // if all complete, show the first one

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {/* Monthly Savings Card */}
        <motion.div 
          className="bg-dark-800 rounded-xl shadow-xl overflow-hidden border border-dark-700 flex flex-col h-[250px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-5 flex flex-col flex-grow">
            <h2 className="text-lg font-bold text-white mb-2">Monthly Savings</h2>
            <div className="flex items-center mb-3">
              <span className="text-2xl font-bold text-accent-400">${totalSavingsContributions.toFixed(2)}</span>
              <span className="text-sm text-gray-500 ml-2">/ ${monthlySavingsTarget.toFixed(2)}</span>
              <span className="text-xs text-accent-300 ml-2">({savingsPercentage}% saved)</span>
            </div>
            
            <div className="w-full flex flex-col items-center justify-center flex-grow">
              <div className="w-36 h-32 relative">
                <img 
                  src={piggyBank} 
                  alt="Piggy Bank Outline" 
                  className="w-full h-full object-contain"
                  style={{ filter: "brightness(0) invert(1) drop-shadow(0 0 2px white)" }}
                />
                
                {/* Piggy bank outline with vertical fill based on savings percentage */}
                <div 
                  className="absolute inset-0" 
                  style={{
                    maskImage: `url(${piggyBank})`,
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskImage: `url(${piggyBank})`,
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                  }}
                >
                  {/* Fill effect with stronger blue gradient that grows from bottom based on savings percentage */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-accent-600 to-primary-500"
                    initial={{ y: '100%' }}
                    animate={{ y: `${Math.max(0, 100 - savingsPercentage)}%` }}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                    style={{ opacity: 0.85 }}
                  ></motion.div>
                  
                  {/* Outline glow effect with stronger highlight */}
                  <div className="absolute inset-0 bg-primary-400/40"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Achievement Card */}
        <motion.div 
          className="bg-dark-800 rounded-xl shadow-xl overflow-hidden border border-dark-700 flex flex-col h-[250px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="p-5 flex flex-col flex-grow">
            <h2 className="text-lg font-bold text-white mb-2">Next Achievement</h2>
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${nextAchievement.color} rounded-full flex items-center justify-center`}>
                <span className="text-xl">{nextAchievement.icon}</span>
              </div>
              <div>
                <p className="font-medium text-white">{nextAchievement.name}</p>
                <p className="text-xs text-gray-500">{nextAchievement.description}</p>
              </div>
            </div>
            
            <div className="flex flex-col justify-center flex-grow mt-11">
              <div className="w-full bg-dark-600 rounded-lg h-12 relative overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-accent-500 to-primary-500 h-12"
                  initial={{ width: 0 }}
                  animate={{ width: `${nextAchievement.progress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                ></motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-medium">{nextAchievement.progress}% Complete</span>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">Keep going to unlock this achievement!</p>
            </div>
          </div>
        </motion.div>

        {/* Budget Remaining Card */}
        <motion.div 
          className="bg-dark-800 rounded-xl shadow-xl overflow-hidden border border-dark-700 flex flex-col h-[250px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="p-5 flex flex-col flex-grow">
            <h2 className="text-lg font-bold text-white mb-2">Budget Remaining</h2>
            <div className="flex items-center mb-3">
              <span className="text-2xl font-bold text-accent-400">${monthlyBalance.toFixed(2)}</span>
              <span className="text-sm text-gray-500 ml-2">/ ${monthlyBudget.toFixed(2)}</span>
            </div>
            
            <div className="flex flex-col justify-center flex-grow mt-4">
              <div className="w-full rounded-lg bg-dark-600 h-12 relative overflow-hidden">
                <div className="flex h-full w-full">
                  {[...Array(10)].map((_, index) => {
                    // Calculate if this segment should be filled
                    const segmentValue = index * 10; // 0, 10, 20, ... 90
                    const isFilled = budgetPercentage >= segmentValue;
                    
                    return (
                      <motion.div
                        key={index}
                        className={`h-full flex-1 mx-0.5 ${isFilled ? 'bg-gradient-to-r from-accent-500 to-primary-500' : 'bg-dark-700'}`}
                        initial={{ opacity: isFilled ? 0 : 1 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                      />
                    );
                  })}
                </div>
                
                {/* Removed overlay text as requested */}
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">{budgetPercentage}% of budget remaining</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // Achievement cards for placeholder state
  const renderPlaceholderAchievements = () => (
    <div className="mb-6">
      <Card gradientBorder delay={0.1}>
        <div className="p-4">
          <h2 className="text-2xl font-bold text-white mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Achievements
          </h2>
          
          <div className="overflow-x-auto pb-2">
            <div className="flex space-x-4">
              {[...Array(4)].map((_, index) => (
                <div 
                  key={index} 
                  className="flex-none w-48 p-3 bg-dark-800 rounded-lg border border-dark-600 shadow-md"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dark-600 to-dark-500 flex items-center justify-center mr-3">
                      <span className="text-xl opacity-50">?</span>
                    </div>
                    <div>
                      <p className="text-gray-300 font-medium">???</p>
                      <p className="text-xs text-gray-500">Upload to unlock</p>
                    </div>
                  </div>
                  <div className="w-full bg-dark-600 rounded-full h-2 mt-3">
                    <div className="bg-dark-700 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  // Achievement cards for loaded state
  const renderLoadedAchievements = () => {
    // Get achievements from data service
    const achievements = getAchievements();
    
    // Mark achievement section as explored for the Financial Explorer achievement
    const newlyCompleted = recordSectionExplored('achievements');
    
    // Show notification if an achievement was just completed
    if (newlyCompleted) {
      setCompletedAchievement(newlyCompleted);
    }
    
    return (
      <div className="mb-6">
        <Card gradientBorder delay={0.1}>
          <div className="p-4">
            <h2 className="text-2xl font-bold text-white mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Achievements
            </h2>
            
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-4 py-2">
                {achievements.map((achievement, index) => (
                  <AchievementCard
                    key={index}
                    name={achievement.name}
                    description={achievement.description}
                    icon={achievement.icon}
                    color={achievement.color}
                    status={achievement.status}
                    progress={achievement.progress}
                    unlocked={achievement.status === 'completed'}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="pb-16 bg-dark-900 min-h-screen">
      <Header title="Welcome" username={username} />
      
      <div className="p-4">
        {/* Top stats cards (monthly savings, next achievement, budget) */}
        {!dataLoaded ? renderPlaceholderTopCards() : renderLoadedTopCards()}
        
        {/* Achievement cards */}
        {!dataLoaded ? renderPlaceholderAchievements() : renderLoadedAchievements()}
        
        {/* Main dashboard content */}
        {!dataLoaded ? renderPlaceholderDashboard() : renderLoadedDashboard()}
        
        {/* Financial entry form modal */}
        <AnimatePresence>
          {activeForm && (
            <FinancialEntryForm
              type={activeForm}
              onSubmit={handleFormSubmit}
              onClose={() => setActiveForm(null)}
            />
          )}
        </AnimatePresence>
        
        {/* Collapsible floating action button menu */}
        <div ref={menuRef} className={`fixed bottom-24 right-6 ${menuExpanded ? 'menu-expanded' : ''}`}>
          {/* Main FAB button - always visible */}
          <motion.div
            className="flex flex-col items-center relative z-20"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.6
            }}
          >
            <button 
              className="menu-button bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl hover:from-primary-500 hover:to-accent-500 transition-all duration-300"
              aria-label="Menu"
              onClick={() => setMenuExpanded(!menuExpanded)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition-transform duration-300 ${menuExpanded ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuExpanded ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                )}
              </svg>
            </button>
            <p className="text-xs text-center mt-2 text-gray-400">Menu</p>
          </motion.div>
          
          {/* Menu items positioned absolutely and shown when expanded */}
          <div className="absolute bottom-0 right-0 w-16 h-16 z-10">
            {/* Chat button */}
            <div className="floating-menu-item flex flex-col items-center">
              <button 
                className="bg-gradient-to-r from-secondary-500 to-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl hover:from-secondary-400 hover:to-blue-400 transition-colors duration-300"
                onClick={() => {
                  setShowChatModal(true);
                  setMenuExpanded(false);
                }}
                aria-label="Chat"
              >
                <FaCommentDots className="h-7 w-7" />
              </button>
              <p className="menu-tooltip text-xs text-center mt-2 text-white">Chat</p>
            </div>
            
            {/* AI coach button */}
            <div className="floating-menu-item flex flex-col items-center">
              <button 
                className="bg-gradient-to-r from-accent-500 to-secondary-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl hover:from-accent-400 hover:to-secondary-400 transition-colors duration-300"
                onClick={() => {
                  navigate('/coach');
                  setMenuExpanded(false);
                }}
                aria-label="AI Coach"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <p className="menu-tooltip text-xs text-center mt-2 text-white">AI Coach</p>
            </div>
            
            {/* Upload/Refresh data button */}
            <div className="floating-menu-item flex flex-col items-center">
              <button 
                className="bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl hover:from-primary-400 hover:to-accent-400 transition-colors duration-300"
                onClick={() => {
                  handleUploadData();
                  setMenuExpanded(false);
                }}
                disabled={uploading}
                aria-label={dataLoaded ? "Refresh Data" : "Upload Data"}
              >
                {uploading ? (
                  <FaSpinner className="h-8 w-8 animate-spin" />
                ) : (
                  <FaUpload className="h-7 w-7" />
                )}
              </button>
              <p className="menu-tooltip text-xs text-center mt-2 text-white">
                {dataLoaded ? "Refresh Data" : "Upload Data"}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Welcome popup with confetti */}
      {showWelcomePopup && (
        <>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            gravity={0.15}
            colors={['#FF5F6D', '#FFC371', '#38ef7d', '#6A82FB', '#00F5A0']}
          />
          <WelcomePopup 
            isOpen={showWelcomePopup} 
            onClose={() => {
              setShowWelcomePopup(false);
              localStorage.setItem('centsi_welcome_shown', 'true');
            }} 
            userProfile={questionnaire}
          />
        </>
      )}
      
      {/* Chat modal */}
      <ChatbotModal 
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        userProfile={userData}
        username={username}
      />
      
      {/* Achievement celebration with confetti */}
      {completedAchievement && (
        <AchievementCelebration 
          achievement={completedAchievement} 
          onClose={() => setCompletedAchievement(null)}
        />
      )}
      
      {/* Savings goal completion celebration */}
      {completedGoal && (
        <SavingsGoalCelebration 
          goalName={completedGoal.name}
          onComplete={() => setCompletedGoal(null)}
        />
      )}
    </div>
  );
};

export default HomePage;