/**
 * AudioRecorderService.js
 * Handles audio recording functionality with proper resource management
 */

class AudioRecorderService {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.recording = false;
    this.mimeType = null;
    this.onDataAvailable = null;
    this.onStop = null;
    this.onError = null;
    this.onStart = null;
    this.timeslice = 1000; // 1 second chunks by default
  }

  /**
   * Initialize the recorder with the user's microphone
   */
  async initialize() {
    // Clean up any existing resources first
    await this.cleanup();

    try {
      console.log('[AudioRecorderService] Requesting microphone access');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.stream = stream;

      // Determine the best MIME type to use
      this.mimeType = this.getBestMimeType();
      console.log(`[AudioRecorderService] Selected MIME type: ${this.mimeType}`);

      return true;
    } catch (error) {
      console.error('[AudioRecorderService] Error initializing microphone:', error);
      if (this.onError) {
        this.onError(error);
      }
      return false;
    }
  }

  /**
   * Get the best supported MIME type for audio recording
   */
  getBestMimeType() {
    // Log browser support for various audio formats
    const formats = [
      'audio/wav',
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/ogg',
      'audio/ogg;codecs=opus',
      'audio/mp3',
      'audio/mp4'
    ];
    
    console.log('[AudioRecorderService] Browser audio format support:');
    formats.forEach(format => {
      console.log(`${format}: ${MediaRecorder.isTypeSupported(format) ? 'Supported' : 'Not supported'}`);
    });

    // Try formats in order of preference for ElevenLabs compatibility
    if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
      return 'audio/webm;codecs=opus';
    } else if (MediaRecorder.isTypeSupported('audio/webm')) {
      return 'audio/webm';
    } else if (MediaRecorder.isTypeSupported('audio/wav')) {
      return 'audio/wav';
    } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
      return 'audio/ogg;codecs=opus';
    } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
      return 'audio/ogg';
    } else if (MediaRecorder.isTypeSupported('audio/mp3')) {
      return 'audio/mp3';
    }
    
    // Let browser decide if no preferred formats are supported
    return '';
  }

  /**
   * Start recording audio
   */
  start(timeslice = this.timeslice) {
    if (!this.stream) {
      console.error('[AudioRecorderService] Cannot start recording - stream not initialized');
      return false;
    }

    try {
      // Reset chunks array
      this.audioChunks = [];

      // Create recorder options
      const options = this.mimeType ? { mimeType: this.mimeType } : {};
      
      // Create a new MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.stream, options);
      
      // Set up event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
          
          // If callback is provided, invoke it
          if (this.onDataAvailable) {
            this.onDataAvailable(event.data);
          }
        }
      };
      
      this.mediaRecorder.onstart = () => {
        this.recording = true;
        console.log('[AudioRecorderService] Recording started');
        if (this.onStart) {
          this.onStart();
        }
      };
      
      this.mediaRecorder.onstop = () => {
        this.recording = false;
        console.log('[AudioRecorderService] Recording stopped');
        if (this.onStop) {
          const audioBlob = this.getAudioBlob();
          this.onStop(audioBlob);
        }
      };
      
      this.mediaRecorder.onerror = (event) => {
        console.error('[AudioRecorderService] MediaRecorder error:', event.error);
        if (this.onError) {
          this.onError(event.error);
        }
      };
      
      // Start recording with specified time slice
      this.mediaRecorder.start(timeslice);
      
      return true;
    } catch (error) {
      console.error('[AudioRecorderService] Error starting recording:', error);
      if (this.onError) {
        this.onError(error);
      }
      return false;
    }
  }

  /**
   * Stop recording audio
   */
  stop() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
        return true;
      } catch (error) {
        console.error('[AudioRecorderService] Error stopping recording:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Pause recording (if supported by browser)
   */
  pause() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording' && 'pause' in this.mediaRecorder) {
      try {
        this.mediaRecorder.pause();
        return true;
      } catch (error) {
        console.error('[AudioRecorderService] Error pausing recording:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Resume recording (if supported by browser)
   */
  resume() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused' && 'resume' in this.mediaRecorder) {
      try {
        this.mediaRecorder.resume();
        return true;
      } catch (error) {
        console.error('[AudioRecorderService] Error resuming recording:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Get the current recording state
   */
  getState() {
    return this.mediaRecorder ? this.mediaRecorder.state : 'inactive';
  }

  /**
   * Check if currently recording
   */
  isRecording() {
    return this.recording;
  }

  /**
   * Get audio blob from recorded chunks
   */
  getAudioBlob() {
    if (this.audioChunks.length === 0) {
      return null;
    }
    
    // Create a blob with consistent MIME type
    // Using webm for ElevenLabs compatibility
    return new Blob(this.audioChunks, { type: 'audio/webm' });
  }

  /**
   * Clean up resources
   */
  async cleanup() {
    // Stop recording if active
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {
        console.error('[AudioRecorderService] Error stopping MediaRecorder during cleanup:', e);
      }
    }
    
    // Clear MediaRecorder reference
    this.mediaRecorder = null;
    
    // Stop and release all tracks in the media stream
    if (this.stream) {
      try {
        const tracks = this.stream.getTracks();
        tracks.forEach(track => {
          track.stop();
        });
      } catch (e) {
        console.error('[AudioRecorderService] Error stopping stream tracks during cleanup:', e);
      }
      this.stream = null;
    }
    
    // Clear audio chunks
    this.audioChunks = [];
    this.recording = false;
    
    return true;
  }
}

// Export a singleton instance
export default new AudioRecorderService();