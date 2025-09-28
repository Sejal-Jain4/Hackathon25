import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import { Card } from '../components/ui';
import { 
  getCompleteUserData, 
  getUsername
} from '../utils/dataService';
import { FaEdit, FaSave } from 'react-icons/fa';

const ProfilePage = () => {
  // Get user data from our data service
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState({
    name: '',
    email: '',
    userType: 'college'
  });
  const [isEditing, setIsEditing] = useState(false);

  // Function to update user profile in localStorage is not currently used
  
  // Instead, we're using direct localStorage updates elsewhere in the code
  
  // Function to update questionnaire responses in localStorage
  const saveQuestionnaireResponses = (updatedResponses) => {
    if (userData && userData.questionnaire) {
      const newQuestionnaire = {
        ...userData.questionnaire,
        ...updatedResponses
      };
      
      // Update localStorage
      localStorage.setItem('centsi_questionnaire_responses', JSON.stringify(newQuestionnaire));
      
      // Update UI state
      setUserData({
        ...userData,
        questionnaire: newQuestionnaire
      });
    }
  };
  
  // Load user data on component mount
  useEffect(() => {
    const completeData = getCompleteUserData();
    const username = getUsername();
    
    setUserData(completeData);
    
    // Map data to our user state
    setUser({
      name: username,
      email: completeData.profile?.email || username + '@example.com',
      userType: completeData.questionnaire?.lifeStage || 'college'
    });
  }, []);
  
  return (
    <div className="pb-16 bg-dark-900 min-h-screen text-white">
      <Header title="Profile" />
      
      <div className="flex flex-col lg:flex-row">
        <div className="p-4 w-full lg:w-1/3">
          <Card className="p-6 mb-6 flex items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">
              {user.name ? user.name.split(' ').map(name => name[0]).join('').toUpperCase().substring(0, 2) : ''}
            </span>
          </div>
          <div className="ml-4">
            <h2 className="font-bold text-xl text-white">{user.name}</h2>
            <div className="mt-1 px-3 py-1 bg-gradient-to-r from-accent-500/20 to-primary-500/20 text-accent-400 text-xs rounded-full inline-block">
              {user.userType === 'college' ? 'College Student' : 
               user.userType === 'highschool' ? 'High School Student' : 
               user.userType === 'working' ? 'Working Student' : 'Graduate Student'}
            </div>
          </div>
        </Card>
        
        <Card className="p-6 mb-6" delay={0.1}>
          <h2 className="text-xl font-bold bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent mb-4">Account Settings</h2>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-white">Student Type</h3>
                <p className="text-sm text-gray-400">Personalization based on your situation</p>
              </div>
              <select 
                className="bg-dark-700 border border-accent-500/30 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 hover:border-accent-500/50 transition-all shadow-sm"
                value={user.userType}
                onChange={(e) => {
                  const newUserType = e.target.value;
                  setUser({...user, userType: newUserType});
                  
                  // Update questionnaire in localStorage
                  saveQuestionnaireResponses({ lifeStage: newUserType });
                }}
              >
                <option value="highschool">High School</option>
                <option value="college">College</option>
                <option value="working">Working Student</option>
                <option value="graduate">Graduate Student</option>
              </select>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-white">Primary Financial Goal</h3>
                <p className="text-sm text-gray-400">Helps us tailor advice to your needs</p>
              </div>
              <select 
                className="bg-dark-700 border border-accent-500/30 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 hover:border-accent-500/50 transition-all shadow-sm"
                value={userData?.questionnaire?.financialGoal || 'budget'}
                onChange={(e) => {
                  const newGoal = e.target.value;
                  
                  // Update questionnaire in localStorage
                  saveQuestionnaireResponses({ financialGoal: newGoal });
                  
                  // Make sure UI reflects the change immediately
                  if (userData) {
                    setUserData({
                      ...userData,
                      questionnaire: {
                        ...userData.questionnaire,
                        financialGoal: newGoal
                      }
                    });
                  }
                }}
              >
                <option value="saving">Build Savings</option>
                <option value="debt">Pay Off Debt</option>
                <option value="budget">Better Budgeting</option>
                <option value="investing">Start Investing</option>
              </select>
            </div>
          </div>
        </Card>
        
        <Card className="p-6" delay={0.2}>
          <button 
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-lg flex items-center justify-center"
            onClick={() => {
              // Clear all local storage data
              localStorage.removeItem('centsi_user_profile');
              localStorage.removeItem('centsi_username');
              localStorage.removeItem('centsi_auth');
              localStorage.removeItem('centsi_questionnaire_responses');
              localStorage.removeItem('centsi_financial_data');
              
              // Redirect to the landing page
              window.location.href = '/';
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </Card>
      </div>

      <div className="p-4 w-full lg:w-2/3 space-y-6">
        <Card className="p-6" delay={0.3}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">Profile Information</h2>
            <button 
              className={`${isEditing ? 'bg-primary-500 text-white' : 'bg-dark-700 text-gray-300'} px-4 py-2 rounded-lg shadow-md hover:bg-primary-600 transition-all text-sm flex items-center gap-2`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <FaSave className="text-white" />
                  Save
                </>
              ) : (
                <>
                  <FaEdit className="text-gray-300" />
                  Edit
                </>
              )}
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Full Name</label>
              {isEditing ? (
                <input 
                  type="text" 
                  className="bg-dark-700 border border-dark-600 text-white rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent-500"
                  value={user.name}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                />
              ) : (
                <p className="text-white">{user.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email Address</label>
              {isEditing ? (
                <input 
                  type="email" 
                  className="bg-dark-700 border border-dark-600 text-white rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent-500"
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                />
              ) : (
                <p className="text-white">{user.email}</p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6" delay={0.4}>
          <h2 className="text-xl font-bold bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent mb-6">Skills & Badges</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {['Budgeting', 'Saving', 'Credit', 'Investing'].map((skill, index) => (
              <div key={index} className="flex items-center bg-dark-700 p-3 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full flex items-center justify-center shadow-md mr-3">
                  <span className="text-white text-xs">{index + 1}</span>
                </div>
                <span className="text-white text-sm">{skill}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6" delay={0.5}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">Financial Goals</h2>
            <Link to="/goals" className="bg-accent-500 text-xs text-white px-3 py-1 rounded-lg hover:bg-accent-600 transition-all shadow-sm">View All</Link>
          </div>
          
          <div className="space-y-4">
            {userData?.financialData?.goals && userData.financialData.goals.length > 0 ? (
              userData.financialData.goals.slice(0, 2).map((goal, index) => (
                <div key={index} className="bg-dark-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-white">{goal.name}</h3>
                    <span className="text-xs px-2 py-1 bg-accent-500/20 text-accent-400 rounded-full">
                      ${goal.currentAmount} / ${goal.targetAmount}
                    </span>
                  </div>
                  <div className="w-full bg-dark-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-accent-500 to-primary-500 h-2 rounded-full" 
                      style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400">No financial goals set yet.</p>
                <Link to="/goals" className="text-accent-500 mt-2 inline-block hover:underline">Add your first goal</Link>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
    </div>
  );
};

export default ProfilePage;