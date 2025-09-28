import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * A smaller card component typically used for statistics or small info sections
 */
const SmallCard = ({
  children,
  className = '',
  animation = true,
  delay = 0,
  onClick,
  ...props
}) => {
  // Base card classes
  const baseClasses = "bg-dark-700 rounded-lg p-3";
  
  // Combined classes
  const combinedClasses = `${baseClasses} ${className}`;

  // Common animation props
  const animationProps = animation ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, delay }
  } : {};

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

SmallCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  animation: PropTypes.bool,
  delay: PropTypes.number,
  onClick: PropTypes.func
};

export default SmallCard;