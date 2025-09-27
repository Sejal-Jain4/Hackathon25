import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { SpeechConfig, SpeechSynthesizer, AudioConfig, SpeechSynthesisOutputFormat, PropertyId } from 'microsoft-cognitiveservices-speech-sdk';
import axios from 'axios';

const AiResponse = forwardRef(({ responseText, onComplete, canBeInterrupted = true }, ref) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, preparing, speaking
  const [speechCredentials, setSpeechCredentials] = useState(null);
  const synthesizerRef = useRef(null);
  const isComponentMountedRef = useRef(true);
  
  // Get speech credentials when component mounts
  useEffect(() => {
    const fetchSpeechCredentials = async () => {
      try {
        // Try to get token from backend
        const response = await axios.get('/api/ai/speech/token');
        if (response.data && response.data.status === 'success') {
          setSpeechCredentials({
            key: response.data.key,
            region: response.data.region,
            endpoint: response.data.endpoint || null
          });
        } else {
          console.error('Failed to get speech token');
        }
      } catch (error) {
        console.error('Error fetching speech token:', error);
        
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
        }
      }
    };
    
    fetchSpeechCredentials();
  }, []);

  useEffect(() => {
    if (responseText && responseText.trim() !== '' && speechCredentials) {
      speakResponse(responseText);
    }
  }, [responseText, speechCredentials]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isComponentMountedRef.current = false;
      stopSpeaking();
    };
  }, []);

  const stopSpeaking = () => {
    if (synthesizerRef.current) {
      try {
        synthesizerRef.current.close();
        synthesizerRef.current = null;
        if (isComponentMountedRef.current) {
          setIsSpeaking(false);
          setStatus('idle');
        }
      } catch (error) {
        console.error('Error stopping speech synthesis:', error);
      }
    }
  };
  
  // Expose stopSpeaking method to parent component
  useImperativeHandle(ref, () => ({
    stopSpeaking
  }));
  
  const speakResponse = async (text) => {
    if (!text || !speechCredentials?.key || !speechCredentials?.region) return;
    
    // First stop any ongoing speech
    stopSpeaking();
    
    try {
      setStatus('preparing');
      setIsSpeaking(true);
      
      // Create speech config using subscription key and region
      const speechConfig = SpeechConfig.fromSubscription(
        speechCredentials.key,
        speechCredentials.region
      );
      
      // Configure for lower latency with reliable format
      speechConfig.speechSynthesisVoiceName = "en-US-AriaNeural";
      // Use Audio16Khz32KBitRateMonoMp3 format which is well-supported by browsers
      speechConfig.setProperty(PropertyId.SpeechServiceConnection_SynthOutputFormat, 
                              SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3);
      speechConfig.setProperty(PropertyId.SpeechServiceResponse_RequestSentenceBoundary, "true");
      
      // For faster speech (can be adjusted as needed)
      speechConfig.setProperty(PropertyId.SpeechServiceResponse_RequestWordBoundary, "false");
      
      const audioConfig = AudioConfig.fromDefaultSpeakerOutput();
      const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
      
      synthesizerRef.current = synthesizer;
      setStatus('speaking');
      
      // Split long responses into sentences for more natural pauses and faster start
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      let firstSentenceSpoken = false;
      
      for (let i = 0; i < sentences.length; i++) {
        // Check if we've been interrupted
        if (!synthesizerRef.current || !isComponentMountedRef.current) {
          return;
        }
        
        const sentence = sentences[i].trim();
        if (!sentence) continue;
        
        await new Promise((resolve, reject) => {
          synthesizerRef.current.speakTextAsync(
            sentence,
            result => {
              if (i === sentences.length - 1 || !synthesizerRef.current) {
                if (isComponentMountedRef.current) {
                  setIsSpeaking(false);
                  setStatus('idle');
                }
                if (i === sentences.length - 1) {
                  synthesizerRef.current?.close();
                  synthesizerRef.current = null;
                  onComplete && onComplete();
                }
              }
              resolve();
            },
            error => {
              console.error('Error speaking response:', error);
              if (isComponentMountedRef.current) {
                setIsSpeaking(false);
                setStatus('idle');
              }
              synthesizerRef.current?.close();
              synthesizerRef.current = null;
              onComplete && onComplete();
              reject(error);
            }
          );
          
          // After first sentence starts playing, update UI immediately
          if (!firstSentenceSpoken) {
            firstSentenceSpoken = true;
          }
        });
      }
    } catch (error) {
      console.error('Error initializing speech synthesis:', error);
      if (isComponentMountedRef.current) {
        setIsSpeaking(false);
        setStatus('idle');
      }
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-4 bg-primary-500 rounded animate-sound-wave1"></div>
              <div className="w-2 h-4 bg-primary-500 rounded animate-sound-wave2"></div>
              <div className="w-2 h-4 bg-primary-500 rounded animate-sound-wave3"></div>
            </div>
            <p className="text-sm text-gray-700">Speaking...</p>
          </div>
          
          {canBeInterrupted && (
            <button 
              className="ml-3 p-1 bg-gray-200 hover:bg-gray-300 rounded-full"
              onClick={stopSpeaking}
              aria-label="Stop speaking"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
});

export default AiResponse;