from flask import Blueprint, request, jsonify
import os
import json
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Placeholder for Azure OpenAI integration
try:
    from azure.ai.openai import AzureOpenAI
    OPENAI_AVAILABLE = True
    logger.info("Azure OpenAI SDK is available")
except ImportError:
    OPENAI_AVAILABLE = False
    logger.warning("Azure OpenAI SDK is not available")

# Placeholder for Azure Speech Services integration
try:
    import azure.cognitiveservices.speech as speechsdk
    SPEECH_SDK_AVAILABLE = True
    logger.info("Azure Speech SDK is available")
except ImportError:
    SPEECH_SDK_AVAILABLE = False
    logger.warning("Azure Speech SDK is not available")

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    user_id = data.get('userId', 'default_user')

    # Placeholder for Azure OpenAI integration
    if OPENAI_AVAILABLE:
        try:
            client = AzureOpenAI(
                azure_endpoint=os.environ.get("AZURE_OPENAI_ENDPOINT"),
                api_key=os.environ.get("AZURE_OPENAI_KEY"),
                api_version="2023-12-01-preview"
            )
            
            deployment_name = os.environ.get("AZURE_OPENAI_DEPLOYMENT")
            
            response = client.chat.completions.create(
                model=deployment_name,
                messages=[
                    {"role": "system", "content": "You are a financial coach for students named Centsi."},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.7,
                max_tokens=800
            )
            
            ai_response = response.choices[0].message.content
        except Exception as e:
            print(f"Error calling Azure OpenAI: {str(e)}")
            ai_response = "I'm currently having trouble connecting to my brain. Please try again later."
    else:
        # Mock response for demo
        mock_responses = {
            "Can I afford this $20 hoodie?": "Based on your current balance of $842.50 and your spending patterns, yes, you can afford the $20 hoodie. However, remember you're saving for Spring Break, so consider if this purchase aligns with your goals.",
            "What's my balance?": "Your current balance is $842.50. You've been doing great with your savings this month!",
            "How much have I spent on food?": "You've spent $150.00 on food this month, which is within your budget of $200.00. Great job managing your expenses!",
        }
        
        # Default response if no match
        ai_response = mock_responses.get(
            user_message, 
            "I can help you with your finances! Try asking about your balance, spending patterns, or if you can afford something."
        )
    
    return jsonify({
        "userId": user_id,
        "response": ai_response
    })

@ai_bp.route('/speech-token', methods=['GET'])
def get_speech_token():
    # In a real app, this would fetch a token from Azure
    # For demo purposes, return a placeholder
    return jsonify({
        "region": os.environ.get("AZURE_SPEECH_REGION", "westus2"),
        "token": "placeholder_token",
        "tokenExpiration": 60  # seconds
    })

@ai_bp.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    # Placeholder for STT functionality
    # In a real app, this would process audio from the client
    # For demo, just return a sample transcription
    return jsonify({
        "text": "Can I afford this twenty dollar hoodie?"
    })

@ai_bp.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    data = request.json
    text = data.get('text', '')
    
    # Placeholder for TTS functionality
    # In a real app, this would convert text to speech
    return jsonify({
        "audioUrl": "data:audio/wav;base64,..."  # Placeholder
    })