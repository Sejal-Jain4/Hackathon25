import React, { useState, useEffect, useRef } from 'react';
import { SpeechConfig, AudioConfig, SpeechRecognizer, ResultReason } from 'microsoft-cognitiveservices-speech-sdk';

const VoiceAssistant = ({ onTranscript, isListening, setIsListening }) => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle, listening, processing, speaking
  const recognizerRef = useRef(null);
  
  const startListening = async () => {
    try {
      setIsListening(true);
      setStatus('listening');
      
      // In a real app, we would fetch this from the backend
      // Here we're using a placeholder for demonstration
      const speechConfig = SpeechConfig.fromSubscription(
        'your-azure-speech-key',  // This would come from environment variables
        'your-azure-region'       // This would come from environment variables
      );
      
      const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
      
      recognizerRef.current = recognizer;
      
      recognizer.recognizeOnceAsync(result => {
        if (result.reason === ResultReason.RecognizedSpeech) {
          const transcript = result.text;
          setMessage(transcript);
          onTranscript(transcript);
          setStatus('processing');
        } else {
          console.error('Error recognizing speech.');
          setStatus('idle');
        }
        setIsListening(false);
        recognizerRef.current = null;
      });
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setStatus('idle');
      setIsListening(false);
    }
  };
  
  const stopListening = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync();
      recognizerRef.current = null;
      setIsListening(false);
      setStatus('idle');
    }
  };
  
  useEffect(() => {
    return () => {
      // Cleanup
      if (recognizerRef.current) {
        recognizerRef.current.close();
      }
    };
  }, []);
  
  return (
    <div className="fixed bottom-20 right-4">
      <button 
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg 
          ${status === 'idle' ? 'bg-primary-500' : 
            status === 'listening' ? 'bg-red-500 animate-pulse' : 
            status === 'processing' ? 'bg-yellow-500' : 
            'bg-primary-500'}`}
        onClick={status === 'idle' ? startListening : stopListening}
        disabled={status === 'processing'}
      >
        {status === 'idle' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
        {status === 'listening' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
        {status === 'processing' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default VoiceAssistant;