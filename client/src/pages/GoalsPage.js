import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaCoins, FaPiggyBank, FaChartLine, FaEdit, FaTrash } from 'react-icons/fa';
import { BsDash } from 'react-icons/bs';
import Header from '../components/layout/Header';
import { Card, SavingsGoalCelebration } from '../components/ui';
import { 
  getCompleteUserData, 
  isDataLoaded, 
  addSavingsGoal, 
  updateSavingsGoal, 
  removeSavingsGoal,
  saveFinancialData
} from '../utils/dataService';
import FinancialEntryForm from '../components/FinancialEntryForm';

const GoalsPage = () => {
  const [userData, setUserData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const [completedGoal, setCompletedGoal] = useState(null);

  // Load user data from enhanced data service on component mount
  useEffect(() => {
    const data = getCompleteUserData();
    setUserData(data);
    
    // Check if data has been loaded before (from localStorage)
    const dataLoaded = isDataLoaded();
    setDataLoaded(dataLoaded);
  }, []);

  // Handle form submissions for financial entries
  const handleFormSubmit = (formData) => {
    let updatedData;
    let newlyCompleted = null;
    
    // Check if activeForm is an object with type and index (for editing)
    if (activeForm && typeof activeForm === 'object') {
      const { type, index } = activeForm;
      
      if (type === 'savings') {
        // Use updateSavingsGoal to handle achievement checking
        const result = updateSavingsGoal(index, formData);
        updatedData = result.financialData;
        newlyCompleted = result.newlyCompleted;
      }
    } else if (activeForm === 'savings') {
      // Handle adding new savings goal
      const result = addSavingsGoal(formData);
      updatedData = result.financialData;
      newlyCompleted = result.newlyCompleted;
    } else if (activeForm === 'budget') {
      // Handle adding new budget limit
      // For now, just add it to the expenses array
      const financialData = userData.finances;
      financialData.expenses.push({
        name: formData.name,
        category: formData.category,
        amount: formData.limit,
        frequency: 'monthly',
        type: 'budget'
      });
      
      updatedData = saveFinancialData(financialData);
    }
    
    // Update user data if we got updated data back
    if (updatedData) {
      setUserData({
        ...userData,
        finances: updatedData
      });
    }
    
    // Close the form
    setActiveForm(null);
  };

  // Generate budget limits from expenses
  const generateBudgetLimits = () => {
    if (!userData || !userData.finances || !userData.finances.expenses) {
      return [];
    }

    // Create budget limits from expenses
    // We'll consider each expense as a budget category with its amount as the limit
    return userData.finances.expenses.map(expense => {
      // Calculate a random "spent" amount that's somewhat realistic
      // For demo purposes, between 30% and 95% of the limit
      const randomPercentage = Math.floor(Math.random() * (95 - 30 + 1)) + 30;
      const spent = Math.round((expense.amount * randomPercentage) / 100);
      const usedPercentage = Math.round((spent / expense.amount) * 100);
      
      let status;
      if (usedPercentage >= 90) {
        status = 'error';
      } else if (usedPercentage >= 70) {
        status = 'warning';
      } else {
        status = 'success';
      }
      
      return {
        category: expense.name || expense.category,
        spent: spent,
        limit: expense.amount,
        usedPercentage: usedPercentage,
        status: status,
        id: expense.id
      };
    });
  };

  // Empty dashboard with placeholders - matches HomePage pattern
  const renderEmptyGoals = () => (
    <>
      {/* Savings Goals Card - Empty state */}
      <Card className="p-6 mb-6">
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
      </Card>
      
      {/* Budget Limits Card - Empty state */}
      <Card className="p-6 mb-6" delay={0.1}>
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
      </Card>
    </>
  );

  // Dashboard with real data
  const renderLoadedGoals = () => {
    const finances = userData.finances;
    const savingsGoals = finances.savingsGoals || [];
    const budgetLimits = generateBudgetLimits();
    
    return (
      <>
        {/* Savings Goals Section */}
        <Card className="p-6 mb-6">
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
              onClick={() => setActiveForm('savings')}
            >
              <FaPlus className="mr-2" /> New Goal
            </motion.button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savingsGoals.length > 0 ? (
              savingsGoals.map((goal, index) => {
                const progressPercentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
                const isComplete = progressPercentage >= 100;
                
                return (
                  <Card 
                    key={index} 
                    className="bg-dark-700 p-5 hover:border-accent-500"
                    delay={0.1 * index}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-bold text-white text-lg">{goal.name}</h3>
                        <p className="text-xs text-gray-400">
                          {goal.milestone ? `Next milestone: ${goal.milestone}` : 'Set a milestone'}
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
                        className={`h-3 rounded-full ${isComplete ? 
                          'bg-gradient-to-r from-green-500 to-accent-500' : 
                          'bg-gradient-to-r from-accent-500 to-primary-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                        onAnimationComplete={() => {
                          // Check if goal just hit 100% (completed)
                          if (isComplete && goal.current === goal.target) {
                            // Set the completed goal to trigger celebration
                            setCompletedGoal(goal);
                          }
                        }}
                      ></motion.div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-400 mb-4">
                      <span>
                        {goal.deadline 
                          ? `Due by ${new Date(goal.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}` 
                          : 'No deadline'}
                      </span>
                      <span className={`font-medium ${isComplete ? 'text-green-400' : 'text-accent-400'}`}>
                        {progressPercentage}% {isComplete && '✓'}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <motion.button 
                        className="flex-1 bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveForm({ type: 'savings', index: index, goalData: goal })}
                      >
                        <FaCoins className="mr-2" /> Update Progress
                      </motion.button>
                      
                      <motion.button 
                        className="bg-dark-600 hover:bg-dark-500 text-white p-2 rounded-lg text-sm flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          removeSavingsGoal(index);
                          // Update local state
                          const updatedData = getCompleteUserData();
                          setUserData(updatedData);
                        }}
                      >
                        <FaTrash size={14} />
                      </motion.button>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-10">
                <p className="text-gray-400 mb-4">No savings goals yet</p>
                <button 
                  className="bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600 text-white px-6 py-2 rounded-lg font-medium"
                  onClick={() => setActiveForm('savings')}
                >
                  Create your first goal
                </button>
              </div>
            )}
          </div>
        </Card>
        
        {/* Budget Limits Section */}
        <Card className="p-6 mb-6" delay={0.2}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <FaChartLine className="h-6 w-6 text-secondary-400 mr-3" />
              <h2 className="text-xl font-bold bg-gradient-to-r from-secondary-400 to-primary-400 bg-clip-text text-transparent">
                Budget Limits
              </h2>
            </div>
            <motion.button 
              className="bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveForm('budget')}
            >
              <FaPlus className="mr-2" /> New Budget
            </motion.button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {budgetLimits.length > 0 ? (
              budgetLimits.map((budget, index) => (
                <Card 
                  key={index}
                  className="bg-dark-700 p-5"
                  delay={0.2 + (0.1 * index)}
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
                  
                  <div className="flex justify-end mt-3 space-x-2">
                    <motion.button 
                      className="bg-dark-600 hover:bg-dark-500 text-white p-2 rounded-lg text-sm flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaEdit size={14} />
                    </motion.button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-10">
                <p className="text-gray-400 mb-4">No budget limits set yet</p>
                <button 
                  className="bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white px-6 py-2 rounded-lg font-medium"
                  onClick={() => setActiveForm('budget')}
                >
                  Set your first budget limit
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* Goal Progress Timeline Section */}
        <Card className="p-6 mb-6">
          <div className="flex items-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Goal Progress Timeline
            </h2>
          </div>
          
          {savingsGoals.length > 0 ? (
            <div className="relative">
              {/* Timeline */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-dark-600"></div>
              
              {/* Timeline Events */}
              <div className="space-y-6 pl-12">
                {savingsGoals.map((goal, index) => {
                  const progressPercentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
                  const milestones = [
                    { percent: 25, label: '25% Complete' },
                    { percent: 50, label: '50% Complete' },
                    { percent: 75, label: '75% Complete' },
                    { percent: 100, label: 'Target Reached!' }
                  ];
                  
                  // Filter milestones that have been reached
                  const reachedMilestones = milestones.filter(m => progressPercentage >= m.percent);
                  
                  return (
                    <div key={index} className="mb-8">
                      <h3 className="font-bold text-white text-lg mb-3">{goal.name}</h3>
                      
                      {reachedMilestones.map((milestone, mIndex) => (
                        <div key={mIndex} className="relative mb-4">
                          <div className="absolute -left-12 mt-1">
                            <div className="w-7 h-7 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                          
                          <div className="bg-dark-700 p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-white">{milestone.label}</span>
                              <span className="text-xs text-gray-400">
                                {new Date(Date.now() - (index * 7 + mIndex * 3) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                              {milestone.percent === 100 
                                ? `You've reached your target of $${goal.target}!` 
                                : `You've saved $${Math.round(goal.target * milestone.percent / 100)} toward your goal of $${goal.target}.`}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {reachedMilestones.length === 0 && (
                        <div className="relative mb-4">
                          <div className="absolute -left-12 mt-1">
                            <div className="w-7 h-7 bg-dark-600 rounded-full flex items-center justify-center">
                              <span className="text-sm text-gray-400">•</span>
                            </div>
                          </div>
                          
                          <div className="bg-dark-700 p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-white">Goal Started</span>
                              <span className="text-xs text-gray-400">
                                {new Date(Date.now() - (index * 7) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                              You've started your goal to save ${goal.target}.
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Next milestone */}
                      {progressPercentage < 100 && (
                        <div className="relative mb-4">
                          <div className="absolute -left-12 mt-1">
                            <div className="w-7 h-7 bg-dark-600 rounded-full flex items-center justify-center">
                              <span className="text-sm text-gray-400">•</span>
                            </div>
                          </div>
                          
                          <div className="bg-dark-700 p-4 rounded-lg border border-dashed border-dark-500">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-400">Next Milestone</span>
                              <span className="text-xs bg-dark-600 px-2 py-1 rounded-full text-gray-400">Upcoming</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                              {progressPercentage < 25 
                                ? 'Save 25% of your goal.' 
                                : progressPercentage < 50 
                                  ? 'Save 50% of your goal.'
                                  : progressPercentage < 75 
                                    ? 'Save 75% of your goal.'
                                    : 'Reach 100% of your goal!'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-400">No goals to track yet</p>
              <p className="text-xs text-gray-500 mt-2">Add a savings goal to see your progress timeline</p>
            </div>
          )}
        </Card>
      </>
    );
  };
  
  return (
    <div className="pb-16 bg-dark-900 min-h-screen">
      <Header title="My Goals" />
      
      <div className="p-4">
        {/* Conditionally render empty or loaded content */}
        {!dataLoaded ? renderEmptyGoals() : renderLoadedGoals()}
        
        {/* Financial entry form modal */}
        {activeForm && (
          <FinancialEntryForm
            type={activeForm}
            onSubmit={handleFormSubmit}
            onClose={() => setActiveForm(null)}
            initialData={activeForm?.goalData}
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
    </div>
  );
};

export default GoalsPage;