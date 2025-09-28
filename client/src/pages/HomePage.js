import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import { 
  getCompleteUserData, 
  addIncome, 
  addExpense, 
  addSavingsGoal
} from '../utils/dataService';
import { 
  FaUpload, 
  FaSpinner, 
  FaChartLine, 
  FaMoneyBillWave, 
  FaRobot, 
  FaCommentDots, 
  FaPlus
} from 'react-icons/fa';
import { BsDash } from 'react-icons/bs';
import piggyBank from '../assets/piggy.png';
import WelcomePopup from '../components/chatbot/WelcomePopup';
import ChatbotModal from '../components/chatbot/ChatbotModal';
import QuickActionButtons from '../components/QuickActionButtons';
import FinancialEntryForm from '../components/FinancialEntryForm';
import '../components/chatbot/ChatDot.css';
import '../styles/FinancialEntry.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [questionnaire, setQuestionnaire] = useState(null);
  const [activeForm, setActiveForm] = useState(null);  // 'income', 'expense', or 'savings'

  // Load user data on component mount
  useEffect(() => {
    // Get user data from enhanced data service
    const data = getCompleteUserData();
    setUserData(data);
    setUsername(data.profile?.name || 'User');
    
    // Set data loaded if we have financial data
    if (data.finances) {
      setDataLoaded(true);
    }
    
    // Get questionnaire responses
    if (data.questionnaire) {
      setQuestionnaire(data.questionnaire);
      
      // Show welcome popup with a small delay
      setTimeout(() => {
        setShowWelcomePopup(true);
      }, 1500);
    }
  }, []);
  
  // Handle form submissions for financial entries
  const handleFormSubmit = (formData) => {
    switch(activeForm) {
      case 'income':
        const updatedData = addIncome(formData);
        setUserData({
          ...userData,
          finances: updatedData
        });
        break;
        
      case 'expense':
        const updatedDataWithExpense = addExpense(formData);
        setUserData({
          ...userData,
          finances: updatedDataWithExpense
        });
        break;
        
      case 'savings':
        const updatedDataWithSavings = addSavingsGoal(formData);
        setUserData({
          ...userData,
          finances: updatedDataWithSavings
        });
        break;
        
      default:
        console.error('Unknown form type:', activeForm);
    }
    
    // Close the form
    setActiveForm(null);
  };
  
  // Function to simulate uploading financial data
  const handleUploadData = () => {
    setUploading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // We're already using the enhanced data service now
      const data = getCompleteUserData();
      setUserData(data);
      setDataLoaded(true);
      setUploading(false);
    }, 1500); // 1.5 second simulated loading time
  };
  
  // Dashboard with empty placeholders
  const renderEmptyDashboard = () => (
    <>
      {/* Monthly Balance Card */}
      <motion.div 
        className="bg-dark-800 rounded-xl shadow-xl p-6 mb-6 border border-dark-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Monthly Balance</h2>
            <div className="bg-dark-700 h-8 w-40 rounded animate-pulse"></div>
            <p className="text-sm text-gray-500 mt-1">Upload to view data</p>
          </div>
          <div className="bg-dark-700 rounded-full p-3">
            <FaMoneyBillWave className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-dark-700 rounded-lg p-3">
            <p className="text-gray-400 text-sm">Income</p>
            <div className="bg-dark-600 h-7 w-24 rounded animate-pulse"></div>
          </div>
          <div className="bg-dark-700 rounded-lg p-3">
            <p className="text-gray-400 text-sm">Expenses</p>
            <div className="bg-dark-600 h-7 w-24 rounded animate-pulse"></div>
          </div>
        </div>
      </motion.div>
      
      {/* Savings Goals Card - Moved Up */}
      <motion.div 
        className="bg-dark-800 rounded-xl shadow-xl p-6 mb-6 border border-dark-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-xl font-bold text-white mb-4">Savings Goals</h2>
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
      
      {/* Recent Activity Card - Moved to Bottom */}
      <motion.div 
        className="bg-dark-800 rounded-xl shadow-xl p-6 mb-6 border border-dark-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex justify-between items-center border-b border-dark-600 pb-3">
              <div>
                <div className="bg-dark-700 h-5 w-32 rounded animate-pulse mb-1"></div>
                <div className="bg-dark-700 h-3 w-24 rounded animate-pulse"></div>
              </div>
              <div className="bg-dark-700 h-5 w-16 rounded animate-pulse"></div>
            </div>
          ))}
          <div className="flex justify-between items-center">
            <div>
              <div className="bg-dark-700 h-5 w-32 rounded animate-pulse mb-1"></div>
              <div className="bg-dark-700 h-3 w-24 rounded animate-pulse"></div>
            </div>
            <div className="bg-dark-700 h-5 w-16 rounded animate-pulse"></div>
          </div>
        </div>
      </motion.div>

    </>
  );

  // Dashboard with real data
  const renderLoadedDashboard = () => {
    const finances = userData.finances;
    
    // Quick action buttons for adding data
    const renderQuickActions = () => (
      <QuickActionButtons 
        onAddIncome={() => setActiveForm('income')}
        onAddExpense={() => setActiveForm('expense')}
        onAddSavings={() => setActiveForm('savings')}
      />
    );
    
    return (
    <>
      <motion.div 
        className="bg-dark-800 rounded-xl shadow-xl p-6 mb-6 border border-dark-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Monthly Balance</h2>
            <p className="text-3xl font-bold bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">
              ${finances.totalBalance.toFixed(2)}
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
              ${finances.income.amount}
              <span className="text-xs text-gray-500 ml-1">/{finances.income.frequency}</span>
            </p>
          </div>
          <div className="bg-dark-700 rounded-lg p-3">
            <p className="text-gray-400 text-sm">Expenses</p>
            <p className="text-xl font-semibold text-secondary-400">
              ${finances.expenses.reduce((sum, expense) => sum + expense.amount, 0)}
              <span className="text-xs text-gray-500 ml-1">/month</span>
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Quick Action Buttons */}
      {renderQuickActions()}
      
      {/* Savings Goals Card */}
      <motion.div 
        className="bg-dark-800 rounded-xl shadow-xl p-6 mb-6 border border-dark-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Savings Goals</h2>
          <button 
            onClick={() => setActiveForm('savings')}
            className="bg-dark-700 hover:bg-dark-600 text-white rounded-full p-2 transition-colors"
          >
            <FaPlus />
          </button>
        </div>
        
        <div className="space-y-6">
          {finances.savingsGoals.map((goal, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <div>
                  <p className="font-medium text-white">{goal.name}</p>
                  <p className="text-xs text-gray-500">
                    {goal.deadline ? `Target date: ${new Date(goal.deadline).toLocaleDateString()}` : 'Ongoing goal'}
                  </p>
                </div>
                <p className="text-accent-400 font-medium">
                  ${goal.current}/${goal.target}
                </p>
              </div>
              <div className="w-full bg-dark-600 rounded-full h-3">
                <motion.div 
                  className="bg-gradient-to-r from-accent-500 to-primary-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 + (index * 0.2) }}
                ></motion.div>
              </div>
            </div>
          ))}
          
          {finances.savingsGoals.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-400">No savings goals yet</p>
              <button 
                onClick={() => setActiveForm('savings')}
                className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg"
              >
                Add a goal
              </button>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Recent Activity Card */}
      <motion.div 
        className="bg-dark-800 rounded-xl shadow-xl p-6 mb-6 border border-dark-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
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
                className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg"
              >
                Add an expense
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
  };
  
  // Top stats cards for empty state
  const renderEmptyTopCards = () => (
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
            <div className="bg-dark-700 h-8 w-24 rounded animate-pulse"></div>
            <div className="text-sm text-gray-500 ml-2">/ target</div>
            <div className="bg-dark-700 h-4 w-16 rounded animate-pulse ml-2"></div>
          </div>
          
          {/* Custom Piggy Bank Visualization - Empty State with Full Fill */}
          <div className="w-full flex flex-col items-center justify-center flex-grow">
            <div className="w-36 h-32 relative">
              {/* Base white outline of piggy bank for empty state */}
              <img 
                src={piggyBank} 
                alt="Empty Piggy Bank Outline" 
                className="w-full h-full object-contain opacity-70"
                style={{ filter: "brightness(0) invert(1) drop-shadow(0 0 2px white)" }}
              />
              
              {/* The mask layer that uses the piggy bank as mask - for empty state */}
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
                {/* Empty state with pulsing effect */}
                <motion.div 
                  className="absolute inset-0 bg-primary-400/20"
                  animate={{ 
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse" 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Next Achievement Card - Now in middle position (swapped with Budget Remaining) */}
      <motion.div 
        className="bg-dark-800 rounded-xl shadow-xl overflow-hidden border border-dark-700 flex flex-col h-[250px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="p-5 flex flex-col flex-grow">
          <h2 className="text-lg font-bold text-white mb-2">Next Achievement</h2>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-dark-700 rounded-full animate-pulse flex items-center justify-center"></div>
            <div>
              <div className="bg-dark-700 h-5 w-24 rounded animate-pulse mb-1"></div>
              <div className="bg-dark-700 h-3 w-32 rounded animate-pulse"></div>
            </div>
          </div>
          
          <div className="flex flex-col justify-center flex-grow mt-10">
            {/* Achievement Progress Bar (Empty) */}
            <div className="w-full bg-dark-600 rounded-lg h-12 relative overflow-hidden">
              <div className="bg-dark-700 h-12 w-0 animate-pulse"></div>
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
      
      {/* Budget Remaining Card - Now in last position (swapped with Achievement) */}
      <motion.div 
        className="bg-dark-800 rounded-xl shadow-xl overflow-hidden border border-dark-700 flex flex-col h-[250px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="p-5 flex flex-col flex-grow">
          <h2 className="text-lg font-bold text-white mb-2">Budget Remaining</h2>
          <div className="flex items-center mb-3">
            <div className="bg-dark-700 h-8 w-24 rounded animate-pulse"></div>
            <div className="text-sm text-gray-500 ml-2">/ month</div>
          </div>
          
          <div className="flex flex-col justify-center flex-grow mt-4">
            {/* Budget Progress Blocks Visualization (Empty State) */}
            <div className="w-full rounded-lg bg-dark-600 h-12 relative">
              {/* Budget blocks - empty state */}
              <div className="flex h-full w-full">
                {[...Array(10)].map((_, index) => (
                  <div
                    key={index}
                    className="h-full flex-1 mx-0.5 bg-dark-700"
                  />
                ))}
              </div>
              
              {/* Upload message overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500 font-medium">Upload to view</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Top stats cards for loaded state
  const renderLoadedTopCards = () => {
    // Calculate savings values with more realistic numbers
    const monthlySavingsTarget = 2500; // More realistic target amount
    // Get the actual income and calculate a more realistic current savings amount (30% of income minus expenses)
    const monthlyIncome = userData.finances.income.amount;
    const monthlyExpenses = userData.finances.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const targetSavingsPercentage = 0.30; // Target saving 30% of income
    const targetSavings = monthlyIncome * targetSavingsPercentage;
    const currentSavings = Math.max(0, (monthlyIncome - monthlyExpenses));
    const savingsPercentage = Math.min(Math.round((currentSavings / monthlySavingsTarget) * 100), 100);
    
    // Calculate budget values
    const monthlyBudget = userData.finances.income.amount;
    const budgetUsed = userData.finances.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const budgetRemaining = monthlyBudget - budgetUsed;
    const budgetPercentage = Math.min(Math.round((budgetRemaining / monthlyBudget) * 100), 100);

    // Next achievement (we'll pick the first "not unlocked" one)
    const achievements = [
      { 
        name: "Budget Master", 
        description: "Created your first budget", 
        icon: "🎯", 
        color: "from-green-500 to-emerald-700",
        progress: 100,
        unlocked: true 
      },
      { 
        name: "Saver Starter", 
        description: "Saved your first $100", 
        icon: "💰", 
        color: "from-blue-500 to-indigo-700",
        progress: 80,
        unlocked: true 
      },
      { 
        name: "Debt Crusher", 
        description: "Paid off a loan", 
        icon: "🔨", 
        color: "from-purple-500 to-violet-700",
        progress: 65,
        unlocked: false 
      },
      { 
        name: "Investor", 
        description: "Made your first investment", 
        icon: "📈", 
        color: "from-amber-500 to-orange-700",
        progress: 10,
        unlocked: false 
      },
    ];
    
    const nextAchievement = achievements.find(a => !a.unlocked);

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
              <span className="text-2xl font-bold text-accent-400">${currentSavings.toFixed(2)}</span>
              <span className="text-sm text-gray-500 ml-2">/ ${monthlySavingsTarget}</span>
              <span className="text-xs text-accent-300 ml-2">({savingsPercentage}% saved)</span>
            </div>
            
            {/* Custom Piggy Bank Visualization - Full Fill Implementation */}
            <div className="w-full flex flex-col items-center justify-center flex-grow">
              <div className="w-36 h-32 relative">
                {/* Base white outline of piggy bank for visibility */}
                <img 
                  src={piggyBank} 
                  alt="Piggy Bank Outline" 
                  className="w-full h-full object-contain"
                  style={{ filter: "brightness(0) invert(1) drop-shadow(0 0 2px white)" }}
                />
                
                {/* The mask layer that uses the piggy bank as mask - for the full fill */}
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
                  {/* Bright blue background that fills the entire piggy */}
                  <div className="absolute inset-0 bg-primary-400"></div>
                  
                  {/* Overlay that shows the percentage filled */}
                  <div className="absolute inset-0 bg-dark-800">
                    <motion.div 
                      className="absolute left-0 right-0 bottom-0 bg-primary-400 w-full"
                      initial={{ height: '0%' }}
                      animate={{ height: `${savingsPercentage}%` }}
                      transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Achievement Card - Now in middle position (swapped with Budget Remaining) */}
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
              {/* Achievement Progress Bar */}
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

        {/* Budget Remaining Card - Now in last position (swapped with Achievement) */}
        <motion.div 
          className="bg-dark-800 rounded-xl shadow-xl overflow-hidden border border-dark-700 flex flex-col h-[250px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="p-5 flex flex-col flex-grow">
            <h2 className="text-lg font-bold text-white mb-2">Budget Remaining</h2>
            <div className="flex items-center mb-3">
              <span className="text-2xl font-bold text-accent-400">${budgetRemaining.toFixed(2)}</span>
              <span className="text-sm text-gray-500 ml-2">/ ${monthlyBudget.toFixed(2)}</span>
            </div>
            
            <div className="flex flex-col justify-center flex-grow mt-4">
              {/* Budget Progress Blocks Visualization */}
              <div className="w-full rounded-lg bg-dark-600 h-12 relative overflow-hidden">
                {/* Budget blocks - 10 cells */}
                <div className="flex h-full w-full">
                  {[...Array(10)].map((_, index) => {
                    // Calculate if this cell should be lit based on budget percentage
                    // Each cell represents 10% of the budget
                    const isActive = (index + 1) * 10 <= budgetPercentage;
                    
                    // Gradient from accent to primary for consistency with the top border
                    // Determine the gradient based on position in the array
                    let gradientClass = '';
                    if (isActive) {
                      if (index < 3) { // First 30% - Accent
                        gradientClass = 'bg-accent-500';
                      } else if (index < 7) { // 30-70% - Accent-primary blend
                        gradientClass = 'bg-gradient-to-r from-accent-500 to-secondary-500';
                      } else { // 70-100% - Primary
                        gradientClass = 'bg-gradient-to-r from-secondary-500 to-primary-500';
                      }
                    }
                    
                    return (
                      <div
                        key={index}
                        className={`h-full flex-1 mx-0.5 ${isActive ? gradientClass : 'bg-dark-700'}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // Achievement cards for empty state
  const renderEmptyAchievements = () => (
    <div className="mb-6">
      <motion.div 
        className="bg-gradient-to-r from-accent-500 via-secondary-500 to-primary-500 rounded-xl p-0.5 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-dark-800 rounded-lg p-4">
          <h2 className="text-2xl font-bold text-white mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Achievements
          </h2>
          
          <div className="overflow-x-auto pb-2">
            <div className="flex space-x-4">
              {[...Array(4)].map((_, index) => (
                <motion.div
                  key={index}
                  className="relative min-w-[200px] w-[200px] h-[200px] bg-dark-700 rounded-lg p-5 border border-dark-600"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ 
                    scale: 0.97,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="w-20 h-20 mb-4 mx-auto bg-gradient-to-br from-dark-600 to-dark-500 rounded-full flex items-center justify-center">
                    <div className="bg-dark-700 h-10 w-10 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-dark-600 h-6 w-32 rounded mx-auto animate-pulse mb-2"></div>
                    <div className="bg-dark-600 h-4 w-36 rounded mx-auto animate-pulse mt-1"></div>
                  </div>
                  
                  <div className="mt-4 opacity-0">
                    <div className="w-full bg-dark-600 rounded-full h-2.5 mb-1">
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Achievement cards for loaded state
  const renderLoadedAchievements = () => {
    // Sample achievements (in a real app, these would come from the user profile)
    const achievements = [
      { 
        name: "Debt Crusher", 
        description: "Paid off a loan", 
        icon: "🔨", 
        color: "from-purple-500 to-violet-700",
        status: "in-progress",
        progress: 65,
        unlocked: false 
      },
      { 
        name: "Investor", 
        description: "Made your first investment", 
        icon: "�", 
        color: "from-amber-500 to-orange-700",
        status: "not-started",
        progress: 10,
        unlocked: false 
      },
      { 
        name: "Budget Master", 
        description: "Created your first budget", 
        icon: "🎯", 
        color: "from-green-500 to-emerald-700",
        status: "completed",
        progress: 100,
        unlocked: true 
      },
      { 
        name: "Saver Starter", 
        description: "Saved your first $100", 
        icon: "�", 
        color: "from-blue-500 to-indigo-700",
        status: "completed",
        progress: 100,
        unlocked: true 
      },
    ];

    return (
      <div className="mb-6">
        <motion.div 
          className="bg-gradient-to-r from-accent-500 via-secondary-500 to-primary-500 rounded-xl p-0.5 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-dark-800 rounded-lg p-4">
            <h2 className="text-2xl font-bold text-white mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Achievements
            </h2>
            
            <div className="overflow-x-auto pb-2">
              <div className="flex space-x-4">
                {achievements.map((achievement, index) => {                  
                  return (
                    <motion.div
                      key={index}
                      className="relative min-w-[200px] w-[200px] h-[200px] bg-dark-700 rounded-lg p-5 border border-dark-600"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      whileHover={{ 
                        scale: 0.97,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <div className={`w-20 h-20 mb-4 mx-auto bg-gradient-to-br ${achievement.color} rounded-full flex items-center justify-center ${achievement.status !== "completed" && 'opacity-80'} ${achievement.status === "not-started" && 'grayscale'}`}>
                        <span className="text-4xl">{achievement.icon}</span>
                      </div>
                      
                      <div className="text-center">
                        <p className="font-medium text-white text-lg">{achievement.name}</p>
                        <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                      </div>
                      
                      {achievement.status === "in-progress" && (
                        <div className="mt-4">
                          <div className="w-full bg-dark-600 rounded-full h-2.5">
                            <div 
                              className="h-2.5 rounded-full bg-purple-500"
                              style={{ width: `${achievement.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="pb-16 bg-dark-900 min-h-screen">
      <div className="bg-dark-800 px-6 py-4 shadow-md border-b border-dark-700">
        <h1 className="text-2xl font-bold text-white text-left">
          Welcome to <span className="bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">Centsi</span>
          {username && <span className="ml-2 text-2xl font-bold text-white">{username}</span>}
        </h1>
      </div>
      
      <div className="p-4">
        {/* Top cards section at the top */}
        {!dataLoaded ? renderEmptyTopCards() : renderLoadedTopCards()}
        
        {/* Achievements section */}
        {!dataLoaded ? renderEmptyAchievements() : renderLoadedAchievements()}
        
        {/* Main dashboard content */}
        {!dataLoaded ? renderEmptyDashboard() : renderLoadedDashboard()}
        
        {/* Financial Entry Forms */}
        <AnimatePresence>
          {activeForm && (
            <FinancialEntryForm
              type={activeForm}
              onSubmit={handleFormSubmit}
              onClose={() => setActiveForm(null)}
            />
          )}
        </AnimatePresence>
        
        {/* Button Group */}
        <div className="fixed bottom-24 right-6 space-y-4">
          {/* Chatbot Button */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.7
            }}
          >
            <button 
              className="bg-gradient-to-r from-blue-500 to-primary-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl relative overflow-hidden"
              onClick={() => setShowChatModal(true)}
            >
              <div className="absolute inset-0 bg-white opacity-10 chat-dot-pulse"></div>
              <FaCommentDots className="h-7 w-7" />
            </button>
            <p className="text-xs text-center mt-2 text-gray-400">Chat</p>
          </motion.div>
          
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
          
          {/* Upload/Refresh Data Button - shown on both empty and loaded states */}
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
      
      {/* Welcome Popup */}
      <WelcomePopup 
        isOpen={showWelcomePopup} 
        onClose={() => setShowWelcomePopup(false)} 
        userProfile={questionnaire}
      />
      
      {/* Chatbot Modal */}
      <ChatbotModal 
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        userProfile={userData}  // Passing complete user data instead of just questionnaire
      />
    </div>
  );
};

export default HomePage;