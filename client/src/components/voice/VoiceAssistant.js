import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import SpeechTranscriptionOverlay from './SpeechTranscriptionOverlay';
import AudioRecorderService from '../../services/AudioRecorderService';

const VoiceAssistant = forwardRef(({ onTranscript, isListening, setIsListening, onInterrupt }, ref) => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle, listening, processing, speaking
  const [elevenlabsApiKey, setElevenlabsApiKey] = useState(null);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [error, setError] = useState(null);
  const processingTimeoutRef = useRef(null);
  const diagModeRef = useRef(false); // For diagnostic mode
  
  // Get ElevenLabs API key when component mounts
  useEffect(() => {
    const fetchElevenlabsApiKey = async () => {
      try {
        // Try to get token from backend
        console.log('[VoiceAssistant] Fetching ElevenLabs API key from server...');
        const response = await axios.get('/api/ai/elevenlabs/token');
        
        if (response.data && response.data.status === 'success') {
          console.log('[VoiceAssistant] ElevenLabs API key received');
          setElevenlabsApiKey(response.data.api_key);
          
          // Auto-start listening with a small delay
          setTimeout(() => {
            startListening();
          }, 1000);
        } else {
          console.error('[VoiceAssistant] Failed to get ElevenLabs API key:', response.data);
          
          // Fallback to environment variable if available
          const envApiKey = process.env.REACT_APP_ELEVENLABS_API_KEY;
          if (envApiKey) {
            setElevenlabsApiKey(envApiKey);
            setTimeout(() => {
              startListening();
            }, 1000);
          }
        }
      } catch (error) {
        console.error('[VoiceAssistant] Error fetching ElevenLabs API key:', error.message);
        console.error('[VoiceAssistant] Full error:', error);
        
        // Fallback to environment variable if available
        const envApiKey = process.env.REACT_APP_ELEVENLABS_API_KEY;
        if (envApiKey) {
          setElevenlabsApiKey(envApiKey);
          setTimeout(() => {
            startListening();
          }, 1000);
        }
      }
    };
    
    fetchElevenlabsApiKey();
    
    return () => {
      // Clean up when component unmounts
      stopListening();
    };
  }, []);
  
  const startListening = async () => {
    console.log('[VoiceAssistant] Starting new listening session');
    
    // Reset any error state
    setError(null);
    
    // If AI is speaking, interrupt it
    if (onInterrupt && typeof onInterrupt === 'function') {
      onInterrupt();
    }
    
    try {
      // Reset state
      setCurrentTranscript('');
      setMessage('');
      setStatus('idle');
      
      // First, ensure any existing recorder is completely cleaned up
      await AudioRecorderService.cleanup();
      console.log('[VoiceAssistant] Cleaned up previous recorder resources');
      
      // Initialize a fresh audio recorder
      console.log('[VoiceAssistant] Initializing fresh recorder for this turn');
      const initialized = await AudioRecorderService.initialize();
      if (!initialized) {
        throw new Error('Failed to initialize audio recorder');
      }
      
      // Set up event handlers for the recorder
      AudioRecorderService.onDataAvailable = (data) => {
        console.log(`[VoiceAssistant] Audio data available: ${data.size} bytes`);
        // Real-time processing could be done here if needed
      };
      
      AudioRecorderService.onStop = async (audioBlob) => {
        console.log(`[VoiceAssistant] Recording stopped, audio blob size: ${audioBlob?.size || 0} bytes`);
        
        if (!audioBlob || audioBlob.size < 100) {
          console.error('[VoiceAssistant] Audio blob too small or missing');
          setStatus('idle');
          setIsListening(false);
          setError('No audio recorded');
          return;
        }
        
        setStatus('processing');
        
        try {
          // Create form data to send to server
          const formData = new FormData();
          formData.append('audio', audioBlob);
          
          // Add diagnostic flag if enabled
          if (diagModeRef.current) {
            formData.append('diagnostic', 'true');
          }
          
          console.log('[VoiceAssistant] Sending audio to server for transcription');
          
          // Send audio to server for transcription
          const response = await axios.post('/api/ai/elevenlabs/speech-to-text', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          if (response.data && response.data.status === 'success') {
            const transcript = response.data.text;
            console.log('[VoiceAssistant] Speech transcribed:', transcript);
            
            if (transcript.trim() !== '') {
              setMessage(transcript);
              setCurrentTranscript(transcript);
              onTranscript(transcript);
            } else {
              setStatus('idle');
              setIsListening(false);
              setCurrentTranscript('');
              setError('No speech detected');
            }
          } else {
            console.error('[VoiceAssistant] Transcription failed:', response.data);
            setStatus('idle');
            setIsListening(false);
            setCurrentTranscript('');
            setError(response.data?.message || 'Transcription failed');
          }
        } catch (error) {
          console.error('[VoiceAssistant] Error during transcription:', error);
          setStatus('idle');
          setIsListening(false);
          setCurrentTranscript('');
          setError(error.message || 'Error processing audio');
        }
      };
      
      AudioRecorderService.onError = (error) => {
        console.error('[VoiceAssistant] Audio recorder error:', error);
        setStatus('idle');
        setIsListening(false);
        setError(error.message || 'Audio recording error');
      };
      
      AudioRecorderService.onStart = () => {
        console.log('[VoiceAssistant] Recording started');
        setStatus('listening');
        setIsListening(true);
      };
      
      // Start recording with 1 second chunks for more responsive updates
      const started = AudioRecorderService.start(1000);
      if (!started) {
        throw new Error('Failed to start recording');
      }
      
      // Set a timeout to automatically stop recording after 10 seconds 
      const timeout = setTimeout(() => {
        if (AudioRecorderService.isRecording()) {
          stopListening();
        }
      }, 10000);
      
      return () => clearTimeout(timeout);
    } catch (error) {
      console.error('[VoiceAssistant] Error starting recording:', error);
      setStatus('idle');
      setIsListening(false);
      setError(error.message || 'Failed to start recording');
      
      // Clean up any resources
      AudioRecorderService.cleanup();
    }
  };
  
  const pauseListening = () => {
    console.log('[VoiceAssistant] Pausing listening');
    
    const paused = AudioRecorderService.pause();
    if (paused) {
      setIsListening(false);
      setStatus('idle');
    } else {
      // If pause fails, just stop completely
      stopListening();
    }
  };
  
  const stopListening = () => {
    console.log('[VoiceAssistant] Stopping listening');
    
    // Stop the recording
    AudioRecorderService.stop();
    
    // The onStop handler will handle the audio processing
  };
  
  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      console.log('[VoiceAssistant] Component unmounting - cleaning up resources');
      AudioRecorderService.cleanup();
      
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);
  
  // Safety mechanism to ensure we don't get stuck in processing state
  useEffect(() => {
    let processingTimeout;
    
    if (status === 'processing') {
      // If we're in processing state for too long, reset to idle
      processingTimeout = setTimeout(() => {
        console.log('[VoiceAssistant] Processing timeout reached, resetting state');
        setStatus('idle');
        setIsListening(false);
        setError('Processing timed out');
      }, 10000); // 10 seconds timeout
    }
    
    return () => {
      if (processingTimeout) clearTimeout(processingTimeout);
    };
  }, [status]);

  // Define resume listening function
  const resumeListening = () => {
    console.log('[VoiceAssistant] Resuming listening');
    if (AudioRecorderService.getState() === 'paused') {
      const resumed = AudioRecorderService.resume();
      if (resumed) {
        setStatus('listening');
        setIsListening(true);
      } else {
        // If resume fails, start fresh
        startListening();
      }
    } else {
      // If not paused, start fresh
      startListening();
    }
  };
  
  // Toggle diagnostic mode
  const toggleDiagnosticMode = () => {
    diagModeRef.current = !diagModeRef.current;
    console.log(`[VoiceAssistant] Diagnostic mode ${diagModeRef.current ? 'enabled' : 'disabled'}`);
  };
  
  // Expose methods to parent component through ref
  useImperativeHandle(ref, () => ({
    startListening,
    stopListening,
    pauseListening,
    resumeListening,
    toggleDiagnosticMode
  }));
  
  return (
    <>
      {/* Fullscreen overlay for transcription */}
      <SpeechTranscriptionOverlay 
        isListening={isListening} 
        transcript={currentTranscript} 
        status={status}
        error={error}
        diagMode={diagModeRef.current}
      />
      
      {/* Mic button */}
      <div className="fixed bottom-20 right-4 flex flex-col items-end space-y-3">
        {/* Status indicator button */}
        <button 
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg 
            ${error ? 'bg-red-700' :
              status === 'idle' ? 'bg-primary-500' : 
              status === 'listening' ? 'bg-red-500 animate-pulse' : 
              status === 'processing' ? 'bg-yellow-500' : 
              'bg-primary-500'}`}
          onClick={status === 'listening' ? stopListening : startListening}
          disabled={false} // Never disable the button so users can always click it
          title={error || status}
        >
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
        
        {/* Diagnostic mode toggle button (only visible in development) */}
        {process.env.NODE_ENV === 'development' && (
          <button
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${diagModeRef.current ? 'bg-green-500' : 'bg-gray-500'}`}
            onClick={toggleDiagnosticMode}
            title="Toggle diagnostic mode"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        )}
      </div>
    </>
  );
});

export default VoiceAssistant;