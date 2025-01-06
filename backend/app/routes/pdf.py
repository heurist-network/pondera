import os
import uuid

from flask import Blueprint, jsonify, request
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from werkzeug.utils import secure_filename

from ..services.vectorstore import get_vector_store
from ..utils.logger import logger

bp = Blueprint("pdf", __name__, url_prefix="/api/pdf")

UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


def prepare_documents_for_vectorstore(splits, filename):
    """Prepare document chunks for vector store insertion"""
    prepared_docs = []
    for i, doc in enumerate(splits):
        # ensure text content is string
        text = str(doc.page_content).strip()
        if not text:
            continue

        # prepare metadata
        metadata = {
            "fileName": filename,
            "pageNumber": doc.metadata.get("page", None),
            "chunkId": str(uuid.uuid4()),
        }

        # create document with proper structure
        prepared_docs.append(
            {
                "text": text,
                "metadata": metadata,
            }
        )

    return prepared_docs


@bp.route("/process", methods=["POST"])
def process_pdf():
    logger.info("Starting PDF processing request")
    filepath = None

    if "file" not in request.files:
        logger.warning("No file in request")
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        logger.warning("Empty filename received")
        return jsonify({"error": "No file selected"}), 400

    if not file.filename.endswith(".pdf"):
        logger.warning(f"Invalid file type: {file.filename}")
        return jsonify({"error": "Only PDF files are allowed"}), 400

    try:
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        logger.info(f"Saving file to {filepath}")
        file.save(filepath)

        # load and split the pdf
        logger.info("Loading PDF with PyPDFLoader")
        loader = PyPDFLoader(filepath)
        pages = loader.load()
        logger.info(f"Loaded {len(pages)} pages from PDF")

        logger.info("Splitting text into chunks")
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=200
        )
        splits = text_splitter.split_documents(pages)
        logger.info(f"Created {len(splits)} text chunks")

        # prepare documents for vector store
        logger.info("Preparing documents for vector store")
        prepared_docs = prepare_documents_for_vectorstore(splits, filename)
        logger.info(f"Prepared {len(prepared_docs)} documents")

        # log sample document for debugging
        if prepared_docs:
            logger.debug(f"Sample document structure: {prepared_docs[0]}")

        # add to vector store
        logger.info("Getting vector store instance")
        vector_store = get_vector_store()

        logger.info("Adding documents to vector store")
        try:
            vector_store.add_texts(
                texts=[doc["text"] for doc in prepared_docs],
                metadatas=[doc["metadata"] for doc in prepared_docs],
            )
            logger.info("Successfully added documents to vector store")
        except Exception as ve:
            logger.error(f"Vector store error: {ve}", exc_info=True)
            raise

        # cleanup
        logger.info(f"Cleaning up temporary file: {filepath}")
        os.remove(filepath)

        logger.info("PDF processing completed successfully")
        return jsonify({"message": "PDF processed successfully"})
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}", exc_info=True)
        if filepath and os.path.exists(filepath):
            try:
                os.remove(filepath)
                logger.info(f"Cleaned up temporary file after error: {filepath}")
            except Exception as cleanup_error:
                logger.error(f"Error during cleanup: {cleanup_error}", exc_info=True)
        return jsonify({"error": str(e)}), 500
