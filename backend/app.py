from flask import Flask, jsonify
from flask_cors import CORS
from routes.api import api_bp

def create_app():
    """
    Factory function to create and configure the Flask app.
    Keeps it simple for hackathon MVP.
    """
    app = Flask(__name__)
    
    # Enable CORS for all routes (frontend will run on different port)
    CORS(app)
    
    # Register API blueprint with /api prefix
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Simple health check endpoint
    @app.route('/')
    def home():
        return jsonify({
            "message": "Sentinel Backend API",
            "status": "running",
            "version": "1.0.0-mvp"
        })
    
    @app.route('/health')
    def health():
        return jsonify({"status": "healthy"}), 200
    
    return app


if __name__ == '__main__':
    app = create_app()
    
    print("=" * 50)
    print("🛡️  SENTINEL - Industrial Monitoring System")
    print("=" * 50)
    print("Backend server starting...")
    print("API endpoints available at: http://localhost:5000/api")
    print("\nAvailable endpoints:")
    print("  GET  /api/events      - Get all events")
    print("  GET  /api/incidents   - Get all incidents")
    print("  POST /api/simulate    - Generate mock events")
    print("  GET  /api/dashboard   - Get summary stats")
    print("  POST /api/reset       - Clear all data")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)