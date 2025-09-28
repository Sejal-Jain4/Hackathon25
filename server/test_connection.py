"""
Test script to verify connectivity to Azure OpenAI and Azure Speech Services.
Run this script to test if your credentials and packages are working correctly.
"""
import os
import sys
from dotenv import load_dotenv
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def test_openai_connection():
    """Test connection to Azure OpenAI"""
    logger.info("Testing Azure OpenAI connection...")
    
    # Check if environment variables are set
    azure_endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT")
    azure_key = os.environ.get("AZURE_OPENAI_KEY")
    deployment_name = os.environ.get("AZURE_OPENAI_DEPLOYMENT")
    
    if not azure_endpoint or not azure_key or not deployment_name:
        logger.error("Azure OpenAI credentials not configured properly in .env file")
        logger.error(f"AZURE_OPENAI_ENDPOINT: {'Set' if azure_endpoint else 'Not set'}")
        logger.error(f"AZURE_OPENAI_KEY: {'Set' if azure_key else 'Not set'}")
        logger.error(f"AZURE_OPENAI_DEPLOYMENT: {'Set' if deployment_name else 'Not set'}")
        return False
    
    try:
        # Attempt to import OpenAI SDK
        try:
            import openai
            logger.info("OpenAI SDK imported successfully")
        except ImportError as e:
            logger.error(f"Failed to import OpenAI SDK: {e}")
            logger.error("Try reinstalling with: pip install openai")
            return False
        
        # Initialize client and make a test request
        client = openai.AzureOpenAI(
            azure_endpoint=azure_endpoint,
            api_key=azure_key,
            api_version="2025-04-14"
        )
        
        # Simple test completion
        logger.info("Sending test request to Azure OpenAI...")
        response = client.chat.completions.create(
            model=deployment_name,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say 'Connection successful!' in one short sentence"}
            ],
            max_tokens=50
        )
        
        # Check the response
        message = response.choices[0].message.content.strip()
        logger.info(f"Response received: {message}")
        
        return True
        
    except Exception as e:
        logger.error(f"Error testing Azure OpenAI connection: {e}")
        return False

def test_speech_connection():
    """Test connection to Azure Speech Services"""
    logger.info("Testing Azure Speech Services connection...")
    
    # Check if environment variables are set
    speech_key = os.environ.get("AZURE_SPEECH_KEY")
    speech_region = os.environ.get("AZURE_SPEECH_REGION")
    speech_endpoint = os.environ.get("AZURE_SPEECH_ENDPOINT", None)
    
    if not speech_key or not speech_region:
        logger.error("Azure Speech credentials not configured properly in .env file")
        logger.error(f"AZURE_SPEECH_KEY: {'Set' if speech_key else 'Not set'}")
        logger.error(f"AZURE_SPEECH_REGION: {'Set' if speech_region else 'Not set'}")
        logger.error(f"AZURE_SPEECH_ENDPOINT: {'Set' if speech_endpoint else 'Optional, not set'}")
        return False
    
    try:
        # Attempt to import Speech SDK
        try:
            import azure.cognitiveservices.speech as speechsdk
            logger.info("Azure Speech SDK imported successfully")
        except ImportError as e:
            logger.error(f"Failed to import Azure Speech SDK: {e}")
            logger.error("Try reinstalling with: pip install azure-cognitiveservices-speech")
            return False
            
        # Initialize speech config
        speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=speech_region)
        
        # Create a simple text-to-speech synthesizer
        synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)
        
        # Test synthesis (this won't actually play audio, just tests the connection)
        logger.info("Sending test request to Azure Speech Services...")
        result = synthesizer.speak_text_async("Connection test.").get()
        
        # Check the result
        if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
            logger.info("Speech synthesis connection test successful")
            return True
        else:
            logger.error(f"Speech synthesis failed with reason: {result.reason}")
            if result.cancellation_details:
                logger.error(f"Cancellation details: {result.cancellation_details.reason}")
                logger.error(f"Cancellation message: {result.cancellation_details.error_details}")
            return False
            
    except Exception as e:
        logger.error(f"Error testing Azure Speech Services connection: {e}")
        return False

if __name__ == "__main__":
    print("=============================================")
    print("Azure Services Connection Test")
    print("=============================================")
    
    # Test OpenAI connection
    print("\n[1/2] Testing Azure OpenAI connection...")
    openai_success = test_openai_connection()
    if openai_success:
        print("✅ Azure OpenAI connection successful!")
    else:
        print("❌ Azure OpenAI connection failed. Check logs above for details.")
    
    # Test Speech Services connection
    print("\n[2/2] Testing Azure Speech Services connection...")
    speech_success = test_speech_connection()
    if speech_success:
        print("✅ Azure Speech Services connection successful!")
    else:
        print("❌ Azure Speech Services connection failed. Check logs above for details.")
    
    # Summary
    print("\n=============================================")
    print("Test Summary:")
    print(f"Azure OpenAI: {'✅ PASSED' if openai_success else '❌ FAILED'}")
    print(f"Azure Speech: {'✅ PASSED' if speech_success else '❌ FAILED'}")
    print("=============================================")
    
    # Exit with appropriate code
    if openai_success and speech_success:
        print("\nAll connection tests passed! Your application should work correctly.")
        sys.exit(0)
    else:
        print("\nOne or more connection tests failed. See above for details on how to fix.")
        sys.exit(1)
