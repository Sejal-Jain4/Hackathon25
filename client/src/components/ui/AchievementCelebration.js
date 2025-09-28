import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import PropTypes from 'prop-types';

/**
 * Enhanced Achievement Celebration component
 * Shows a center modal popup with confetti when an achievement is unlocked
 */
const AchievementCelebration = ({ 
  achievement, 
  onClose,
  duration = 0 // 0 means it will stay until user closes it
}) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-close if duration is set
  useEffect(() => {
    if (achievement && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose, duration]);
  
  if (!achievement) return null;

  // Confetti colors based on achievement color gradient
  let colors = ['#ff62b7', '#9e4784', '#40f8ff', '#00a6fb']; // Default colors
  
  if (achievement.color.includes('green')) {
    colors = ['#34D399', '#10B981', '#059669', '#065F46'];
  } else if (achievement.color.includes('blue')) {
    colors = ['#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8'];
  } else if (achievement.color.includes('purple')) {
    colors = ['#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9'];
  } else if (achievement.color.includes('amber')) {
    colors = ['#FBBF24', '#F59E0B', '#D97706', '#B45309'];
  }
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        
        {/* Confetti effect */}
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
          colors={colors}
        />
        
        {/* Achievement modal */}
        <motion.div 
          className="bg-dark-800 rounded-xl border-2 shadow-2xl z-10 w-full max-w-md relative overflow-hidden"
          style={{ borderImage: `linear-gradient(to right, ${colors[0]}, ${colors[3]}) 1` }}
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          transition={{ 
            type: "spring",
            damping: 25,
            stiffness: 300
          }}
        >
          {/* Gradient top bar */}
          <div className="h-2 w-full bg-gradient-to-r from-accent-500 to-primary-500" />
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10"
            aria-label="Close celebration"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="p-6 text-center">
            <motion.div 
              className="inline-block"
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{
                type: "spring",
                delay: 0.2,
                duration: 0.8
              }}
            >
              <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center mb-4 shadow-lg`}>
                <span className="text-4xl">{achievement.icon}</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-1">Achievement Unlocked!</h2>
              <h3 className="text-xl font-semibold text-accent-400 mb-2">{achievement.name}</h3>
              <p className="text-gray-300 mb-4">{achievement.description}</p>
              
              <div className="p-3 rounded-lg bg-dark-700 inline-flex items-center mb-4">
                <span className="text-accent-400 font-bold text-xl mr-2">+{achievement.xpReward}</span>
                <span className="text-gray-300">XP Earned</span>
              </div>
              
              <div>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-300"
                >
                  Awesome!
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

AchievementCelebration.propTypes = {
  achievement: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    color: PropTypes.string.isRequired,
    xpReward: PropTypes.number
  }),
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number
};

export default AchievementCelebration;