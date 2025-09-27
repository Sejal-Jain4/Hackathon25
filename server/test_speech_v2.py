"""
Improved test script for Azure Speech Services
Tests both Speech-to-Text and Text-to-Speech capabilities
Creates proper temporary files for testing
"""
import os
import time
import tempfile
import wave
import struct
from dotenv import load_dotenv
import azure.cognitiveservices.speech as speechsdk

# Load environment variables
load_dotenv()

def create_silent_wav_file(duration_ms=1000):
    """Create a silent WAV file for testing output"""
    # Create a temporary file
    fd, filename = tempfile.mkstemp(suffix='.wav')
    os.close(fd)
    
    # Parameters for the WAV file
    sample_rate = 16000  # Hz
    channels = 1  # mono
    sample_width = 2  # 2 bytes (16 bits) per sample
    
    # Calculate the number of frames
    num_frames = int(duration_ms * sample_rate / 1000)
    
    # Create a silent audio data (all zeros)
    silent_data = b''.join([struct.pack('<h', 0) for _ in range(num_frames)])
    
    # Create the WAV file
    with wave.open(filename, 'wb') as wav_file:
        wav_file.setnchannels(channels)
        wav_file.setsampwidth(sample_width)
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(silent_data)
    
    return filename

def test_speech_services():
    """Test connection to Azure Speech Services"""
    print("=============================================")
    print("Testing Azure Speech Services Connection")
    print("=============================================")
    
    # Get credentials from .env
    speech_key = os.getenv("AZURE_SPEECH_KEY")
    speech_region = os.getenv("AZURE_SPEECH_REGION")
    speech_endpoint = os.getenv("AZURE_SPEECH_ENDPOINT", None)  # Optional
    
    # Check if credentials are available
    print(f"Azure Speech Key: {'✓ Set' if speech_key else '✗ Not set'}")
    print(f"Azure Speech Region: {'✓ Set' if speech_region else '✗ Not set'}")
    print(f"Azure Speech Endpoint: {'✓ Set' if speech_endpoint else '✗ Not set (optional)'}")
    
    if not speech_key or not speech_region:
        print("Error: Missing Azure Speech credentials. Please check your .env file.")
        return
    
    # Test Text-to-Speech
    test_text_to_speech(speech_key, speech_region, speech_endpoint)
    
    # Test Speech-to-Text Recognition (just a configuration test)
    test_speech_recognition_config(speech_key, speech_region, speech_endpoint)
    
    # Print client-side configuration
    test_client_side_config(speech_key, speech_region, speech_endpoint)

def test_text_to_speech(speech_key, speech_region, speech_endpoint=None):
    """Test Text-to-Speech functionality"""
    print("\n---------------------------------------------")
    print("Testing Text-to-Speech")
    print("---------------------------------------------")
    
    try:
        # Configure speech service - using the correct method for Python SDK
        print(f"Using region: {speech_region}")
        speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=speech_region)
        
        if speech_endpoint:
            print(f"Custom endpoint available, but using region-based config instead for compatibility")
            
        # Configure voice
        speech_config.speech_synthesis_voice_name = "en-US-JennyNeural"
        
        # Create a temporary output file
        output_file = tempfile.NamedTemporaryFile(suffix='.wav', delete=False).name
        print(f"Creating temporary output file: {output_file}")
        
        # Create speech synthesizer with audio config for file output
        audio_config = speechsdk.audio.AudioOutputConfig(filename=output_file)
        speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
        
        # Test synthesizing speech
        print("Sending test Text-to-Speech request...")
        test_text = "Hello! This is a test of Azure Speech Services from Centsi financial coach."
        
        result = speech_synthesizer.speak_text_async(test_text).get()
        
        # Check result
        if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            print("\n✓ Text-to-Speech test successful!")
            print(f"Synthesized {len(result.audio_data)} bytes of audio data")
            file_size = os.path.getsize(output_file)
            print(f"Audio file created: {output_file} ({file_size} bytes)")
        elif result.reason == speechsdk.ResultReason.Canceled:
            cancellation = speechsdk.CancellationDetails.from_result(result)
            print(f"\n✗ Speech synthesis canceled: {cancellation.reason}")
            if cancellation.reason == speechsdk.CancellationReason.Error:
                print(f"Error details: {cancellation.error_details}")
        else:
            print(f"\n✗ Speech synthesis failed with reason: {result.reason}")
            
    except Exception as e:
        print(f"\n✗ Error testing Text-to-Speech: {e}")

def test_speech_recognition_config(speech_key, speech_region, speech_endpoint=None):
    """Test Speech Recognition configuration"""
    print("\n---------------------------------------------")
    print("Testing Speech-to-Text Configuration")
    print("---------------------------------------------")
    
    try:
        # Configure speech service - using the correct method for Python SDK
        print(f"Using region: {speech_region}")
        speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=speech_region)
        
        if speech_endpoint:
            print(f"Custom endpoint available, but using region-based config instead for compatibility")
            
        # Configure speech recognition
        speech_config.speech_recognition_language = "en-US"
        
        # Create a silent WAV file for input
        input_file = create_silent_wav_file(2000)  # 2 seconds of silence
        print(f"Created temporary input file for testing: {input_file}")
        
        # Create speech recognizer with file input instead of mic
        audio_config = speechsdk.audio.AudioConfig(filename=input_file)
        speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
        
        print("\n✓ Speech recognition configuration successful!")
        print("Note: This test only checks configuration, not actual speech recognition")
        
        # Cleanup temporary file
        try:
            os.remove(input_file)
            print(f"Cleaned up temporary input file")
        except:
            pass
            
    except Exception as e:
        print(f"\n✗ Error testing Speech-to-Text configuration: {e}")

def test_client_side_config(speech_key, speech_region, speech_endpoint=None):
    """Print configuration values for client-side use"""
    print("\n---------------------------------------------")
    print("Client-side Speech SDK Configuration")
    print("---------------------------------------------")
    
    print("React SpeechConfig setup:")
    print("```javascript")
    print("// Method 1: Using subscription key and region")
    print("const speechConfig = SpeechConfig.fromSubscription(")
    print(f"  \"{speech_key}\", // subscription key")
    print(f"  \"{speech_region}\" // region")
    print(");")
    
    print("\n// Method 2: Alternative using authorization token if you implement token exchange")
    print("// const speechConfig = SpeechConfig.fromAuthorizationToken(")
    print("//   authToken, // token from your token exchange service")
    print(f"//   \"{speech_region}\" // region")
    print("// );")
    
    print("\n// Configure common settings")
    print("speechConfig.speechRecognitionLanguage = \"en-US\";")
    print("speechConfig.speechSynthesisVoiceName = \"en-US-JennyNeural\";")
    
    print("\n// For speech recognition (microphone input)")
    print("const audioConfig = AudioConfig.fromDefaultMicrophoneInput();")
    print("const recognizer = new SpeechRecognizer(speechConfig, audioConfig);")
    
    print("\n// For speech synthesis (speaker output)")
    print("const audioOutputConfig = AudioConfig.fromDefaultSpeakerOutput();") 
    print("const synthesizer = new SpeechSynthesizer(speechConfig, audioOutputConfig);")
    print("```")

def test_token_endpoint():
    """Test token endpoint if implemented"""
    # This would test your token endpoint if implemented
    pass

if __name__ == "__main__":
    test_speech_services()