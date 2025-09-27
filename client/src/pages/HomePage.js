import React, { useState } from 'react';
import Header from '../components/layout/Header';

const HomePage = () => {
  const [balance, setBalance] = useState(842.50);
  
  return (
    <div className="pb-16">
      <Header title="Centsi" />
      
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-lg font-medium text-gray-700">Current Balance</h2>
          <p className="text-3xl font-bold text-primary-600">${balance.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">Last updated today</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-lg font-medium text-gray-700 mb-2">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Food</p>
                <p className="text-xs text-gray-500">September 24, 2025</p>
              </div>
              <p className="text-error">-$23.50</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Part-time job</p>
                <p className="text-xs text-gray-500">September 22, 2025</p>
              </div>
              <p className="text-success">+$150.00</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Entertainment</p>
                <p className="text-xs text-gray-500">September 20, 2025</p>
              </div>
              <p className="text-error">-$15.00</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-lg font-medium text-gray-700 mb-2">Savings Goals</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="font-medium">Spring Break Fund</p>
                <p className="text-sm">$350/$500</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="font-medium">Emergency Fund</p>
                <p className="text-sm">$125/$300</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Voice Assistant Button */}
        <div className="fixed bottom-20 right-4">
          <button className="bg-primary-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;