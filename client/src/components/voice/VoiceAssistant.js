import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { SpeechConfig, AudioConfig, SpeechRecognizer, ResultReason, PropertyId } from 'microsoft-cognitiveservices-speech-sdk';
import axios from 'axios';

const VoiceAssistant = forwardRef(({ onTranscript, isListening, setIsListening, onInterrupt }, ref) => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle, listening, processing, speaking
  const recognizerRef = useRef(null);
  const [speechCredentials, setSpeechCredentials] = useState(null);
  const processingTimeoutRef = useRef(null);
  const isDisposedRef = useRef(false);
  
  // Get speech credentials when component mounts
  // Function to initiate listening that doesn't depend on state
  const initializeListening = useRef(() => {
    if (speechCredentials?.key && speechCredentials?.region) {
      startListening();
    }
  });

  useEffect(() => {
    const fetchSpeechCredentials = async () => {
      try {
        // Try to get token from backend
        console.log('[VoiceAssistant] Fetching speech token from server...');
        const response = await axios.get('/api/ai/speech/token');
        console.log('[VoiceAssistant] Speech token response received:', 
          response.data?.status === 'success' ? 'Success' : 'Failed');
        
        if (response.data && response.data.status === 'success') {
          console.log('[VoiceAssistant] Setting speech credentials with region:', response.data.region);
          setSpeechCredentials({
            key: response.data.key,
            region: response.data.region,
            endpoint: response.data.endpoint || null
          });
          
          // Always auto-start listening with a small delay to ensure credentials are set
          setTimeout(() => {
            initializeListening.current();
          }, 1000);
          
        } else {
          console.error('[VoiceAssistant] Failed to get speech token:', response.data);
        }
      } catch (error) {
        console.error('[VoiceAssistant] Error fetching speech token:', error.message);
        console.error('[VoiceAssistant] Full error:', error);
        
        // Fallback to environment variables if available
        const envKey = process.env.REACT_APP_AZURE_SPEECH_KEY;
        const envRegion = process.env.REACT_APP_AZURE_SPEECH_REGION;
        const envEndpoint = process.env.REACT_APP_AZURE_SPEECH_ENDPOINT;
        
        if (envKey && (envRegion || envEndpoint)) {
          setSpeechCredentials({
            key: envKey,
            region: envRegion,
            endpoint: envEndpoint
          });
          
          // Always auto-start listening
          setTimeout(() => {
            initializeListening.current();
          }, 1000);
        }
      }
    };
    
    fetchSpeechCredentials();
    
    return () => {
      // Clean up any lingering recognizers when component unmounts
      if (recognizerRef.current && !isDisposedRef.current) {
        try {
          isDisposedRef.current = true;
          recognizerRef.current.stopContinuousRecognitionAsync();
          recognizerRef.current.close();
          recognizerRef.current = null;
        } catch (err) {
          console.error('[VoiceAssistant] Error closing recognizer on unmount:', err);
        }
      }
    };
  }, []); // Empty dependency array is fine now as we're using useRef
  
  const startListening = async () => {
    if (!speechCredentials?.key || !speechCredentials?.region) {
      console.error('Speech credentials not available');
      return;
    }
    
    // If we have a disposed recognizer, clean it up properly
    if (recognizerRef.current && isDisposedRef.current) {
      recognizerRef.current = null;
    }
    
    // If AI is speaking, interrupt it first
    if (onInterrupt && typeof onInterrupt === 'function') {
      onInterrupt();
    }

    try {
      setIsListening(true);
      setStatus('listening');
      setMessage('');
      
      // Create speech config using subscription key and region
      const speechConfig = SpeechConfig.fromSubscription(
        speechCredentials.key,
        speechCredentials.region
      );
      
      // Configure speech recognition language
      speechConfig.speechRecognitionLanguage = 'en-US';
      
      // Enable lower latency settings
      speechConfig.setProperty(PropertyId.SpeechServiceResponse_PostprocessingOption, 'TrueText');
      
      // Longer silence timeouts for continuous conversation to avoid premature cutoffs
      speechConfig.setProperty(PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs, '1500');
      speechConfig.setProperty(PropertyId.Speech_SegmentationSilenceTimeoutMs, '1500'); 
      speechConfig.setProperty(PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs, '5000');
      
      const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
      
      // Reset disposed flag since we're creating a new instance
      isDisposedRef.current = false;
      recognizerRef.current = recognizer;
      
      // Set up event handlers for continuous recognition
      recognizer.recognized = (s, e) => {
        if (e.result.reason === ResultReason.RecognizedSpeech && e.result.text.trim() !== '') {
          const transcript = e.result.text;
          console.log('[VoiceAssistant] Speech recognized:', transcript);
          setMessage(transcript);
          onTranscript(transcript);
          setStatus('processing');
          
          // In continuous mode, we pause listening but will restart after response
          pauseListening();
          
          // Set a timeout to reset status if processing takes too long
          processingTimeoutRef.current = setTimeout(() => {
            setStatus('idle');
            // Always auto-restart listening
            startListening();
          }, 15000); // 15 seconds timeout
        }
      };
      
      // Handle intermediate results for faster feedback
      recognizer.recognizing = (s, e) => {
        const partialTranscript = e.result.text;
        if (partialTranscript.trim() !== '') {
          setMessage(partialTranscript + '...');
        }
      };
      
      recognizer.canceled = (s, e) => {
        console.log('[VoiceAssistant] Recognition canceled:', e.reason);
        setIsListening(false);
        setStatus('idle');
      };

      // Start continuous recognition
      await recognizer.startContinuousRecognitionAsync();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setStatus('idle');
      setIsListening(false);
    }
  };
  
  const pauseListening = () => {
    if (recognizerRef.current && !isDisposedRef.current) {
      try {
        recognizerRef.current.stopContinuousRecognitionAsync(
          () => {
            setIsListening(false);
            console.log('[VoiceAssistant] Paused listening - will resume after response');
            // We keep the recognizer reference for reuse
          },
          (error) => {
            console.error('[VoiceAssistant] Error pausing recognition:', error);
            setIsListening(false);
          }
        );
      } catch (error) {
        console.error('[VoiceAssistant] Error pausing recognition:', error);
        setIsListening(false);
      }
    }
  };
  
  const stopListening = () => {
    if (recognizerRef.current && !isDisposedRef.current) {
      try {
        recognizerRef.current.stopContinuousRecognitionAsync(
          () => {
            setIsListening(false);
            if (status !== 'processing') {
              setStatus('idle');
            }
            if (recognizerRef.current && !isDisposedRef.current) {
              isDisposedRef.current = true;
              recognizerRef.current.close();
              recognizerRef.current = null;
            }
          },
          (error) => {
            console.error('[VoiceAssistant] Error stopping recognition:', error);
            setIsListening(false);
            setStatus('idle');
            if (recognizerRef.current && !isDisposedRef.current) {
              isDisposedRef.current = true;
              recognizerRef.current.close();
              recognizerRef.current = null;
            }
          }
        );
      } catch (error) {
        console.error('[VoiceAssistant] Error stopping recognition:', error);
        setIsListening(false);
        setStatus('idle');
        if (recognizerRef.current && !isDisposedRef.current) {
          isDisposedRef.current = true;
          recognizerRef.current.close();
          recognizerRef.current = null;
        }
      }
    }
  };
  
  useEffect(() => {
    return () => {
      // Cleanup
      if (recognizerRef.current && !isDisposedRef.current) {
        try {
          isDisposedRef.current = true;
          recognizerRef.current.close();
          recognizerRef.current = null;
        } catch (err) {
          console.error('[VoiceAssistant] Error closing recognizer in cleanup:', err);
        }
      }
      
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);
  
  // Expose methods to parent component through ref
  useImperativeHandle(ref, () => ({
    startListening,
    stopListening,
    pauseListening
  }));
  
  return (
    <div className="fixed bottom-20 right-4 flex flex-col items-end space-y-3">
      {/* Status indicator button */}
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
});

export default VoiceAssistant;