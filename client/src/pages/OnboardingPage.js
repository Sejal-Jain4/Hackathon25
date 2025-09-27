import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    userType: 'college',
    livingArrangement: 'dorms',
    incomeSource: ['part-time', 'allowance'],
    savingGoal: ''
  });

  const steps = [
    {
      title: 'Welcome to Centsi!',
      description: 'Your AI financial coach for students',
      content: (
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="mt-6 text-gray-600">
            Let's set up your profile so we can personalize your experience!
          </p>
        </div>
      ),
    },
    {
      title: 'About You',
      description: 'Tell us a bit about yourself',
      content: (
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Your name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="your.email@example.com"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Student Type',
      description: 'This helps us personalize your experience',
      content: (
        <div>
          <p className="text-gray-600 mb-4">I'm currently...</p>
          <div className="space-y-3">
            {[
              { id: 'highschool', label: 'In High School' },
              { id: 'college', label: 'In College (Undergraduate)' },
              { id: 'working', label: 'A Working Student' },
              { id: 'graduate', label: 'In Graduate School' },
            ].map((option) => (
              <div
                key={option.id}
                className={`p-3 border rounded-lg cursor-pointer ${
                  profile.userType === option.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                }`}
                onClick={() => setProfile({ ...profile, userType: option.id })}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      profile.userType === option.id ? 'border-primary-500' : 'border-gray-300'
                    }`}
                  >
                    {profile.userType === option.id && (
                      <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                    )}
                  </div>
                  <span className="ml-2">{option.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Living Situation',
      description: 'This helps us suggest relevant budgeting tips',
      content: (
        <div>
          <p className="text-gray-600 mb-4">I currently live...</p>
          <div className="space-y-3">
            {[
              { id: 'home', label: 'At Home with Parents/Family' },
              { id: 'dorms', label: 'In Dorms/Campus Housing' },
              { id: 'apartment', label: 'In Off-Campus Apartment' },
              { id: 'house', label: 'In Off-Campus House' },
            ].map((option) => (
              <div
                key={option.id}
                className={`p-3 border rounded-lg cursor-pointer ${
                  profile.livingArrangement === option.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                }`}
                onClick={() => setProfile({ ...profile, livingArrangement: option.id })}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      profile.livingArrangement === option.id ? 'border-primary-500' : 'border-gray-300'
                    }`}
                  >
                    {profile.livingArrangement === option.id && (
                      <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                    )}
                  </div>
                  <span className="ml-2">{option.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Income Sources',
      description: 'Select all that apply',
      content: (
        <div>
          <p className="text-gray-600 mb-4">I get money from...</p>
          <div className="space-y-3">
            {[
              { id: 'part-time', label: 'Part-Time Job' },
              { id: 'full-time', label: 'Full-Time Job' },
              { id: 'allowance', label: 'Parents/Family Allowance' },
              { id: 'financial-aid', label: 'Financial Aid/Scholarships' },
              { id: 'side-gig', label: 'Side Gigs/Freelance' },
            ].map((option) => (
              <div
                key={option.id}
                className={`p-3 border rounded-lg cursor-pointer ${
                  profile.incomeSource.includes(option.id) ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                }`}
                onClick={() => {
                  const updatedSources = profile.incomeSource.includes(option.id)
                    ? profile.incomeSource.filter(id => id !== option.id)
                    : [...profile.incomeSource, option.id];
                  setProfile({ ...profile, incomeSource: updatedSources });
                }}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center ${
                      profile.incomeSource.includes(option.id) ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                    }`}
                  >
                    {profile.incomeSource.includes(option.id) && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="ml-2">{option.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Financial Goal',
      description: 'What are you saving for?',
      content: (
        <div>
          <p className="text-gray-600 mb-4">I'm most interested in...</p>
          <div className="space-y-3">
            {[
              { id: 'emergency', label: 'Building an Emergency Fund' },
              { id: 'spring-break', label: 'Saving for Spring Break' },
              { id: 'tech', label: 'Saving for Tech/Gadgets' },
              { id: 'debt', label: 'Managing Student Debt' },
              { id: 'budget', label: 'Better Monthly Budgeting' },
            ].map((option) => (
              <div
                key={option.id}
                className={`p-3 border rounded-lg cursor-pointer ${
                  profile.savingGoal === option.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                }`}
                onClick={() => setProfile({ ...profile, savingGoal: option.id })}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      profile.savingGoal === option.id ? 'border-primary-500' : 'border-gray-300'
                    }`}
                  >
                    {profile.savingGoal === option.id && (
                      <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                    )}
                  </div>
                  <span className="ml-2">{option.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'All Set!',
      description: "You're ready to start your financial journey",
      content: (
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="mt-6 text-gray-600">
            Thanks {profile.name}! We've set up your profile and are ready to help you achieve your financial goals.
          </p>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and navigate to home
      navigate('/');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center">{currentStepData.title}</h1>
          <p className="text-gray-500 text-center mt-1">{currentStepData.description}</p>
        </div>
        
        <div className="flex justify-center mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 mx-1 rounded-full ${
                index === currentStep ? 'bg-primary-500' : index < currentStep ? 'bg-primary-300' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        
        <div className="mb-8">
          {currentStepData.content}
        </div>
        
        <div className="flex justify-between">
          {currentStep > 0 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;