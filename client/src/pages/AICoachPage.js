import React, { useState, useRef, useEffect } from 'react';
import VoiceAssistant from '../components/voice/VoiceAssistant';
import AiResponse from '../components/voice/AiResponse';
import ChatInterface from '../components/voice/ChatInterface';
import axios from 'axios';

const AICoachPage = () => {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTranscript = async (transcript) => {
    // Add user message to chat
    const userMessage = { text: transcript, isUser: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Simulate processing - in real app, this would call the AI backend
    setIsProcessing(true);
    
    try {
      // In a real app, this would be a call to your backend API with Azure OpenAI integration
      // const response = await axios.post('/api/ai/chat', { message: transcript });
      // const aiReply = response.data.reply;
      
      // For demo, we'll simulate a delay and response
      setTimeout(() => {
        const mockResponses = [
          "I can help you create a budget for this semester. What's your monthly income?",
          "Based on your spending habits, I recommend cutting back on entertainment by 15%.",
          "Have you considered setting up an emergency fund? Even $20 a week adds up quickly.",
          "Great progress on your savings goal! You've saved $120 this month.",
          "I notice you've been spending more than usual on dining out. Would you like some tips to save money on food?"
        ];
        
        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        setCurrentResponse(randomResponse);
        
        // Add AI message to chat
        const aiMessage = { text: randomResponse, isUser: false };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
        setIsProcessing(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsProcessing(false);
    }
  };

  const handleResponseComplete = () => {
    setCurrentResponse('');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="bg-primary-500 text-white p-4">
        <h1 className="text-2xl font-bold">AI Finance Coach</h1>
        <p className="text-sm">Ask Centsi about budgeting, saving, or financial tips!</p>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        <ChatInterface messages={messages} />
        <div ref={messagesEndRef} />
      </div>
      
      {isProcessing && (
        <div className="flex justify-center p-4">
          <div className="flex space-x-2 items-center">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            <span className="text-sm text-gray-500 ml-2">Centsi is thinking...</span>
          </div>
        </div>
      )}
      
      <VoiceAssistant 
        onTranscript={handleTranscript} 
        isListening={isListening}
        setIsListening={setIsListening}
      />
      
      {currentResponse && (
        <AiResponse 
          responseText={currentResponse} 
          onComplete={handleResponseComplete} 
        />
      )}
    </div>
  );
};

export default AICoachPage;