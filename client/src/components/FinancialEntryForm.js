import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

/**
 * FinancialEntryForm - A reusable form component for adding financial data
 * 
 * @param {string} type - The type of entry ('income', 'expense', or 'savings')
 * @param {function} onSubmit - Function to call when form is submitted
 * @param {function} onClose - Function to close the form
 */
const FinancialEntryForm = ({ type, onSubmit, onClose }) => {
  // Default form state based on type
  const getInitialFormState = () => {
    switch(type) {
      case 'income':
        return {
          amount: '',
          frequency: 'monthly',
          source: ''
        };
      case 'expense':
        return {
          name: '',
          amount: '',
          category: 'other',
          recurring: true,
          frequency: 'monthly'
        };
      case 'savings':
        return {
          name: '',
          target: '',
          current: '0',
          deadline: ''
        };
      default:
        return {};
    }
  };

  const [formData, setFormData] = useState(getInitialFormState());
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Common validations
    if (type === 'income' || type === 'expense') {
      if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
        newErrors.amount = 'Please enter a valid amount';
      }
    }
    
    // Income-specific validations
    if (type === 'income') {
      if (!formData.source) {
        newErrors.source = 'Please enter an income source';
      }
    }
    
    // Expense-specific validations
    if (type === 'expense') {
      if (!formData.name) {
        newErrors.name = 'Please enter an expense name';
      }
    }
    
    // Savings-specific validations
    if (type === 'savings') {
      if (!formData.name) {
        newErrors.name = 'Please enter a goal name';
      }
      if (!formData.target || isNaN(formData.target) || parseFloat(formData.target) <= 0) {
        newErrors.target = 'Please enter a valid target amount';
      }
      if (isNaN(formData.current) || parseFloat(formData.current) < 0) {
        newErrors.current = 'Please enter a valid current amount';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert numeric fields to numbers
      const processedFormData = { ...formData };
      if (type === 'income' || type === 'expense') {
        processedFormData.amount = parseFloat(formData.amount);
      }
      if (type === 'savings') {
        processedFormData.target = parseFloat(formData.target);
        processedFormData.current = parseFloat(formData.current);
      }
      
      onSubmit(processedFormData);
    }
  };

  const getFormTitle = () => {
    switch(type) {
      case 'income':
        return 'Add Income';
      case 'expense':
        return 'Add Expense';
      case 'savings':
        return 'Add Savings Goal';
      default:
        return 'Add Entry';
    }
  };

  const renderIncomeForm = () => (
    <>
      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <div className="input-wrapper">
          <span className="currency-symbol">$</span>
          <input
            type="number"
            step="0.01"
            name="amount"
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            className={errors.amount ? 'error' : ''}
          />
        </div>
        {errors.amount && <div className="error-message">{errors.amount}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="frequency">Frequency</label>
        <select
          name="frequency"
          id="frequency"
          value={formData.frequency}
          onChange={handleChange}
        >
          <option value="weekly">Weekly</option>
          <option value="bi-weekly">Bi-Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="annually">Annually</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="source">Source</label>
        <input
          type="text"
          name="source"
          id="source"
          value={formData.source}
          onChange={handleChange}
          className={errors.source ? 'error' : ''}
          placeholder="e.g., Salary, Freelance"
        />
        {errors.source && <div className="error-message">{errors.source}</div>}
      </div>
    </>
  );
  
  const renderExpenseForm = () => (
    <>
      <div className="form-group">
        <label htmlFor="name">Expense Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
          placeholder="e.g., Rent, Groceries"
        />
        {errors.name && <div className="error-message">{errors.name}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <div className="input-wrapper">
          <span className="currency-symbol">$</span>
          <input
            type="number"
            step="0.01"
            name="amount"
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            className={errors.amount ? 'error' : ''}
          />
        </div>
        {errors.amount && <div className="error-message">{errors.amount}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          name="category"
          id="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="housing">Housing</option>
          <option value="food">Food</option>
          <option value="transportation">Transportation</option>
          <option value="utilities">Utilities</option>
          <option value="entertainment">Entertainment</option>
          <option value="healthcare">Healthcare</option>
          <option value="education">Education</option>
          <option value="debt">Debt</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div className="form-group checkbox">
        <input
          type="checkbox"
          name="recurring"
          id="recurring"
          checked={formData.recurring}
          onChange={handleChange}
        />
        <label htmlFor="recurring">Recurring Expense</label>
      </div>
      
      {formData.recurring && (
        <div className="form-group">
          <label htmlFor="frequency">Frequency</label>
          <select
            name="frequency"
            id="frequency"
            value={formData.frequency}
            onChange={handleChange}
          >
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="annually">Annually</option>
          </select>
        </div>
      )}
    </>
  );
  
  const renderSavingsForm = () => (
    <>
      <div className="form-group">
        <label htmlFor="name">Goal Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
          placeholder="e.g., Emergency Fund, Vacation"
        />
        {errors.name && <div className="error-message">{errors.name}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="target">Target Amount</label>
        <div className="input-wrapper">
          <span className="currency-symbol">$</span>
          <input
            type="number"
            step="0.01"
            name="target"
            id="target"
            value={formData.target}
            onChange={handleChange}
            className={errors.target ? 'error' : ''}
          />
        </div>
        {errors.target && <div className="error-message">{errors.target}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="current">Current Amount</label>
        <div className="input-wrapper">
          <span className="currency-symbol">$</span>
          <input
            type="number"
            step="0.01"
            name="current"
            id="current"
            value={formData.current}
            onChange={handleChange}
            className={errors.current ? 'error' : ''}
          />
        </div>
        {errors.current && <div className="error-message">{errors.current}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="deadline">Target Date (Optional)</label>
        <input
          type="date"
          name="deadline"
          id="deadline"
          value={formData.deadline}
          onChange={handleChange}
        />
      </div>
    </>
  );

  const renderFormFields = () => {
    switch(type) {
      case 'income':
        return renderIncomeForm();
      case 'expense':
        return renderExpenseForm();
      case 'savings':
        return renderSavingsForm();
      default:
        return <p>Invalid form type</p>;
    }
  };

  return (
    <motion.div 
      className="financial-entry-form-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="financial-entry-form">
        <div className="form-header">
          <h2>{getFormTitle()}</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {renderFormFields()}
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default FinancialEntryForm;