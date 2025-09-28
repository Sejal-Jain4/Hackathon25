import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactConfetti from 'react-confetti';

/**
 * Component to show a celebration animation when a savings goal is completed
 */
const SavingsGoalCelebration = ({ goalName, onComplete }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Get window dimensions for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Clean up after 5 seconds
    const timeout = setTimeout(() => {
      setShowConfetti(false);
      if (onComplete) onComplete();
    }, 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      {showConfetti && (
        <ReactConfetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          tweenDuration={5000}
        />
      )}
      
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="bg-dark-800 rounded-xl p-6 max-w-md shadow-2xl border-2 border-accent-500 pointer-events-auto"
      >
        <h2 className="text-2xl font-bold text-white mb-3">Goal Completed! 🎉</h2>
        <div className="text-center mb-6">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 0.8, 
              repeat: 3, 
              repeatType: "reverse"
            }}
            className="text-7xl mb-4"
          >
            🎯
          </motion.div>
        </div>
        <p className="text-gray-300 mb-6 text-center">
          Congratulations! You've reached your savings target for <strong>{goalName}</strong>!
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowConfetti(false);
            if (onComplete) onComplete();
          }}
          className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-3 rounded-lg"
        >
          Awesome!
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SavingsGoalCelebration;