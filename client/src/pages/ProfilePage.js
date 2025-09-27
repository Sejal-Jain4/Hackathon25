import React, { useState } from 'react';
import Header from '../components/layout/Header';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    userType: 'college',
    livingArrangement: 'dorms',
    notificationsEnabled: true,
    darkModeEnabled: false
  });
  
  return (
    <div className="pb-16">
      <Header title="Profile" />
      
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-500 text-2xl font-medium">AJ</span>
          </div>
          <div className="ml-4">
            <h2 className="font-semibold text-lg">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="mt-1 px-2 py-0.5 bg-primary-100 text-primary-600 text-xs rounded-full inline-block">
              {user.userType === 'college' ? 'College Student' : 
               user.userType === 'highschool' ? 'High School Student' : 
               user.userType === 'working' ? 'Working Student' : 'Graduate Student'}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="font-semibold text-lg mb-3">Account Settings</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Student Type</h3>
                <p className="text-sm text-gray-500">Personalization based on your situation</p>
              </div>
              <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                <option value="highschool">High School</option>
                <option value="college" selected>College</option>
                <option value="working">Working Student</option>
                <option value="graduate">Graduate Student</option>
              </select>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Living Arrangement</h3>
                <p className="text-sm text-gray-500">Helps us suggest relevant budgeting</p>
              </div>
              <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                <option value="home">With Parents</option>
                <option value="dorms" selected>Dorms</option>
                <option value="apartment">Off-Campus Apartment</option>
                <option value="house">Off-Campus House</option>
              </select>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-gray-500">Get alerts for spending and goals</p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle">
                <input 
                  type="checkbox" 
                  id="toggle-notifications" 
                  className="sr-only" 
                  checked={user.notificationsEnabled}
                  onChange={() => setUser({...user, notificationsEnabled: !user.notificationsEnabled})}
                />
                <label 
                  htmlFor="toggle-notifications" 
                  className={`block h-6 w-12 rounded-full transition-colors ${user.notificationsEnabled ? 'bg-primary-500' : 'bg-gray-300'}`}
                >
                  <span 
                    className={`block w-4 h-4 mt-1 ml-1 rounded-full transition-transform ${user.notificationsEnabled ? 'bg-white transform translate-x-6' : 'bg-white'}`} 
                  />
                </label>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Dark Mode</h3>
                <p className="text-sm text-gray-500">Switch to dark theme</p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle">
                <input 
                  type="checkbox" 
                  id="toggle-darkmode" 
                  className="sr-only" 
                  checked={user.darkModeEnabled}
                  onChange={() => setUser({...user, darkModeEnabled: !user.darkModeEnabled})}
                />
                <label 
                  htmlFor="toggle-darkmode" 
                  className={`block h-6 w-12 rounded-full transition-colors ${user.darkModeEnabled ? 'bg-primary-500' : 'bg-gray-300'}`}
                >
                  <span 
                    className={`block w-4 h-4 mt-1 ml-1 rounded-full transition-transform ${user.darkModeEnabled ? 'bg-white transform translate-x-6' : 'bg-white'}`} 
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="font-semibold text-lg mb-3">Linked Accounts</h2>
          <button className="w-full bg-gray-100 text-gray-700 py-2 rounded flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Connect Bank Account
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <button className="w-full text-error py-2">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;