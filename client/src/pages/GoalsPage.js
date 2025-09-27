import React, { useState } from 'react';
import Header from '../components/layout/Header';

const GoalsPage = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Spring Break Fund',
      currentAmount: 350,
      targetAmount: 500,
      progress: 70,
      deadline: '2026-03-10',
      category: 'Travel'
    },
    {
      id: 2,
      name: 'Emergency Fund',
      currentAmount: 125,
      targetAmount: 300,
      progress: 42,
      deadline: null,
      category: 'Security'
    },
    {
      id: 3,
      name: 'New Laptop',
      currentAmount: 200,
      targetAmount: 1000,
      progress: 20,
      deadline: '2026-01-15',
      category: 'Tech'
    }
  ]);
  
  return (
    <div className="pb-16">
      <Header title="My Goals" />
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Savings Goals</h2>
          <button className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm">
            + New Goal
          </button>
        </div>
        
        <div className="space-y-4">
          {goals.map(goal => (
            <div key={goal.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{goal.name}</h3>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{goal.category}</span>
              </div>
              
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>${goal.currentAmount}</span>
                <span>${goal.targetAmount}</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-primary-500 h-2.5 rounded-full" 
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              
              <div className="mt-3 flex justify-between">
                <span className="text-xs text-gray-500">
                  {goal.deadline ? `Due by ${new Date(goal.deadline).toLocaleDateString()}` : 'No deadline'}
                </span>
                <span className="text-xs font-medium text-primary-600">{goal.progress}%</span>
              </div>
              
              <div className="mt-3">
                <button className="w-full bg-gray-100 text-gray-700 py-1 rounded text-sm">
                  Add Funds
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Budget Limits</h2>
          
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Monthly Food</h3>
              <span className="text-xs text-warning font-medium">80% used</span>
            </div>
            
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>$160 spent</span>
              <span>$200 limit</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-warning h-2.5 rounded-full" 
                style={{ width: '80%' }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Entertainment</h3>
              <span className="text-xs text-success font-medium">45% used</span>
            </div>
            
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>$45 spent</span>
              <span>$100 limit</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-success h-2.5 rounded-full" 
                style={{ width: '45%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;