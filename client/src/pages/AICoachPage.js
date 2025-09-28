import React, { useState, useRef, useEffect } from 'react';
import VoiceAssistant from '../components/voice/VoiceAssistant';
import AiResponse from '../components/voice/AiResponse';
import ChatInterface from '../components/voice/ChatInterface';
import axios from 'axios';
import Header from '../components/layout/Header';
import { Card } from '../components/ui';

const AICoachPage = () => {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const messagesEndRef = useRef(null);
  const aiResponseRef = useRef(null);
  const voiceAssistantRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTranscript = async (transcript) => {
    console.log('[AICoachPage] Received transcript:', transcript);
    // Add user message to chat
    const userMessage = { text: transcript, isUser: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Call the AI backend
    setIsProcessing(true);
    console.log('[AICoachPage] Starting AI backend call...');
    
    try {
      // Get user profile and questionnaire responses from localStorage
      const userProfileString = localStorage.getItem('centsi_user_profile');
      const questionnaireString = localStorage.getItem('centsi_questionnaire_responses');
      
      const userProfile = userProfileString ? JSON.parse(userProfileString) : {};
      const questionnaireResponses = questionnaireString ? JSON.parse(questionnaireString) : {};
      
      // Merge profile data with questionnaire responses for more context
      const fullUserContext = {
        ...userProfile,
        questionnaire: questionnaireResponses
      };
      
      // Call backend API with Azure OpenAI integration
      console.log('[AICoachPage] Sending to /api/ai/chat with context:', {
        messageLength: transcript.length,
        hasProfile: Object.keys(fullUserContext).length > 0,
        hasQuestionnaire: fullUserContext.questionnaire && Object.keys(fullUserContext.questionnaire).length > 0
      });

      const response = await axios.post('/api/ai/chat', { 
        message: transcript,
        userId: localStorage.getItem('centsi_username') || 'default_user',
        profile: fullUserContext
      });
      
      console.log('[AICoachPage] Response received:', response.data);
      if (response.data && response.data.status === 'success') {
        const aiReply = response.data.reply;
        console.log('[AICoachPage] AI reply:', aiReply);
        setCurrentResponse(aiReply);
        
        // Add AI message to chat
        const aiMessage = { text: aiReply, isUser: false };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      } else {
        console.error('[AICoachPage] Invalid response format:', response.data);
        throw new Error('Invalid response from server');
      }
      
      setIsProcessing(false);
    } catch (error) {
      console.error('[AICoachPage] Error calling AI service:', error);
      console.error('[AICoachPage] Error details:', error.response?.data || error.message);
      
      // Display error message to user instead of using mock responses
      const errorMessage = "Sorry, I'm having trouble connecting to my AI brain right now. Please try again in a moment.";
      setCurrentResponse(errorMessage);
      
      // Add error message to chat
      const errorAiMessage = { text: errorMessage, isUser: false, isError: true };
      setMessages(prevMessages => [...prevMessages, errorAiMessage]);
      
      setIsProcessing(false);
    }
  };

  const handleResponseComplete = () => {
    setCurrentResponse('');
    
    // Always restart listening after response is complete
    if (voiceAssistantRef.current && 
        typeof voiceAssistantRef.current.startListening === 'function') {
      // Small delay to avoid overlapping
      setTimeout(() => {
        voiceAssistantRef.current.startListening();
      }, 500);
    }
  };
  
  const handleInterrupt = () => {
    // This function will be passed to VoiceAssistant
    // to allow it to interrupt the AI when the user starts speaking
    if (aiResponseRef.current && typeof aiResponseRef.current.stopSpeaking === 'function') {
      aiResponseRef.current.stopSpeaking();
      setCurrentResponse('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-dark-900">
      <Header title="AI Finance Coach" />
      
      <div className="flex-grow overflow-y-auto">
        <ChatInterface messages={messages} />
        <div ref={messagesEndRef} />
      </div>
      
      {isProcessing && (
        <Card className="mb-4 mx-4">
          <div className="flex justify-center p-2">
            <div className="flex space-x-2 items-center">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              <span className="text-sm text-gray-500 ml-2">Centsi is thinking...</span>
            </div>
          </div>
        </Card>
      )}
      
      <VoiceAssistant 
        ref={voiceAssistantRef}
        onTranscript={handleTranscript} 
        isListening={isListening}
        setIsListening={setIsListening}
        onInterrupt={handleInterrupt}
      />
      
      {currentResponse && (
        <AiResponse 
          ref={aiResponseRef}
          responseText={currentResponse} 
          onComplete={handleResponseComplete}
          canBeInterrupted={true}
        />
      )}
    </div>
  );
};

export default AICoachPage;