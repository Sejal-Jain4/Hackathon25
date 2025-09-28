import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clearDataLoadState } from '../utils/dataService';

const OnboardingPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Get username from localStorage if it exists
  const storedUsername = localStorage.getItem('centsi_username') || '';
  
  const [profile, setProfile] = useState({
    name: storedUsername,
    lifeStage: null,
    incomeType: null,
    financialPriority: null,
  });

  const steps = [
    {
      title: 'Welcome to Centsi!',
      description: 'Let us personalize your financial coaching experience',
      content: (
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-accent-400 to-secondary-400 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mt-6 text-2xl font-bold text-white">Hello{profile.name ? `, ${profile.name}` : ''}!</h3>
          <p className="mt-3 text-gray-300">
            Just a few quick questions to personalize your financial coaching experience
          </p>
        </motion.div>
      ),
    },
    {
      title: 'Life Stage',
      description: 'Tell us where you are in your financial journey',
      content: (
        <div>
          <p className="text-gray-300 mb-4">I am currently...</p>
          <div className="space-y-3">
            {[
              { id: 'highschool', label: 'A High School Student' },
              { id: 'college', label: 'A College Student' },
              { id: 'graduate', label: 'A Fresh Graduate / Young Professional' },
              { id: 'parent', label: 'A Parent / Family Manager' },
            ].map((option) => (
              <motion.div
                key={option.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                  profile.lifeStage === option.id 
                    ? 'border-accent-500 bg-dark-700 shadow-lg shadow-accent-900/20' 
                    : 'border-dark-600 bg-dark-800 hover:border-dark-500'
                }`}
                onClick={() => setProfile({ ...profile, lifeStage: option.id })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      profile.lifeStage === option.id ? 'border-accent-500' : 'border-gray-500'
                    }`}
                  >
                    {profile.lifeStage === option.id && (
                      <div className="w-3 h-3 rounded-full bg-accent-500"></div>
                    )}
                  </div>
                  <span className="ml-3 text-white">{option.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Income Type',
      description: 'This helps us suggest relevant financial strategies',
      content: (
        <div>
          <p className="text-gray-300 mb-4">My primary source of income is...</p>
          <div className="space-y-3">
            {[
              { id: 'allowance', label: 'Allowance / Part-time job' },
              { id: 'gig', label: 'Irregular / gig income' },
              { id: 'salary', label: 'Steady paycheck' },
              { id: 'stipend', label: 'Stipend/scholarship' },
            ].map((option) => (
              <motion.div
                key={option.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                  profile.incomeType === option.id 
                    ? 'border-accent-500 bg-dark-700 shadow-lg shadow-accent-900/20' 
                    : 'border-dark-600 bg-dark-800 hover:border-dark-500'
                }`}
                onClick={() => setProfile({ ...profile, incomeType: option.id })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      profile.incomeType === option.id ? 'border-accent-500' : 'border-gray-500'
                    }`}
                  >
                    {profile.incomeType === option.id && (
                      <div className="w-3 h-3 rounded-full bg-accent-500"></div>
                    )}
                  </div>
                  <span className="ml-3 text-white">{option.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Financial Priority',
      description: 'What would you like to focus on first?',
      content: (
        <div>
          <p className="text-gray-300 mb-4">My current financial priority is...</p>
          <div className="space-y-3">
            {[
              { id: 'savings', label: 'Savings goal' },
              { id: 'debt', label: 'Debt/loans management' },
              { id: 'budget', label: 'Daily budgeting' },
              { id: 'credit', label: 'Credit building / investing basics' },
            ].map((option) => (
              <motion.div
                key={option.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                  profile.financialPriority === option.id 
                    ? 'border-accent-500 bg-dark-700 shadow-lg shadow-accent-900/20' 
                    : 'border-dark-600 bg-dark-800 hover:border-dark-500'
                }`}
                onClick={() => setProfile({ ...profile, financialPriority: option.id })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      profile.financialPriority === option.id ? 'border-accent-500' : 'border-gray-500'
                    }`}
                  >
                    {profile.financialPriority === option.id && (
                      <div className="w-3 h-3 rounded-full bg-accent-500"></div>
                    )}
                  </div>
                  <span className="ml-3 text-white">{option.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'All Set!',
      description: "You're ready to start your financial journey",
      content: (
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-accent-400 to-secondary-400 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-6 text-2xl font-bold text-white">
            You're all set, {profile.name || 'there'}!
          </h3>
          <p className="mt-3 text-gray-300">
            We've personalized your dashboard based on your profile. 
            Your AI finance coach is ready to help you achieve your goals!
          </p>
        </motion.div>
      ),
    },
  ];

  // Define mock data profiles based on user selections
  const getUserProfile = () => {
    // Default mock data for each profile type
    const profileData = {
      highschool: {
        type: 'High School Student',
        income: { amount: 75, frequency: 'weekly', source: 'Allowance' },
        expenses: [
          { category: 'Entertainment', amount: 25 },
          { category: 'Food', amount: 15 },
          { category: 'Transportation', amount: 10 }
        ],
        savingsGoal: { name: 'College Fund', target: 5000, current: 1250 },
        nextMilestone: { name: 'Save $1500', reward: '15% College Prep Badge' }
      },
      college: {
        type: 'College Student',
        income: { amount: 250, frequency: 'bi-weekly', source: 'Part-time job' },
        expenses: [
          { category: 'Food', amount: 80 },
          { category: 'Books', amount: 60 },
          { category: 'Entertainment', amount: 40 },
          { category: 'Dorm supplies', amount: 30 }
        ],
        savingsGoal: { name: 'Spring Break Trip', target: 1200, current: 350 },
        nextMilestone: { name: 'Save $500', reward: 'Student Saver Badge' }
      },
      graduate: {
        type: 'Fresh Graduate',
        income: { amount: 3200, frequency: 'monthly', source: 'Salary' },
        expenses: [
          { category: 'Rent', amount: 1100 },
          { category: 'Student Loans', amount: 400 },
          { category: 'Groceries', amount: 350 },
          { category: 'Utilities', amount: 200 },
          { category: 'Transportation', amount: 150 }
        ],
        savingsGoal: { name: 'Emergency Fund', target: 10000, current: 1500 },
        nextMilestone: { name: 'Save $3000', reward: 'Financial Security Badge' }
      },
      parent: {
        type: 'Parent/Family Manager',
        income: { amount: 5500, frequency: 'monthly', source: 'Salary' },
        expenses: [
          { category: 'Mortgage', amount: 1800 },
          { category: 'Groceries', amount: 800 },
          { category: 'Childcare', amount: 1200 },
          { category: 'Utilities', amount: 350 },
          { category: 'Car payment', amount: 450 }
        ],
        savingsGoal: { name: 'Family Vacation', target: 5000, current: 2200 },
        nextMilestone: { name: 'Save $3000', reward: 'Family Planner Badge' }
      }
    };
    
    // Return the appropriate profile based on user selections
    return profileData[profile.lifeStage];
  };

  // Check if current step has a valid selection
  const isCurrentStepValid = () => {
    // First and last steps don't require selections
    if (currentStep === 0 || currentStep === steps.length - 1) return true;
    
    // Check if appropriate selection exists for current step
    switch (currentStep) {
      case 1: // Life Stage
        return profile.lifeStage !== null;
      case 2: // Income Type
        return profile.incomeType !== null;
      case 3: // Financial Priority
        return profile.financialPriority !== null;
      default:
        return true;
    }
  };

  const handleNext = () => {
    // Only proceed if current step is valid
    if (!isCurrentStepValid()) {
      // Could add a visual indication that selection is required
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding by saving profile data
      const userProfile = getUserProfile();
      
      // Save both the mock data profile AND the actual questionnaire responses
      // This ensures we have both structured data and the raw answers
      localStorage.setItem('centsi_user_profile', JSON.stringify(userProfile));
      localStorage.setItem('centsi_questionnaire_responses', JSON.stringify({
        lifeStage: profile.lifeStage,
        incomeType: profile.incomeType,
        financialPriority: profile.financialPriority
      }));
      
      // Reset achievement progress for new logins coming from the questionnaire
      localStorage.removeItem('centsi_achievements');
      
      // Reset savings goals for new logins coming from the questionnaire
      localStorage.removeItem('centsi_financial_data');
      
      // Clear data load state to ensure dashboard starts empty after onboarding
      clearDataLoadState();
      
      // Save username separately for easy access
      if (profile.name) {
        localStorage.setItem('centsi_username', profile.name);
      }
      
      // Call the login function passed from App.js if it exists
      if (onLogin) {
        onLogin();
      }
      
      // Navigate to dashboard
      navigate('/home');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white text-center">
            {currentStepData.title}
          </h1>
          <p className="text-gray-300 text-center mt-1">
            {currentStepData.description}
          </p>
        </div>
        
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-${index === currentStep ? '10' : '8'} mx-1 rounded-full transition-all duration-300 ${
                index === currentStep ? 'bg-accent-500' : 
                index < currentStep ? 'bg-accent-700' : 'bg-dark-600'
              }`}
            />
          ))}
        </motion.div>
        
        <div className="mb-8 bg-dark-800 bg-opacity-70 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-dark-700">
          {currentStepData.content}
        </div>
        
        <div className="flex justify-between">
          {currentStep > 0 ? (
            <motion.button
              onClick={handleBack}
              className="px-6 py-3 border border-dark-500 text-gray-300 hover:text-white hover:border-dark-400 rounded-lg transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back
            </motion.button>
          ) : (
            <div></div>
          )}
          <motion.button
            onClick={handleNext}
            disabled={!isCurrentStepValid()}
            className={`px-8 py-3 ${isCurrentStepValid() 
              ? 'bg-gradient-to-r from-accent-500 to-secondary-500 hover:from-accent-600 hover:to-secondary-600 text-white' 
              : 'bg-dark-600 text-gray-500 cursor-not-allowed'} 
              font-bold rounded-lg shadow-lg transition-all duration-300`}
            whileHover={isCurrentStepValid() ? { scale: 1.05 } : {}}
            whileTap={isCurrentStepValid() ? { scale: 0.95 } : {}}
          >
            {currentStep === steps.length - 1 ? 'Go to Dashboard' : 'Next'}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;