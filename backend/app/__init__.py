from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

load_dotenv()


def create_app():
    app = Flask(__name__)
    CORS(app)

    # register routes
    from .routes import chat, pdf

    app.register_blueprint(chat.bp)
    app.register_blueprint(pdf.bp)

    return app
