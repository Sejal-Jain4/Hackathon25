import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

/**
 * FinancialEntryForm - A reusable form component for adding financial data
 * 
 * @param {string|object} type - The type of entry ('income', 'expense', or 'savings') or an object with {type, index}
 * @param {function} onSubmit - Function to call when form is submitted
 * @param {function} onClose - Function to close the form
 */
const FinancialEntryForm = ({ type, onSubmit, onClose }) => {
  // Extract type and index if type is an object
  const formType = typeof type === 'object' ? type.type : type;
  const editIndex = typeof type === 'object' ? type.index : null;
  const isEditing = editIndex !== null;
  
  // Default form state based on type
  const getInitialFormState = () => {
    // Get financial data from localStorage
    const finances = window.localStorage.getItem('centsi_financial_data') 
      ? JSON.parse(window.localStorage.getItem('centsi_financial_data')) 
      : null;
    
    if (!finances) {
      return getEmptyFormState(formType);
    }
    
    // Handle editing existing items
    if (isEditing) {
      switch(formType) {
        case 'expense':
          if (finances.expenses && finances.expenses[editIndex]) {
            const expense = finances.expenses[editIndex];
            return {
              name: expense.name || '',
              amount: expense.amount?.toString() || '',
              category: expense.category || 'other',
              recurring: expense.recurring !== false, // Default to true if not specified
              frequency: expense.frequency || 'monthly'
            };
          }
          break;
          
        case 'savings':
          if (finances.savingsGoals && finances.savingsGoals[editIndex]) {
            const goal = finances.savingsGoals[editIndex];
            return {
              name: goal.name || '',
              target: goal.target?.toString() || '',
              current: goal.current?.toString() || '0',
              deadline: goal.deadline || ''
            };
          }
          break;
      }
    }
    
    // Handle regular cases (no editing or editing but item not found)
    switch(formType) {
      case 'income':
        // If we have existing income data, use it for editing
        if (finances.income) {
          return {
            amount: finances.income.amount?.toString() || '',
            frequency: finances.income.frequency || 'monthly',
            source: finances.income.source || '',
            isVariable: finances.income.isVariable || false,
            averageAmount: finances.income.averageAmount?.toString() || ''
          };
        }
        break;
        
      case 'expense':
      case 'savings':
        // Return empty form for new items
        break;
    }
    
    // Return empty form state for all other cases
    return getEmptyFormState(formType);
  };
  
  // Helper to get empty form state
  const getEmptyFormState = (type) => {
    switch(type) {
      case 'income':
        return {
          amount: '',
          frequency: 'monthly',
          source: '',
          isVariable: false,
          averageAmount: ''
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
    if (formType === 'income' || formType === 'expense') {
      if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
        newErrors.amount = 'Please enter a valid amount';
      }
      
      if (formType === 'income') {
        if (!formData.source) {
          newErrors.source = 'Please select or specify an income source';
        }
        
        if (formData.isVariable && (!formData.averageAmount || isNaN(formData.averageAmount) || parseFloat(formData.averageAmount) <= 0)) {
          newErrors.averageAmount = 'Please provide a valid average amount';
        }
      }
    }
    
    // Income-specific validations
    if (formType === 'income') {
      if (!formData.source) {
        newErrors.source = 'Please enter an income source';
      }
    }
    
    // Expense-specific validations
    if (formType === 'expense') {
      if (!formData.name) {
        newErrors.name = 'Please enter an expense name';
      }
    }
    
    // Savings-specific validations
    if (formType === 'savings') {
      if (!formData.name) {
        newErrors.name = 'Please enter a goal name';
      }
      if (!formData.target || isNaN(formData.target) || parseFloat(formData.target) <= 0) {
        newErrors.target = 'Please enter a valid target amount';
      }
      if (isNaN(formData.current) || parseFloat(formData.current) < 0) {
        newErrors.current = 'Please enter a valid current amount';
      }
      // Ensure current amount doesn't exceed target amount
      if (parseFloat(formData.current) > parseFloat(formData.target)) {
        newErrors.current = 'Current amount cannot exceed target amount';
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
      if (formType === 'income' || formType === 'expense') {
        processedFormData.amount = parseFloat(formData.amount);
      }
      if (formType === 'savings') {
        processedFormData.target = parseFloat(formData.target);
        processedFormData.current = parseFloat(formData.current);
      }
      
      onSubmit(processedFormData);
    }
  };

  const getFormTitle = () => {
    switch(formType) {
      case 'income':
        return isEditing || formData.amount !== '' ? 'Edit Income' : 'Add Income';
      case 'expense':
        return isEditing ? 'Edit Expense' : 'Add Expense';
      case 'savings':
        return isEditing ? 'Edit Savings Goal' : 'Add Savings Goal';
      default:
        return isEditing ? 'Edit Entry' : 'Add Entry';
    }
  };

  const renderIncomeForm = () => (
    <>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-primary-400 mb-2">Your Income Details</h3>
        <p className="text-sm text-gray-400 mb-4">
          {formData.amount ? 'Update your income information as needed.' : 'Add details about your primary income source.'}
        </p>
      </div>
    
      <div className="form-group">
        <label htmlFor="source">Income Source</label>
        <div className="input-wrapper">
          <select
            name="source"
            id="source"
            value={formData.source}
            onChange={handleChange}
            className={errors.source ? 'error' : ''}
          >
            <option value="">Select a source or type below</option>
            <option value="Salary">Salary/Wages</option>
            <option value="Freelance">Freelance/Contract Work</option>
            <option value="Investments">Investments</option>
            <option value="Allowance">Allowance</option>
            <option value="Part-time">Part-time Job</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        {formData.source === 'Other' && (
          <input
            type="text"
            name="customSource"
            id="customSource"
            placeholder="Specify your income source"
            value={formData.customSource || ''}
            onChange={(e) => setFormData({...formData, customSource: e.target.value, source: e.target.value ? e.target.value : 'Other'})}
            className="mt-2"
          />
        )}
        
        {errors.source && <div className="error-message">{errors.source}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="amount">Amount (per period)</label>
        <div className="input-wrapper">
          <span className="currency-symbol">$</span>
          <input
            type="number"
            step="0.01"
            name="amount"
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            className={`amount-input ${errors.amount ? 'error' : ''}`}
            placeholder="0.00"
          />
        </div>
        {errors.amount && <div className="error-message">{errors.amount}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="frequency">How often do you receive this income?</label>
        <select
          name="frequency"
          id="frequency"
          value={formData.frequency}
          onChange={handleChange}
          className={errors.frequency ? 'error' : ''}
        >
          <option value="weekly">Weekly</option>
          <option value="bi-weekly">Every Two Weeks</option>
          <option value="monthly">Monthly</option>
          <option value="annually">Annually</option>
        </select>
        {errors.frequency && <div className="error-message">{errors.frequency}</div>}
      </div>
      
      <div className="form-group">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isVariable"
            name="isVariable"
            checked={formData.isVariable}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="isVariable">This income amount varies (is not consistent)</label>
        </div>
        <p className="text-xs text-gray-500 mt-1">Check this if your income changes from period to period</p>
      </div>
      
      {formData.isVariable && (
        <div className="form-group">
          <label htmlFor="averageAmount">Estimated average amount</label>
          <div className="input-wrapper">
            <span className="currency-symbol">$</span>
            <input
              type="number"
              step="0.01"
              name="averageAmount"
              id="averageAmount"
              value={formData.averageAmount || formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              className="amount-input"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Your best estimate of what you typically receive</p>
        </div>
      )}
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
            className={`amount-input ${errors.amount ? 'error' : ''}`}
            placeholder="0.00"
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
            className={`amount-input ${errors.target ? 'error' : ''}`}
            placeholder="0.00"
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
            className={`amount-input ${errors.current ? 'error' : ''}`}
            placeholder="0.00"
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
    switch(formType) {
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
            {isEditing && (formType === 'expense' || formType === 'savings') && (
              <button 
                type="button" 
                className="delete-button" 
                onClick={() => {
                  const finances = JSON.parse(localStorage.getItem('centsi_financial_data'));
                  if (finances) {
                    if (formType === 'expense' && finances.expenses) {
                      finances.expenses.splice(editIndex, 1);
                      localStorage.setItem('centsi_financial_data', JSON.stringify(finances));
                    } else if (formType === 'savings' && finances.savingsGoals) {
                      finances.savingsGoals.splice(editIndex, 1);
                      localStorage.setItem('centsi_financial_data', JSON.stringify(finances));
                    }
                    onClose();
                  }
                }}
              >
                Delete
              </button>
            )}
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