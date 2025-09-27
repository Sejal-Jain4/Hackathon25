import React, { useEffect, useState } from 'react';
import { SpeechConfig, AudioConfig, SpeechSynthesizer, SpeechSynthesisOutputFormat, PropertyId } from 'microsoft-cognitiveservices-speech-sdk';
import axios from 'axios';

const TextToSpeech = ({ text, onComplete, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechCredentials, setSpeechCredentials] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // Get speech credentials when component mounts
  useEffect(() => {
    const fetchSpeechCredentials = async () => {
      try {
        // Get token from backend
        const response = await axios.get('/api/ai/speech/token');
        if (response.data && response.data.status === 'success') {
          setSpeechCredentials({
            key: response.data.token || response.data.key,
            region: response.data.region
          });
          setIsReady(true);
        } else {
          setError('Failed to get speech token');
        }
      } catch (error) {
        console.error('Error fetching speech token:', error);
        setError('Failed to connect to speech service');
      }
    };

    fetchSpeechCredentials();
  }, []);

  // Auto-play if enabled and text changes
  useEffect(() => {
    if (autoPlay && text && isReady && !isPlaying) {
      speakText();
    }
  }, [text, isReady, autoPlay]);

  const speakText = async () => {
    if (!text || !speechCredentials || isPlaying) return;

    try {
      setIsPlaying(true);

      // Create speech config
      const speechConfig = SpeechConfig.fromSubscription(
        speechCredentials.key,
        speechCredentials.region
      );

      // Set voice name
      speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";
      
      // Use MP3 format which is well-supported by browsers
      speechConfig.setProperty(
        PropertyId.SpeechServiceConnection_SynthOutputFormat, 
        SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3
      );

      // Create audio config - must use default speaker with use_default_speaker=true
      const audioConfig = AudioConfig.fromDefaultSpeakerOutput();
      
      // Create synthesizer
      const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

      // Speak text and handle result
      synthesizer.speakTextAsync(
        text,
        result => {
          // Handle success
          synthesizer.close();
          setIsPlaying(false);
          
          if (onComplete) {
            onComplete();
          }
        },
        error => {
          // Handle error
          console.error('Speech synthesis error:', error);
          synthesizer.close();
          setIsPlaying(false);
          setError('Failed to speak text');
        }
      );
    } catch (error) {
      console.error('Error initializing speech synthesis:', error);
      setIsPlaying(false);
      setError('Failed to initialize speech');
    }
  };

  return (
    <div className="text-to-speech">
      {error && <div className="error text-red-500 text-xs">{error}</div>}
      {!autoPlay && (
        <button 
          onClick={speakText}
          disabled={!isReady || isPlaying || !text}
          className="speak-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          {isPlaying ? (
            <>
              <span className="mr-2">Speaking...</span>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </>
          ) : (
            <>
              <span className="mr-2">Speak</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default TextToSpeech;