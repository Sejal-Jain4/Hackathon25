import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import LearningActivity from '../components/learning/LearningActivity';

// Import achievement notification component for showing unlocked achievements
import { AchievementCelebration } from '../components/ui';

const LearnPage = () => {
  const [completedAchievement, setCompletedAchievement] = useState(null);

  // Sample learning activities
  const learningActivities = [
    {
      title: "Budgeting Basics",
      description: "Learn the fundamentals of creating and maintaining a personal budget.",
      content: (
        <>
          <h3 className="text-lg font-semibold mb-2">Why Budget?</h3>
          <p className="mb-3">
            Budgeting helps you understand where your money is going and gives you control over your finances.
            A good budget aligns your spending with your financial goals and priorities.
          </p>
          
          <h3 className="text-lg font-semibold mb-2">The 50/30/20 Rule</h3>
          <p className="mb-3">
            A popular budgeting method is the 50/30/20 rule:
          </p>
          <ul className="list-disc list-inside mb-3">
            <li>50% for needs (housing, food, utilities)</li>
            <li>30% for wants (entertainment, dining out)</li>
            <li>20% for savings and debt repayment</li>
          </ul>
          
          <h3 className="text-lg font-semibold mb-2">Tips for Successful Budgeting</h3>
          <ul className="list-disc list-inside">
            <li>Track all expenses for at least 30 days</li>
            <li>Identify areas where you can cut back</li>
            <li>Build an emergency fund</li>
            <li>Review and adjust your budget regularly</li>
          </ul>
        </>
      )
    },
    {
      title: "Emergency Fund Essentials",
      description: "Understand why emergency funds are critical and how to build yours.",
      content: (
        <>
          <h3 className="text-lg font-semibold mb-2">What is an Emergency Fund?</h3>
          <p className="mb-3">
            An emergency fund is money set aside for unexpected expenses like medical emergencies,
            car repairs, or job loss. It provides financial security and peace of mind.
          </p>
          
          <h3 className="text-lg font-semibold mb-2">How Much Should You Save?</h3>
          <p className="mb-3">
            Financial experts typically recommend saving 3-6 months of essential expenses.
            Start with a goal of $1,000, then build up from there.
          </p>
          
          <h3 className="text-lg font-semibold mb-2">Where to Keep Your Emergency Fund</h3>
          <p className="mb-3">
            Your emergency fund should be:
          </p>
          <ul className="list-disc list-inside mb-3">
            <li>Easily accessible (liquid)</li>
            <li>Not subject to market risks</li>
            <li>Earning some interest if possible</li>
          </ul>
          <p>Good options include high-yield savings accounts and money market accounts.</p>
        </>
      )
    }
  ];

  return (
    <div className="bg-dark-900 min-h-screen text-white">
      <Header title="Learn" />
      
      <div className="container mx-auto px-4 py-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Financial Education</h2>
            <p className="text-gray-300 mb-4">
              Welcome to the Learn section! Complete learning activities below to improve your financial literacy
              and earn achievements.
            </p>
            <p className="text-gray-300">
              Mark an activity as completed when you've read through the material to earn the "Financial Scholar" achievement.
            </p>
          </Card>
          
          {/* Learning Activities */}
          {learningActivities.map((activity, index) => (
            <LearningActivity
              key={index}
              title={activity.title}
              description={activity.description}
              content={activity.content}
              onAchievementComplete={(achievement) => {
                setCompletedAchievement(achievement);
                // Auto-hide the notification after 5 seconds
                setTimeout(() => {
                  setCompletedAchievement(null);
                }, 5000);
              }}
            />
          ))}
        </motion.div>
      </div>
      
      {/* Achievement celebration with confetti */}
      {completedAchievement && (
        <AchievementCelebration 
          achievement={completedAchievement} 
          onClose={() => setCompletedAchievement(null)} 
        />
      )}
    </div>
  );
};

export default LearnPage;