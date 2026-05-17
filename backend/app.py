from flask import Flask, jsonify
from flask_cors import CORS

from routes.api import api_bp


def create_app():
    """
    Factory function to initialize and configure
    the Sentinel Intelligence Engine backend.
    """

    app = Flask(__name__)

    # Enable cross-origin requests
    # Frontend runs on separate port during development
    CORS(app)

    # Register API routes
    app.register_blueprint(
        api_bp,
        url_prefix="/api"
    )

    @app.route("/")
    def home():
        """
        Root API information endpoint.
        """

        return jsonify({

            "message":
                "Sentinel Intelligence Engine API",

            "status":
                "running",

            "version":
                "2.0.0"
        })

    @app.route("/health")
    def health():
        """
        Simple backend health check endpoint.
        """

        return jsonify({
            "status": "healthy"
        }), 200

    return app


if __name__ == "__main__":

    app = create_app()

    print("=" * 60)
    print("🛡️  SENTINEL - Industrial Intelligence Engine")
    print("=" * 60)

    print("Backend server starting...\n")

    print("🌐 API Base:")
    print("   http://localhost:5000/api\n")

    print("📡 Available Endpoints:")

    print("   GET    /api/events")
    print("          → Retrieve processed industrial events\n")

    print("   GET    /api/incidents")
    print("          → Retrieve grouped intelligent incidents\n")

    print("   POST   /api/simulate")
    print("          → Generate causal industrial event chains\n")

    print("   GET    /api/dashboard")
    print("          → Retrieve operational intelligence metrics\n")

    print("   POST   /api/reset")
    print("          → Clear all monitoring data\n")

    print("❤️  Health Check:")
    print("   GET    /health\n")

    print("=" * 60)

    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )