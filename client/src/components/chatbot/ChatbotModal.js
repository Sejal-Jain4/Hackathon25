import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRegPaperPlane, FaTimes, FaChartLine } from 'react-icons/fa';
import { BsRobot } from 'react-icons/bs';
import { getCompleteUserData, generateFinancialReport } from '../../utils/dataService';

const ChatbotModal = ({ isOpen, onClose, userProfile = {} }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGenerateReport, setShowGenerateReport] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Add initial welcome message when the modal first opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsLoading(true);
      
      // Generate welcome message based on user profile
      const welcomePrompt = generateWelcomePrompt(userProfile);
      
      axios.post('/api/ai/chat', { 
        message: welcomePrompt,
        userId: localStorage.getItem('centsi_username') || 'default_user',
        profile: getUserContext()
      })
      .then(response => {
        if (response.data && response.data.status === 'success') {
          setMessages([
            { text: response.data.reply, isUser: false }
          ]);
        }
      })
      .catch(error => {
        console.error('Error generating welcome message:', error);
        setMessages([
          { text: "Hello! I'm your Centsi financial assistant. How can I help you today?", isUser: false }
        ]);
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  }, [isOpen, userProfile]);
  
  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Generate a welcome prompt based on user profile
  const generateWelcomePrompt = (profile) => {
    return `Generate a personalized welcome message for a user with the following profile:
      Life stage: ${profile.lifeStage || 'Unknown'}
      Income type: ${profile.incomeType || 'Unknown'}
      Financial priority: ${profile.financialPriority || 'Unknown'}
      
      Make the message feel personal, friendly, and tailored to their situation. 
      Keep it short (2-3 sentences) and mention their financial priority specifically.`;
  };
  
  // Get full user context using dataService
  const getUserContext = () => {
    // This includes profile, questionnaire responses, and financial data
    const completeData = getCompleteUserData();
    return completeData;
  };
  
  // Check if message is asking for a report
  const isAskingForReport = (message) => {
    const reportKeywords = [
      'report', 'summary', 'overview', 'analysis', 'generate report', 
      'create report', 'financial report', 'show me my finances',
      'summarize', 'give me a report'
    ];
    
    const lowerMessage = message.toLowerCase();
    return reportKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  // Generate a financial report
  const handleGenerateReport = async () => {
    setIsLoading(true);
    
    try {
      // Generate the report using our data service
      const report = generateFinancialReport();
      
      // Create a message to pass to the OpenAI service
      const reportPrompt = `Generate a concise financial report summary based on this data:
      Username: ${report.username}
      Life Stage: ${report.lifeStage}
      Monthly Income: $${report.incomeMonthly}
      Total Expenses: $${report.totalExpenses}
      Balance: $${report.balance}
      Savings Rate: ${report.savingsRate.toFixed(2)}%
      
      Top expenses: ${report.topExpenseCategories.map(([category, amount]) => 
        `${category}: $${amount}`).join(', ')}
      
      Savings goals: ${report.savingsGoalsProgress.map(goal => 
        `${goal.name}: $${goal.current}/$${goal.target} (${goal.progress.toFixed(1)}%)`).join(', ')}
      
      Give a friendly, personalized summary with key insights and 1-2 actionable recommendations.`;
      
      // Call OpenAI to generate the report narrative
      const response = await axios.post('/api/ai/chat', { 
        message: reportPrompt,
        userId: localStorage.getItem('centsi_username') || 'default_user',
        profile: getUserContext(),
        isSystemRequest: true
      });
      
      if (response.data && response.data.status === 'success') {
        const reportMessage = { 
          text: response.data.reply,
          isUser: false,
          isReport: true 
        };
        setMessages(prevMessages => [...prevMessages, reportMessage]);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      
      const errorMessage = { 
        text: "I'm sorry, I couldn't generate your financial report right now. Please try again later.", 
        isUser: false, 
        isError: true 
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
    
    setIsLoading(false);
    setShowGenerateReport(false);
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage = { text: inputMessage, isUser: true };
    setMessages([...messages, userMessage]);
    
    // Check if user is asking for a report
    const wantsReport = isAskingForReport(inputMessage);
    
    // Clear input field
    setInputMessage('');
    setIsLoading(true);
    
    if (wantsReport) {
      // Handle report generation
      await handleGenerateReport();
    } else {
      try {
        // Call backend API with Azure OpenAI integration
        const response = await axios.post('/api/ai/chat', { 
          message: inputMessage,
          userId: localStorage.getItem('centsi_username') || 'default_user',
          profile: getUserContext()
        });
        
        if (response.data && response.data.status === 'success') {
          // Add AI response
          const aiMessage = { text: response.data.reply, isUser: false };
          setMessages(prevMessages => [...prevMessages, aiMessage]);
          
          // Check if we should show the report button after this interaction
          if (response.data.reply.toLowerCase().includes('report') || 
              response.data.reply.toLowerCase().includes('overview') ||
              response.data.reply.toLowerCase().includes('summary')) {
            setShowGenerateReport(true);
          }
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Error calling AI service:', error);
        
        // Add error message
        const errorMessage = { 
          text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.", 
          isUser: false, 
          isError: true 
        };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
    }
    
    setIsLoading(false);
  };
  
  // Handle Enter key press in the input field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="bg-dark-800 rounded-xl w-full max-w-md h-[500px] flex flex-col shadow-2xl border border-dark-700"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center">
                <BsRobot className="text-white text-xl mr-2" />
                <h3 className="text-white font-bold">Centsi Financial Assistant</h3>
              </div>
              <button 
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
              >
                <FaTimes />
              </button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto p-4 bg-dark-800">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isUser 
                          ? 'bg-primary-500 text-white rounded-br-none' 
                          : message.isError
                            ? 'bg-red-600 text-white rounded-bl-none'
                            : message.isReport
                              ? 'bg-accent-800 text-white rounded-bl-none border border-accent-500'
                              : 'bg-dark-700 text-white rounded-bl-none'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-dark-700 text-white rounded-lg rounded-bl-none p-3 max-w-[80%]">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Report Button (conditionally shown) */}
            {showGenerateReport && (
              <div className="px-3 pb-2 bg-dark-900">
                <button
                  onClick={handleGenerateReport}
                  disabled={isLoading}
                  className="w-full p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <FaChartLine className="mr-2" />
                  Generate Financial Report
                </button>
              </div>
            )}
            
            {/* Input Area */}
            <div className="p-3 border-t border-dark-700 bg-dark-900 rounded-b-xl">
              <div className="flex items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about finances..."
                  className="flex-grow p-3 rounded-l-lg bg-dark-700 border-none text-white focus:outline-none focus:ring-1 focus:ring-accent-500"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className={`p-3 rounded-r-lg ${
                    isLoading || !inputMessage.trim() 
                      ? 'bg-dark-600 text-dark-400 cursor-not-allowed' 
                      : 'bg-accent-500 text-white hover:bg-accent-600'
                  }`}
                >
                  <FaRegPaperPlane />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatbotModal;