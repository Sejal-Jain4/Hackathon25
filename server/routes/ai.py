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
    import openai
    OPENAI_AVAILABLE = True
    logger.info(f"OpenAI SDK is available (version {openai.__version__})")
    # Check for correct version
    if openai.__version__ != "0.28.0":
        logger.warning(f"Expected OpenAI SDK version 0.28.0, but got {openai.__version__}. This may cause issues.")
except ImportError:
    OPENAI_AVAILABLE = False
    logger.warning("OpenAI SDK is not available")

# Placeholder for Azure Speech Services integration
try:
    import azure.cognitiveservices.speech as speechsdk
    SPEECH_SDK_AVAILABLE = True
    logger.info("Azure Speech SDK is available")
except ImportError:
    SPEECH_SDK_AVAILABLE = False
    logger.warning("Azure Speech SDK is not available")

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/speech/token', methods=['GET'])
def get_speech_token():
    """Generate an access token for Azure Speech Services"""
    if not SPEECH_SDK_AVAILABLE:
        return jsonify({
            "status": "error",
            "message": "Azure Speech SDK is not available"
        }), 500
    
    try:
        speech_key = os.environ.get("AZURE_SPEECH_KEY")
        speech_region = os.environ.get("AZURE_SPEECH_REGION")
        speech_endpoint = os.environ.get("AZURE_SPEECH_ENDPOINT")
        
        if not speech_key or not speech_region:
            return jsonify({
                "status": "error",
                "message": "Azure Speech credentials not configured"
            }), 500
        
        # Return key, region, and endpoint for client-side use
        return jsonify({
            "status": "success",
            "token": speech_key,  # Renamed to token for clarity (key and token are the same for Speech Services)
            "key": speech_key,    # Keep for backwards compatibility
            "region": speech_region,
            "endpoint": speech_endpoint
        })
    except Exception as e:
        logger.error(f"Error generating speech token: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Error generating speech token",
            "error": str(e) if os.environ.get('FLASK_ENV') == 'development' else ""
        }), 500

@ai_bp.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    user_id = data.get('userId', 'default_user')
    user_profile = data.get('profile', {})

    # Check if OpenAI is available
    if not OPENAI_AVAILABLE:
        logger.error("Azure OpenAI SDK is not available - cannot process request")
        return jsonify({
            "status": "error",
            "message": "Azure OpenAI service is not available. Please install the required packages."
        }), 500
        
    # Get Azure OpenAI credentials
    azure_endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT")
    azure_key = os.environ.get("AZURE_OPENAI_KEY")
    deployment_name = os.environ.get("AZURE_OPENAI_DEPLOYMENT")
    
    # Check if credentials are configured
    if not azure_endpoint or not azure_key or not deployment_name:
        logger.error("Azure OpenAI credentials not configured")
        return jsonify({
            "status": "error",
            "message": "Azure OpenAI credentials are not properly configured."
        }), 500
    
    try:
        # Configure Azure OpenAI with v0.28.0 SDK format
        openai.api_type = "azure"
        openai.api_base = azure_endpoint
        openai.api_key = azure_key
        openai.api_version = "2023-05-15"  # Compatible with v0.28.0
        
        # Define system message based on user profile
        system_message = """
        You are Centsi, an AI financial coach specializing in helping students and young adults manage their finances.
        Your goal is to provide personalized financial guidance, education, and encouragement.
        Respond in a friendly, supportive tone. Keep responses concise (under 3 sentences when possible).
        Focus on practical advice appropriate for young adults and students with limited income.
        Avoid jargon and explain financial concepts simply.
        """
        
        # Add user profile information if available
        if user_profile:
            # Extract information from profile and questionnaire
            income_data = user_profile.get('income', {})
            questionnaire = user_profile.get('questionnaire', {})
            
            # Build a more detailed profile for the AI
            profile_info = f"""
            User Information:
            - Life stage: {questionnaire.get('lifeStage', 'Unknown')} 
              (High School Student, College Student, Fresh Graduate/Young Professional, or Parent/Family Manager)
            - Income type: {questionnaire.get('incomeType', 'Unknown')} 
              (Allowance/Part-time, Irregular/gig, Steady paycheck, or Stipend/scholarship)
            - Financial priority: {questionnaire.get('financialPriority', 'Unknown')} 
              (Savings goal, Debt/loans management, Daily budgeting, or Credit building/investing)
            - Monthly income: {income_data.get('amount', 'Unknown')} {income_data.get('frequency', '')}
            - Current savings goal: {user_profile.get('savingsGoal', {}).get('name', 'Unknown')} 
              (Target: {user_profile.get('savingsGoal', {}).get('target', 'Unknown')}, 
               Current: {user_profile.get('savingsGoal', {}).get('current', 'Unknown')})
            """
            
            # Add expense information if available
            expenses = user_profile.get('expenses', [])
            if expenses:
                expense_info = "- Monthly expenses:\n"
                for expense in expenses:
                    expense_info += f"  * {expense.get('category', 'Item')}: {expense.get('amount', 'Unknown')}\n"
                profile_info += expense_info
                
            system_message += profile_info
            
            # Add tailored coaching instructions based on financial priority
            financial_priority = questionnaire.get('financialPriority', '')
            if financial_priority == 'savings':
                system_message += """
                This user is focused on savings goals. Emphasize strategies for consistent saving,
                automated transfers, and visual progress tracking. Suggest the 50/30/20 rule and
                ways to make saving more rewarding through milestones.
                """
            elif financial_priority == 'debt':
                system_message += """
                This user is focused on debt/loan management. Emphasize strategies like debt avalanche
                or debt snowball methods. Discuss student loan options, prioritizing high-interest debt,
                and creating realistic repayment schedules.
                """
            elif financial_priority == 'budget':
                system_message += """
                This user is focused on daily budgeting. Emphasize practical expense tracking,
                zero-based budgeting techniques, and the envelope method. Suggest apps or tools
                for budgeting that are appropriate for their life stage.
                """
            elif financial_priority == 'credit':
                system_message += """
                This user is focused on credit building or investing basics. Emphasize responsible
                credit card use, credit score factors, and introductory concepts like emergency funds
                before investing. For students, discuss scholarship applications as a form of "investment."
                """
        
        # Generate response using Azure OpenAI (older SDK format)
        response = openai.ChatCompletion.create(
            engine=deployment_name,
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            max_tokens=300,
            temperature=0.7
        )
        
        # Extract assistant's response
        ai_reply = response['choices'][0]['message']['content']
        
        return jsonify({
            "status": "success",
            "reply": ai_reply
        })
        
    except Exception as e:
        logger.error(f"Azure OpenAI error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Error processing your request with Azure OpenAI",
            "error": str(e) if os.environ.get('FLASK_ENV') == 'development' else ""
        }), 500

@ai_bp.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    # This function is now primarily handled client-side with direct Azure Speech SDK integration
    # We'll return an error message to ensure no mock data is used
    return jsonify({
        "status": "error",
        "message": "This endpoint is deprecated. Speech-to-text is now handled client-side with Azure Speech Services."
    }), 400

@ai_bp.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    # This function is now primarily handled client-side with direct Azure Speech SDK integration
    # We'll return an error message to ensure no mock data is used
    return jsonify({
        "status": "error",
        "message": "This endpoint is deprecated. Text-to-speech is now handled client-side with Azure Speech Services."
    }), 400