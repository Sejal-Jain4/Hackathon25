import React, { useState, useEffect } from 'react';
import { Card } from '../ui';
import { motion } from 'framer-motion';
import { recordLearningCompleted } from '../../utils/dataService';

// Create a unique key for each learning activity completion in localStorage
const getCompletionKey = (title) => `centsi_learning_completed_${title.replace(/\s+/g, '_').toLowerCase()}`;

const LearningActivity = ({ title, description, content, onAchievementComplete }) => {
  // Initialize state from localStorage if available
  const [completed, setCompleted] = useState(false);
  
  // Check localStorage on component mount
  useEffect(() => {
    const isCompleted = localStorage.getItem(getCompletionKey(title)) === 'true';
    if (isCompleted) {
      setCompleted(true);
    }
  }, [title]);
  
  const handleCompletion = () => {
    setCompleted(true);
    
    // Store completion status in localStorage
    localStorage.setItem(getCompletionKey(title), 'true');
    
    // Record achievement for completing learning activity
    const achievement = recordLearningCompleted();
    
    // If achievement was completed and parent handler exists, pass the achievement to parent
    if (achievement && onAchievementComplete) {
      onAchievementComplete(achievement);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-4">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {completed ? (
              <motion.span 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-green-500 text-white px-3 py-1 rounded-full text-sm"
              >
                Completed
              </motion.span>
            ) : null}
          </div>
          <p className="text-gray-300 mb-4">{description}</p>
          
          <div className="text-gray-300 mb-6">
            {content}
          </div>
          
          {!completed && (
            <button
              onClick={handleCompletion}
              className="bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
            >
              Mark as Completed
            </button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default LearningActivity;