from flask import Blueprint, jsonify, request

from ..services.rag import get_relevant_context
from ..utils.logger import logger

bp = Blueprint("chat", __name__, url_prefix="/api/chat")


@bp.route("/", methods=["POST"])
def chat():
    logger.info("Received chat request")

    data = request.get_json()
    query = data.get("query")
    chat_history = data.get("chatHistory", [])

    if not query:
        logger.warning("No query provided in request")
        return jsonify({"error": "Query is required"}), 400

    try:
        logger.info(f"Processing query: {query}")
        context = get_relevant_context(query, chat_history)
        logger.info("Successfully generated context")
        return jsonify({"context": context})
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500
