from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask, jsonify
from flask_cors import CORS

from .routes.document_routes import document_routes
from .utils.logger import logger
from .utils.workspace_cleanup import WorkspaceCleanup


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})

    app.register_blueprint(document_routes, url_prefix="/api/documents")

    scheduler = BackgroundScheduler()
    cleanup = WorkspaceCleanup()

    # run cleanup on startup, and then every 15 minutes
    cleanup.cleanup_expired_workspaces()
    scheduler.add_job(
        cleanup.cleanup_expired_workspaces,
        "interval",
        minutes=15,
        id="workspace_cleanup",
    )
    scheduler.start()
    logger.info("Started workspace cleanup scheduler (running every 15 minutes)")

    @app.route("/")
    def index():
        return jsonify({"message": "up!"}), 200

    return app
