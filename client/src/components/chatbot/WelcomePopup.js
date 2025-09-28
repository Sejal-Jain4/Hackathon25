import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaRobot } from 'react-icons/fa';

const WelcomePopup = ({ isOpen, onClose, userProfile }) => {
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  
  useEffect(() => {
    // Get username from localStorage
    const storedUsername = localStorage.getItem('centsi_username') || '';
    setUsername(storedUsername);
    
    if (isOpen && userProfile) {
      generateWelcomeMessage();
    }
  }, [isOpen, userProfile]);
  
  const generateWelcomeMessage = async () => {
    setIsLoading(true);
    
    try {
      // Prepare the welcome prompt
      const welcomePrompt = `Generate a personalized welcome message for a user named ${username || 'there'} with the following profile:
        Life stage: ${mapLifeStage(userProfile.lifeStage)}
        Income type: ${mapIncomeType(userProfile.incomeType)}
        Financial priority: ${mapFinancialPriority(userProfile.financialPriority)}
        
        Make the message feel personal, friendly, and tailored to their situation. 
        Start with "Welcome" and their name if available, otherwise just "Welcome!". 
        Keep it short (2-3 sentences) and mention their financial priority specifically.`;
      
      // Get user context from localStorage
      const userContext = getUserContext();
      
      // Call the AI API
      const response = await axios.post('/api/ai/chat', { 
        message: welcomePrompt,
        userId: localStorage.getItem('centsi_username') || 'default_user',
        profile: userContext
      });
      
      if (response.data && response.data.status === 'success') {
        setWelcomeMessage(response.data.reply);
      } else {
        // Fallback message
        setWelcomeMessage(`Welcome${username ? ', ' + username : ''}! I'm your Centsi financial assistant, ready to help with your ${mapFinancialPriority(userProfile.financialPriority).toLowerCase()} goals.`);
      }
    } catch (error) {
      console.error('Error generating welcome message:', error);
      // Fallback message on error
      setWelcomeMessage(`Welcome${username ? ', ' + username : ''}! I'm your Centsi financial assistant, ready to help you reach your financial goals.`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Map the values to more readable forms
  const mapLifeStage = (stage) => {
    const mapping = {
      'highschool': 'High School Student',
      'college': 'College Student',
      'graduate': 'Fresh Graduate/Young Professional',
      'parent': 'Parent/Family Manager',
    };
    return mapping[stage] || stage || 'Unknown';
  };
  
  const mapIncomeType = (type) => {
    const mapping = {
      'allowance': 'Allowance/Part-time job',
      'gig': 'Irregular/gig income',
      'salary': 'Steady paycheck',
      'stipend': 'Stipend/scholarship',
    };
    return mapping[type] || type || 'Unknown';
  };
  
  const mapFinancialPriority = (priority) => {
    const mapping = {
      'savings': 'Savings',
      'debt': 'Debt/loan management',
      'budget': 'Budgeting',
      'credit': 'Credit building/investing',
    };
    return mapping[priority] || priority || 'Financial goals';
  };
  
  // Get full user context from localStorage
  const getUserContext = () => {
    const userProfileString = localStorage.getItem('centsi_user_profile');
    const questionnaireString = localStorage.getItem('centsi_questionnaire_responses');
    
    const userProfile = userProfileString ? JSON.parse(userProfileString) : {};
    const questionnaireResponses = questionnaireString ? JSON.parse(questionnaireString) : {};
    
    return {
      ...userProfile,
      questionnaire: questionnaireResponses
    };
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-0 right-0 m-4 z-50"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-dark-800 rounded-lg shadow-xl border border-primary-500 max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-3 flex justify-between items-center">
              <div className="flex items-center">
                <FaRobot className="text-white mr-2" />
                <h3 className="text-white font-medium text-sm">Centsi AI</h3>
              </div>
              <button 
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all duration-200"
              >
                <FaTimes size={12} />
              </button>
            </div>
            <div className="p-4">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              ) : (
                <p className="text-white text-sm">{welcomeMessage}</p>
              )}
            </div>
            <div className="bg-dark-700 p-3 text-right">
              <button 
                onClick={onClose}
                className="px-4 py-1 bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium rounded transition-colors duration-200"
              >
                Got it
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomePopup;