import React from 'react';

const SpeechTranscriptionOverlay = ({ isListening, status, transcript, error, diagMode }) => {
  // Don't render anything if we're not listening and there's no error
  if (!isListening && !error) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="flex flex-col items-center max-w-md">
        {isListening && (
          <div className="text-white text-3xl font-bold animate-pulse filter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] mb-2">
            I'm listening
          </div>
        )}
        
        {transcript && (
          <div className="text-white text-lg font-medium filter drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] mb-2 text-center bg-black bg-opacity-40 p-3 rounded">
            {transcript}
          </div>
        )}
        
        
        {/* Diagnostic information */}
        {diagMode && (
          <div className="text-yellow-300 text-xs font-mono filter drop-shadow-[0_0_5px_rgba(0,0,0,0.8)] mt-2 text-center bg-black bg-opacity-60 p-2 rounded">
            Status: {status} | Transcript length: {transcript ? transcript.length : 0} chars
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeechTranscriptionOverlay;