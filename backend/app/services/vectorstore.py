import os
from typing import List

from langchain_pinecone import PineconeVectorStore
from openai import OpenAI
from pinecone import Pinecone

from ..utils.logger import logger


class CustomEmbeddings:
    def __init__(self):
        self.client = OpenAI(
            api_key=os.getenv("HEURIST_AUTH_KEY"),
            base_url=os.getenv(
                "HEURIST_GATEWAY_URL", "https://llm-gateway.heurist.xyz"
            ),
        )

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        logger.debug(f"Embedding {len(texts)} documents")
        response = self.client.embeddings.create(
            model="BAAI/bge-large-en-v1.5", input=texts, encoding_format="float"
        )
        return [data.embedding for data in response.data]

    def embed_query(self, text: str) -> List[float]:
        logger.debug("Embedding query")
        response = self.client.embeddings.create(
            model="BAAI/bge-large-en-v1.5", input=text, encoding_format="float"
        )
        return response.data[0].embedding


logger.info("Initializing Pinecone client")
pinecone = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

logger.info("Creating embeddings client")
embeddings = CustomEmbeddings()

logger.info("Initializing vector store")
try:
    vector_store = PineconeVectorStore.from_existing_index(
        index_name=os.getenv("PINECONE_INDEX"),
        embedding=embeddings,
    )
    logger.info("Vector store initialized successfully")
except Exception as e:
    logger.error(f"Error initializing vector store: {e}", exc_info=True)
    raise


def get_vector_store():
    """Get vector store instance"""
    return vector_store
