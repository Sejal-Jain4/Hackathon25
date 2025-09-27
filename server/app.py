from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Import route modules
from routes.users import users_bp
from routes.finances import finances_bp
from routes.gamification import gamification_bp
from routes.ai import ai_bp

# Register blueprints
app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(finances_bp, url_prefix='/api/finances')
app.register_blueprint(gamification_bp, url_prefix='/api/gamification')
app.register_blueprint(ai_bp, url_prefix='/api/ai')

# Health check route
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Server is healthy"})

# Error handler
@app.errorhandler(Exception)
def handle_error(e):
    print(str(e))  # Log the error
    return jsonify({
        "status": "error",
        "message": "Something went wrong!",
        "error": str(e) if os.environ.get('FLASK_ENV') == 'development' else ""
    }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('FLASK_ENV') == 'development')