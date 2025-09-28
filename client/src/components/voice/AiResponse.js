import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';

/**
 * AiResponse Component - Handles text-to-speech conversion and playback for AI responses
 * Minimalist version with no visual elements - only audio
 */
const AiResponse = forwardRef(({ responseText, onComplete, canBeInterrupted = true }, ref) => {
  // State management
  const [status, setStatus] = useState('idle'); // idle, preparing, speaking
  
  // Refs
  const audioRef = useRef(null);
  const isComponentMountedRef = useRef(true);
  const currentAudioUrl = useRef(null);

  // Initialize audio element on component mount
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.autoplay = true;
    
    console.log('[AiResponse] Component mounted, initializing audio element');
    
    // Clean up when component unmounts
    return () => {
      console.log('[AiResponse] Component unmounting, cleaning up resources');
      isComponentMountedRef.current = false;
      stopSpeaking();
    };
  }, []);

  // Set up audio event listeners
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    // Add ended event listener
    audio.onended = () => {
      if (!isComponentMountedRef.current) return;
      console.log('[AiResponse] Audio playback ended');
      
      setStatus('idle');
      
      // Clean up URL object
      if (currentAudioUrl.current) {
        URL.revokeObjectURL(currentAudioUrl.current);
        currentAudioUrl.current = null;
      }
      
      // Notify parent component
      if (onComplete) {
        onComplete();
      }
    };
    
    // Add error event listener
    audio.onerror = (e) => {
      console.error('[AiResponse] Audio error:', e, audio.error);
      setStatus('idle');
      
      // Clean up URL object
      if (currentAudioUrl.current) {
        URL.revokeObjectURL(currentAudioUrl.current);
        currentAudioUrl.current = null;
      }
      
      // Notify parent component
      if (onComplete) {
        onComplete();
      }
    };
    
    // Debug logging
    audio.addEventListener('canplay', () => {
      console.log('[AiResponse] Audio can play, duration:', audio.duration);
    });
    
  }, [onComplete]);

  // Process new responseText
  useEffect(() => {
    if (!responseText || responseText.trim() === '') return;
    
    console.log('[AiResponse] New response text received:', 
      responseText.length > 50 ? responseText.substring(0, 50) + '...' : responseText);
    
    // Initiate TTS process
    speakResponse();
  }, [responseText]);

  // Stop speaking and clean up resources
  const stopSpeaking = () => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    
    // Clean up URL object
    if (currentAudioUrl.current) {
      URL.revokeObjectURL(currentAudioUrl.current);
      currentAudioUrl.current = null;
    }
    
    setStatus('idle');
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    stopSpeaking,
    getStatus: () => status
  }));

  // Main function to handle text-to-speech
  const speakResponse = async () => {
    if (!responseText || !isComponentMountedRef.current) return;
    
    // Stop any ongoing speech
    stopSpeaking();
    
    try {
      setStatus('preparing');
      console.log('[AiResponse] Starting TTS process for:', 
        responseText.length > 50 ? responseText.substring(0, 50) + '...' : responseText);
      
      // Make TTS API request
      const response = await axios.post(
        '/api/ai/elevenlabs/text-to-speech',
        {
          text: responseText,
          voice_id: 'JBFqnCBsd6RMkjVDRZzb', // Female voice
          model_id: 'eleven_multilingual_v2'
        },
        { 
          responseType: 'blob',
          timeout: 30000 
        }
      );
      
      console.log('[AiResponse] TTS response received:', {
        contentType: response.headers['content-type'],
        status: response.status
      });
      
      // Check for valid audio response
      const audioBlob = response.data;
      if (!audioBlob || audioBlob.size < 100) {
        throw new Error(`Invalid audio data: size=${audioBlob?.size || 0}`);
      }
      
      // Create audio URL and set up audio element
      const audioUrl = URL.createObjectURL(audioBlob);
      currentAudioUrl.current = audioUrl;
      
      const audio = audioRef.current;
      audio.src = audioUrl;
      
      // Set status to speaking
      setStatus('speaking');
      
      // Play audio with fallbacks for autoplay restrictions
      try {
        await audio.play();
        console.log('[AiResponse] Audio playback started successfully');
      } catch (playError) {
        console.warn('[AiResponse] Autoplay blocked, waiting for user interaction', playError);
        
        // Add click handler to try playing after user interaction
        document.addEventListener('click', async function tryPlayOnClick() {
          try {
            await audio.play();
            console.log('[AiResponse] Audio playback started after user interaction');
          } catch (err) {
            console.error('[AiResponse] Audio playback failed even after user interaction', err);
          }
          document.removeEventListener('click', tryPlayOnClick);
        }, { once: true });
      }
      
    } catch (error) {
      console.error('[AiResponse] Error in TTS process:', error);
      setStatus('idle');
      
      // Notify parent component even if audio fails
      if (onComplete) {
        setTimeout(() => onComplete(), 2000);
      }
    }
  };

  // This component doesn't render any visible UI elements
  return null;
});

export default AiResponse;