import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Achievement notification component
 * Shows a toast notification when an achievement is unlocked
 */
const AchievementNotification = ({ 
  achievement, 
  onClose, 
  duration = 5000 // How long to show the notification in milliseconds
}) => {
  useEffect(() => {
    if (achievement) {
      // Auto-close after duration
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose, duration]);
  
  if (!achievement) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed top-4 right-4 z-50 w-80 overflow-hidden"
        initial={{ opacity: 0, x: 100, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 100, scale: 0.8 }}
        transition={{ 
          type: "spring",
          damping: 25,
          stiffness: 350
        }}
      >
        <div className="bg-dark-800 rounded-lg border border-dark-600 shadow-2xl overflow-hidden">
          <div className={`h-1.5 w-full bg-gradient-to-r ${achievement.color}`}>
            <motion.div 
              className="h-full bg-white bg-opacity-30"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
          </div>
          
          <div className="p-4">
            <div className="flex items-start">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center mr-3 flex-shrink-0`}>
                <span className="text-xl">{achievement.icon}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white">{achievement.name}</h3>
                  <button 
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Close notification"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-300 mt-1">{achievement.description}</p>
                <div className="mt-2 flex items-center">
                  <span className="text-xs px-2 py-0.5 bg-accent-500 bg-opacity-20 text-accent-300 rounded-full">
                    Achievement Unlocked!
                  </span>
                  <span className="text-xs text-accent-400 ml-2">+{achievement.xpReward} XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

AchievementNotification.propTypes = {
  achievement: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired, // Changed from string to node to support emoji and SVG
    color: PropTypes.string.isRequired,
    xpReward: PropTypes.number
  }),
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number
};

export default AchievementNotification;