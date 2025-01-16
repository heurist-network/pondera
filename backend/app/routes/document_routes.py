import uuid

from config import Config
from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename

from ..utils.document_processor import DocumentProcessor
from ..utils.logger import logger
from ..utils.pinecone_utils import PineconeClient
from ..utils.s3_utils import S3Client
from ..utils.workspace_cleanup import WorkspaceCleanup

document_routes = Blueprint("document_routes", __name__)
document_processor = DocumentProcessor()
pinecone_client = PineconeClient()
s3_client = S3Client()
workspace_cleanup = WorkspaceCleanup()


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in Config.ALLOWED_EXTENSIONS
    )


@document_routes.route("/add", methods=["POST"])
def add_documents():
    namespace_id = request.args.get("namespace_id")

    if not namespace_id:
        active_workspaces = workspace_cleanup.get_active_workspaces()
        if len(active_workspaces) >= Config.MAX_WORKSPACES:
            logger.warning(f"Workspace limit of {Config.MAX_WORKSPACES} reached")
            workspace_cleanup.cleanup_expired_workspaces()

            active_workspaces = workspace_cleanup.get_active_workspaces()
            if len(active_workspaces) >= Config.MAX_WORKSPACES:
                return (
                    jsonify(
                        {
                            "message": "Global workspace limit reached. Try again in a few minutes.",
                            "code": "WORKSPACE_LIMIT_REACHED",
                            "description": "Please reach out to us on Discord if this persists.",
                        }
                    ),
                    400,
                )

        namespace_id = str(uuid.uuid4())
        logger.info(f"Created new namespace: {namespace_id}")

    if "files" not in request.files:
        logger.warning("No files uploaded in request")
        return jsonify({"message": "No files uploaded"}), 400

    files = request.files.getlist("files")
    document_responses = []
    errors = []

    for file in files:
        if file and allowed_file(file.filename):
            try:
                document_id = str(uuid.uuid4())
                filename = secure_filename(file.filename)
                logger.info(f"Processing file {filename} in namespace {namespace_id}")

                file_data = file.read()
                processed = document_processor.process_file(
                    filename, file_data, file.content_type
                )

                file_key = f"{namespace_id}/{document_id}/{filename}"
                s3_url = s3_client.upload_file(file_data, file_key, file.content_type)

                document = document_processor.chunk_and_embed_file(
                    document_id, s3_url, processed["document_content"], namespace_id
                )

                document_responses.append(document)
                logger.info(f"Successfully processed file {filename}")

            except Exception as e:
                logger.error(f"Error processing file {file.filename}: {str(e)}")
                errors.append(str(e))
                continue

    if errors:
        return (
            jsonify(
                {
                    "message": "Some documents failed to process",
                    "errors": errors,
                    "document_responses": document_responses,
                }
            ),
            400,
        )

    return (
        jsonify(
            {
                "message": "Documents added successfully",
                "namespace_id": namespace_id,
                "document_responses": document_responses,
            }
        ),
        200,
    )


@document_routes.route("/context", methods=["POST"])
def get_context():
    try:
        data = request.json
        if not data or "query" not in data or "namespace" not in data:
            logger.error("Missing required fields in request: query and namespace")
            return (
                jsonify({"message": "Missing required fields: query and namespace"}),
                400,
            )

        query = data["query"]
        namespace = data["namespace"]
        top_k = data.get("top_k", 7)
        min_score = data.get("min_score", 0.15)

        logger.info(f"Getting context for query in namespace {namespace}")

        try:
            embeddings = document_processor._get_embeddings([query])[0]
        except Exception as e:
            logger.error(f"Error generating embeddings: {str(e)}")
            return jsonify({"message": f"Error generating embeddings: {str(e)}"}), 500

        try:
            matches = pinecone_client.get_matches_from_embeddings(
                embeddings, top_k, namespace
            )
            logger.info(f"Found {len(matches)} matches for query")

            formatted_matches = []
            seen_texts = set()

            for match in matches:
                if match.score and match.score > min_score:
                    text = match.metadata.get("text", "").strip()
                    if text in seen_texts:
                        continue
                    seen_texts.add(text)

                    formatted_matches.append(
                        {
                            "id": match.id,
                            "score": match.score,
                            "metadata": {
                                "text": text,
                                "source": match.metadata.get("source", ""),
                            },
                        }
                    )
                    logger.info(f"Match score: {match.score}")

            logger.info(
                f"Returning {len(formatted_matches)} matches after filtering and deduplication"
            )
            return jsonify(formatted_matches), 200
        except Exception as e:
            logger.error(f"Error getting matches from Pinecone: {str(e)}")
            return jsonify({"message": f"Error getting matches: {str(e)}"}), 500

    except Exception as e:
        logger.error(f"Error in get_context: {str(e)}")
        return jsonify({"message": f"Error getting context: {str(e)}"}), 500


@document_routes.route("/workspace/<namespace_id>", methods=["DELETE"])
def delete_workspace(namespace_id):
    try:
        logger.info(f"Deleting workspace {namespace_id}")

        files = s3_client.list_files(f"{namespace_id}/")
        for file in files:
            s3_client.delete_file(file["key"])

        pinecone_client.delete_namespace(namespace_id)

        logger.info(f"Successfully deleted workspace {namespace_id}")
        return jsonify({"message": "Workspace deleted successfully"}), 200
    except Exception as e:
        logger.error(f"Error deleting workspace {namespace_id}: {str(e)}")
        return jsonify({"message": f"Error deleting workspace: {str(e)}"}), 500


@document_routes.route("/files/<namespace_id>", methods=["GET"])
def list_files(namespace_id):
    try:
        logger.info(f"Listing files in namespace {namespace_id}")

        files = s3_client.list_files(f"{namespace_id}/")

        formatted_files = []
        for file in files:
            parts = file["key"].split("/")
            if len(parts) >= 3:
                formatted_files.append(
                    {
                        "documentId": parts[1],
                        "filename": parts[2],
                        "url": s3_client.get_file_url(file["key"]),
                        "size": file["size"],
                        "lastModified": file["last_modified"],
                    }
                )

        logger.info(f"Found {len(formatted_files)} files in namespace {namespace_id}")
        return jsonify(formatted_files), 200
    except Exception as e:
        logger.error(f"Error listing files in namespace {namespace_id}: {str(e)}")
        return jsonify({"message": f"Error listing files: {str(e)}"}), 500


@document_routes.route(
    "/files/<namespace_id>/<document_id>/<path:filename>", methods=["GET"]
)
def serve_document(namespace_id, document_id, filename):
    try:
        logger.info(f"Serving document {filename} from namespace {namespace_id}")

        file_key = f"{namespace_id}/{document_id}/{filename}"
        url = s3_client.get_file_url(file_key)
        return jsonify({"url": url}), 200
    except Exception as e:
        logger.error(f"Error serving document {filename}: {str(e)}")
        return jsonify({"message": f"Error serving document: {str(e)}"}), 500
