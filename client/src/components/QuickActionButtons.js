import React from 'react';
import { FaPlus, FaMinus, FaPiggyBank } from 'react-icons/fa';
import { motion } from 'framer-motion';

/**
 * QuickActionButtons - Component for quick actions to add income, expenses, and savings goals
 * 
 * @param {function} onAddIncome - Function to call when add income button is clicked
 * @param {function} onAddExpense - Function to call when add expense button is clicked
 * @param {function} onAddSavings - Function to call when add savings goal button is clicked
 */
const QuickActionButtons = ({ onAddIncome, onAddExpense, onAddSavings }) => {
  const buttonVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.1 * i,
        duration: 0.3
      }
    })
  };

  return (
    <div className="quick-action-buttons">
      <motion.div 
        className="quick-action-button income"
        onClick={onAddIncome}
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.95 }}
        custom={1}
      >
        <div className="icon"><FaPlus /></div>
        <p>Income</p>
      </motion.div>

      <motion.div 
        className="quick-action-button expense"
        onClick={onAddExpense}
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.95 }}
        custom={2}
      >
        <div className="icon"><FaMinus /></div>
        <p>Expense</p>
      </motion.div>

      <motion.div 
        className="quick-action-button savings"
        onClick={onAddSavings}
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.95 }}
        custom={3}
      >
        <div className="icon"><FaPiggyBank /></div>
        <p>Savings</p>
      </motion.div>
    </div>
  );
};

export default QuickActionButtons;