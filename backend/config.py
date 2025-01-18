import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    # fmt: off
    # https://python.langchain.com/api_reference/_modules/langchain_community/embeddings/deepinfra.html#DeepInfraEmbeddings
    BATCH_SIZE = 1024
    WORKSPACE_TTL_HOURS = int(os.getenv("WORKSPACE_TTL_HOURS", "12"))  # time in hours
    MAX_WORKSPACES = int(os.getenv("MAX_WORKSPACES", "50"))  # maximum number of workspaces allowed
    ALLOWED_EXTENSIONS = {"pdf", "txt"}
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
    HEURIST_AUTH_KEY = os.getenv("HEURIST_AUTH_KEY")
    HEURIST_GATEWAY_URL = os.getenv("HEURIST_GATEWAY_URL")
    S3_ENDPOINT = os.getenv("S3_ENDPOINT")
    S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY")
    S3_SECRET_KEY = os.getenv("S3_SECRET_KEY")
    S3_BUCKET = os.getenv("S3_BUCKET")
    S3_REGION = os.getenv("S3_REGION", "us-east-1")
    S3_FOLDER = os.getenv("S3_FOLDER")
