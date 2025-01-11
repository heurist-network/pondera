from flask import Flask, jsonify
from flask_cors import CORS

from .routes.document_routes import document_routes


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})

    app.register_blueprint(document_routes, url_prefix="/api/documents")

    @app.route("/")
    def index():
        return jsonify({"message": "up!"}), 200

    return app
