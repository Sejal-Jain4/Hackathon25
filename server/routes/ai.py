from flask import Blueprint, request, jsonify, send_file
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

# ElevenLabs integration
try:
    # Import ElevenLabs API package - you'll need to install this with pip
    import elevenlabs
    ELEVENLABS_AVAILABLE = True
    logger.info("ElevenLabs SDK is available")
except ImportError:
    ELEVENLABS_AVAILABLE = False
    logger.warning("ElevenLabs SDK is not available")

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/elevenlabs/token', methods=['GET'])
def get_elevenlabs_token():
    """Provide ElevenLabs API key to the client"""
    if not ELEVENLABS_AVAILABLE:
        return jsonify({
            "status": "error",
            "message": "ElevenLabs SDK is not available"
        }), 500
    
    try:
        elevenlabs_api_key = os.environ.get("ELEVENLABS_API_KEY")
        
        if not elevenlabs_api_key:
            return jsonify({
                "status": "error",
                "message": "ElevenLabs API key not configured"
            }), 500
        
        # Return ElevenLabs API key for client-side use
        return jsonify({
            "status": "success",
            "api_key": elevenlabs_api_key
        })
    except Exception as e:
        logger.error(f"Error providing ElevenLabs token: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Error providing ElevenLabs token",
            "error": str(e) if os.environ.get('FLASK_ENV') == 'development' else ""
        }), 500

@ai_bp.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    user_id = data.get('userId', 'default_user')
    user_profile = data.get('profile', {})
    is_system_request = data.get('isSystemRequest', False)  # Flag for system-generated requests

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
        
        # If this is a system request, we don't need to add all the context
        # Just process the message as-is
        if is_system_request:
            logger.info("Processing system request")
            
            response = openai.ChatCompletion.create(
                engine=deployment_name,
                messages=[
                    {"role": "system", "content": "You are Centsi, an AI financial assistant. Process this system request and generate a helpful response."},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            # Extract assistant's response
            ai_reply = response['choices'][0]['message']['content']
            
            return jsonify({
                "status": "success",
                "reply": ai_reply
            })
        
        # For normal user requests, build the full context
        # Define system message based on user profile
        system_message = """
        You are Centsi, an AI financial coach specializing in helping students and young adults manage their finances.
        Your goal is to provide personalized financial guidance, education, and encouragement.
        Respond in a friendly, supportive tone. Keep responses concise (under 3 sentences when possible).
        Focus on practical advice appropriate for young adults and students with limited income.
        Avoid jargon and explain financial concepts simply.

        You can help users with:
        1. Answering financial questions
        2. Creating a budget
        3. Setting savings goals
        4. Tracking expenses
        5. Understanding their financial situation
        6. Providing financial tips
        7. Generating financial reports

        If a user asks about reports or summaries, offer to generate a financial report for them.
        """
        
        # Add user profile information if available
        if user_profile:
            # Extract information from profile and questionnaire
            questionnaire = user_profile.get('questionnaire', {})
            financial_data = user_profile.get('finances', {})
            
            # Build a more detailed profile for the AI
            profile_info = f"""
            User Information:
            - Username: {user_id}
            - Life stage: {questionnaire.get('lifeStage', 'Unknown')} 
              (High School Student, College Student, Fresh Graduate/Young Professional, or Parent/Family Manager)
            - Income type: {questionnaire.get('incomeType', 'Unknown')} 
              (Allowance/Part-time, Irregular/gig, Steady paycheck, or Stipend/scholarship)
            - Financial priority: {questionnaire.get('financialPriority', 'Unknown')} 
              (Savings goal, Debt/loans management, Daily budgeting, or Credit building/investing)
            """
            
            # Add financial data if available
            if financial_data:
                income_data = financial_data.get('income', {})
                
                financial_summary = f"""
                Financial Summary:
                - Monthly income: ${income_data.get('amount', 0)} {income_data.get('frequency', 'monthly')}
                - Total balance: ${financial_data.get('totalBalance', 0)}
                """
                
                # Add expense information
                expenses = financial_data.get('expenses', [])
                if expenses:
                    expense_info = "- Monthly expenses:\n"
                    for expense in expenses:
                        expense_info += f"  * {expense.get('name', 'Item')} ({expense.get('category', 'Other')}): ${expense.get('amount', 0)}\n"
                    financial_summary += expense_info
                
                # Add savings goals
                savings_goals = financial_data.get('savingsGoals', [])
                if savings_goals:
                    savings_info = "- Savings goals:\n"
                    for goal in savings_goals:
                        progress = (goal.get('current', 0) / goal.get('target', 1)) * 100
                        savings_info += f"  * {goal.get('name', 'Goal')}: ${goal.get('current', 0)}/${goal.get('target', 0)} ({progress:.1f}%)\n"
                    financial_summary += savings_info
                
                profile_info += financial_summary
                
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

@ai_bp.route('/elevenlabs/speech-to-text', methods=['POST'])
def speech_to_text():
    """Convert audio to text using ElevenLabs"""
    if not ELEVENLABS_AVAILABLE:
        return jsonify({
            "status": "error",
            "message": "ElevenLabs SDK is not available"
        }), 500
    
    # Track temporary files for cleanup
    temp_files = []
    
    try:
        # Check if request has audio file
        if 'audio' not in request.files:
            return jsonify({
                "status": "error",
                "message": "No audio file provided"
            }), 400
            
        audio_file = request.files['audio']
        
        # Initialize ElevenLabs client
        elevenlabs_api_key = os.environ.get("ELEVENLABS_API_KEY")
        client = elevenlabs.ElevenLabs(api_key=elevenlabs_api_key)
        
        # Check if diagnostic mode is enabled
        diagnostic_mode = 'diagnostic' in request.form and request.form['diagnostic'] == 'true'
        
        # Log file info
        logger.info(f"Received audio with MIME type: {audio_file.content_type}")
        
        # Log the file content length to help diagnose issues
        audio_file.seek(0, os.SEEK_END)
        size = audio_file.tell()
        audio_file.seek(0)
        logger.info(f"Audio file size: {size} bytes")
        
        if size < 100:  # Arbitrary small size that indicates a problem
            raise ValueError("Audio file is too small, likely corrupted")
        
        # Save incoming file to disk
        import tempfile
        import uuid
        from io import BytesIO
        
        temp_dir = tempfile.gettempdir()
        original_filename = f"original_audio_{uuid.uuid4().hex}.webm"
        original_path = os.path.join(temp_dir, original_filename)
        temp_files.append(original_path)
        
        logger.info(f"Saving received audio to temporary file: {original_path}")
        audio_file.seek(0)
        audio_file.save(original_path)
        
        # Verify the file was saved correctly
        if not os.path.exists(original_path):
            raise ValueError("Failed to save temporary audio file")
            
        file_size = os.path.getsize(original_path)
        logger.info(f"Original audio saved, size: {file_size} bytes")
        
        # Read file into memory buffer for ElevenLabs API
        audio_data = BytesIO()
        with open(original_path, 'rb') as f:
            audio_data.write(f.read())
        
        # Reset position to beginning of buffer
        audio_data.seek(0)
        
        # Call ElevenLabs API with memory buffer
        logger.info("Calling ElevenLabs speech-to-text API...")
        transcription = client.speech_to_text.convert(
            file=audio_data,
            model_id="scribe_v1",
            language_code="eng",
            # Do not enable diarization as it's not needed for simple queries
            diarize=False
        )
        
        # Return the transcription
        logger.info(f"Transcription successful: '{transcription.text}'")
        
        # Include diagnostic info if requested
        response_data = {
            "status": "success",
            "text": transcription.text
        }
        
        if diagnostic_mode:
            response_data["diagnostic"] = {
                "original_size": file_size,
                "mime_type": audio_file.content_type,
            }
        
        # Clean up temporary files
        for temp_file in temp_files:
            try:
                if os.path.exists(temp_file):
                    os.remove(temp_file)
                    logger.info(f"Temporary file removed: {temp_file}")
            except Exception as cleanup_error:
                logger.error(f"Failed to remove temporary file {temp_file}: {cleanup_error}")
        
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"ElevenLabs speech-to-text error: {str(e)}")
        
        # Include error details from ElevenLabs API if available
        error_details = {}
        if hasattr(e, 'response'):
            try:
                error_details['status_code'] = e.response.status_code
                error_details['headers'] = dict(e.response.headers)
                try:
                    error_details['body'] = e.response.json()
                except:
                    error_details['body'] = e.response.text
                logger.error(f"ElevenLabs API error details: {error_details}")
            except:
                logger.error("Failed to extract detailed error information")
        
        # Clean up temporary files even in case of error
        for temp_file in temp_files:
            try:
                if os.path.exists(temp_file):
                    os.remove(temp_file)
                    logger.info(f"Temporary file removed after error: {temp_file}")
            except Exception as cleanup_error:
                logger.error(f"Failed to remove temporary file {temp_file} after error: {cleanup_error}")
        
        return jsonify({
            "status": "error",
            "message": "Error processing speech-to-text with ElevenLabs",
            "error": str(e) if os.environ.get('FLASK_ENV') == 'development' else "",
            "details": error_details if os.environ.get('FLASK_ENV') == 'development' else {}
        }), 500

@ai_bp.route('/elevenlabs/text-to-speech', methods=['POST'])
def text_to_speech():
    """Convert text to speech using ElevenLabs"""
    if not ELEVENLABS_AVAILABLE:
        logger.error("ElevenLabs SDK is not available")
        return jsonify({
            "status": "error",
            "message": "ElevenLabs SDK is not available"
        }), 500
    
    try:
        data = request.json
        text = data.get('text')
        voice_id = data.get('voice_id', 'JBFqnCBsd6RMkjVDRZzb')  # Default to female voice
        model_id = data.get('model_id', 'eleven_multilingual_v2')
        
        logger.info(f"Text-to-speech request: {len(text)} chars, voice: {voice_id}, model: {model_id}")
        
        if not text:
            logger.error("No text provided for text-to-speech")
            return jsonify({
                "status": "error",
                "message": "No text provided"
            }), 400
        
        # Initialize ElevenLabs client
        elevenlabs_api_key = os.environ.get("ELEVENLABS_API_KEY")
        if not elevenlabs_api_key:
            logger.error("ElevenLabs API key not found")
            return jsonify({
                "status": "error", 
                "message": "ElevenLabs API key not configured"
            }), 500
            
        logger.info(f"Initializing ElevenLabs client with API key: {elevenlabs_api_key[:4]}...")
        client = elevenlabs.ElevenLabs(api_key=elevenlabs_api_key)
        
        # Convert text to speech
        logger.info("Calling ElevenLabs text-to-speech API...")
        audio = client.text_to_speech.convert(
            text=text,
            voice_id=voice_id,
            model_id=model_id,
            output_format="mp3_44100_128",
        )
        logger.info("ElevenLabs API call successful")
        
        # Create a unique temporary filename to avoid conflicts
        import uuid
        import tempfile
        
        temp_dir = tempfile.gettempdir()
        temp_filename = f"speech_{uuid.uuid4().hex}.mp3"
        temp_audio_path = os.path.join(temp_dir, temp_filename)
        
        logger.info(f"Saving audio to temporary file: {temp_audio_path}")
        with open(temp_audio_path, "wb") as f:
            chunk_count = 0
            for chunk in audio:
                f.write(chunk)
                chunk_count += 1
                
        logger.info(f"Audio saved: {chunk_count} chunks, file exists: {os.path.exists(temp_audio_path)}")
        
        # Get file size
        file_size = os.path.getsize(temp_audio_path) if os.path.exists(temp_audio_path) else 0
        logger.info(f"Audio file size: {file_size} bytes")
        
        if file_size == 0:
            logger.error("Generated audio file is empty")
            # Remove the empty file
            try:
                os.remove(temp_audio_path)
            except:
                pass
            return jsonify({
                "status": "error",
                "message": "Generated audio is empty"
            }), 500
        
        # Create a response with the audio file
        logger.info("Sending audio file as response")
        response = send_file(
            temp_audio_path,
            mimetype="audio/mpeg",  # More standard MIME type for MP3
            as_attachment=True,
            download_name="speech.mp3",
            # Make sure file is deleted after sending
            conditional=True
        )
        
        # Add headers to ensure proper handling by browsers
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        response.headers["X-Content-Type-Options"] = "nosniff"
        
        # Register a callback to delete the file after it's been sent
        @response.call_on_close
        def on_response_sent():
            try:
                if os.path.exists(temp_audio_path):
                    logger.info(f"Cleaning up temporary file: {temp_audio_path}")
                    os.remove(temp_audio_path)
            except Exception as e:
                logger.error(f"Failed to remove temporary file: {e}")
                
        return response
        
    except Exception as e:
        logger.error(f"ElevenLabs text-to-speech error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Error processing text-to-speech with ElevenLabs",
            "error": str(e) if os.environ.get('FLASK_ENV') == 'development' else ""
        }), 500