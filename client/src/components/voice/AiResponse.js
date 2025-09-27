import React, { useState, useEffect } from 'react';
import { SpeechConfig, SpeechSynthesizer, AudioConfig } from 'microsoft-cognitiveservices-speech-sdk';

const AiResponse = ({ responseText, onComplete }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, preparing, speaking

  useEffect(() => {
    if (responseText && responseText.trim() !== '') {
      speakResponse(responseText);
    }
  }, [responseText]);

  const speakResponse = async (text) => {
    if (!text || isSpeaking) return;
    
    try {
      setStatus('preparing');
      setIsSpeaking(true);
      
      // In a real app, fetch these from environment variables via the backend
      const speechConfig = SpeechConfig.fromSubscription(
        'your-azure-speech-key',
        'your-azure-region'
      );
      
      speechConfig.speechSynthesisVoiceName = "en-US-AriaNeural";
      
      const audioConfig = AudioConfig.fromDefaultSpeakerOutput();
      const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
      
      setStatus('speaking');
      
      synthesizer.speakTextAsync(
        text,
        result => {
          setIsSpeaking(false);
          setStatus('idle');
          synthesizer.close();
          onComplete && onComplete();
        },
        error => {
          console.error('Error speaking response:', error);
          setIsSpeaking(false);
          setStatus('idle');
          synthesizer.close();
          onComplete && onComplete();
        }
      );
    } catch (error) {
      console.error('Error initializing speech synthesis:', error);
      setIsSpeaking(false);
      setStatus('idle');
      onComplete && onComplete();
    }
  };

  return (
    <div className={`fixed bottom-20 left-4 p-3 rounded-lg bg-primary-100 
      max-w-xs ${status !== 'idle' ? 'shadow-lg border border-primary-300' : ''}`}>
      
      {status === 'preparing' && (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          <p className="text-sm text-gray-700">Preparing...</p>
        </div>
      )}
      
      {status === 'speaking' && (
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-4 bg-primary-500 rounded animate-sound-wave1"></div>
            <div className="w-2 h-4 bg-primary-500 rounded animate-sound-wave2"></div>
            <div className="w-2 h-4 bg-primary-500 rounded animate-sound-wave3"></div>
          </div>
          <p className="text-sm text-gray-700">Speaking...</p>
        </div>
      )}
    </div>
  );
};

export default AiResponse;