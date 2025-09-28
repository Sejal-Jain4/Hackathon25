import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * A reusable card component with consistent styling across the app
 */
const Card = ({
  children,
  className = '',
  showGradientBorder = false,
  showGradientTop = false,
  animation = true,
  delay = 0,
  height,
  onClick,
  ...props
}) => {
  // Base card classes
  const baseClasses = "bg-dark-800 rounded-xl shadow-xl border border-dark-700";
  
  // Additional classes
  const heightClass = height ? (typeof height === 'number' ? `h-[${height}px]` : height) : '';
  const paddingClass = !showGradientTop ? 'p-6' : '';
  const overflowClass = height ? 'overflow-hidden' : '';
  const flexClass = height ? 'flex flex-col' : '';
  const cursorClass = onClick ? 'cursor-pointer hover:border-dark-600 transition-colors' : '';
  
  // Combined classes
  const combinedClasses = `${baseClasses} ${paddingClass} ${heightClass} ${overflowClass} ${flexClass} ${cursorClass} ${className}`;

  // Common animation props
  const animationProps = animation ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay }
  } : {};

  // Render with gradient border if requested
  if (showGradientBorder) {
    return (
      <motion.div 
        className="bg-gradient-to-r from-accent-500 via-secondary-500 to-primary-500 rounded-xl p-0.5 shadow-lg"
        {...animationProps}
        {...props}
      >
        <div 
          className={`${heightClass} ${overflowClass} ${flexClass} bg-dark-800 rounded-lg p-4`}
          onClick={onClick}
        >
          {children}
        </div>
      </motion.div>
    );
  }

  // Render with gradient top if requested
  if (showGradientTop) {
    return (
      <motion.div 
        className={`${combinedClasses} relative`}
        {...animationProps}
        {...props}
        onClick={onClick}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-500 via-primary-500 to-secondary-500"></div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    );
  }

  // Default render
  return (
    <motion.div 
      className={combinedClasses}
      {...animationProps}
      {...props}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  showGradientBorder: PropTypes.bool,
  showGradientTop: PropTypes.bool,
  animation: PropTypes.bool,
  delay: PropTypes.number,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func
};

export default Card;