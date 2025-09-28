import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Achievement card component for displaying user achievements
 */
const AchievementCard = ({
  name,
  description,
  icon,
  color,
  status = 'not-started', // 'not-started', 'in-progress', 'completed'
  progress = 0,
  delay = 0,
  index = 0,
  ...props
}) => {
  return (
    <motion.div
      className="relative min-w-[200px] w-[200px] h-[200px] bg-dark-700 rounded-lg p-5 border border-dark-600"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 * (index || delay) }}
      whileHover={{ 
        scale: 0.97,
        transition: { duration: 0.2 }
      }}
      {...props}
    >
      <div 
        className={`w-20 h-20 mb-4 mx-auto bg-gradient-to-br ${color} rounded-full flex items-center justify-center 
          ${status !== "completed" && 'opacity-80'} 
          ${status === "not-started" && 'grayscale'}`}
      >
        <span className="text-4xl">{icon}</span>
      </div>
      
      <div className="text-center">
        <p className="font-medium text-white text-lg">{name}</p>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
        
        {status === "in-progress" && progress > 0 && (
          <div className="mt-2">
            <div className="w-full bg-dark-600 rounded-full h-2 mt-1">
              <div 
                className="h-full bg-gradient-to-r from-accent-500 to-primary-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{progress}%</span>
              <span>100%</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

AchievementCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['not-started', 'in-progress', 'completed']),
  progress: PropTypes.number,
  delay: PropTypes.number,
  index: PropTypes.number
};

export default AchievementCard;