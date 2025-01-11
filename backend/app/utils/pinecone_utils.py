from typing import Any, Dict, List

from config import Config
from pinecone import Pinecone

from .logger import logger


class PineconeClient:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(PineconeClient, cls).__new__(cls)
            cls._instance.client = Pinecone()
            cls._instance.index_name = Config.PINECONE_INDEX_NAME

            # verify index exists
            indexes = cls._instance.client.list_indexes()
            if not any(
                index.name == cls._instance.index_name for index in indexes.indexes
            ):
                logger.error(f"Index {cls._instance.index_name} does not exist")
                raise ValueError(
                    f"Index {cls._instance.index_name} does not exist. Create an index called {cls._instance.index_name} in your project."
                )
            logger.info(f"Connected to Pinecone index: {cls._instance.index_name}")
        return cls._instance

    def get_matches_from_embeddings(
        self, embeddings: List[float], top_k: int, namespace: str
    ) -> List[Dict[str, Any]]:
        try:
            # get the pinecone index
            index = self.client.Index(self.index_name)

            # query the index with namespace
            query_result = index.query(
                vector=embeddings,
                top_k=top_k,
                include_metadata=True,
                namespace=namespace,
            )

            matches = query_result.matches or []
            logger.info(
                f"Retrieved {len(matches)} matches from Pinecone in namespace {namespace}"
            )
            return matches
        except Exception as e:
            logger.error(
                f"Error querying embeddings in namespace {namespace}: {str(e)}"
            )
            raise Exception(f"Error querying embeddings: {e}")

    def upsert_vectors(self, vectors: List[Dict[str, Any]], namespace: str) -> None:
        try:
            index = self.client.Index(self.index_name)
            index.upsert(vectors=vectors, namespace=namespace)
            logger.info(f"Upserted {len(vectors)} vectors to namespace {namespace}")
        except Exception as e:
            logger.error(f"Error upserting vectors to namespace {namespace}: {str(e)}")
            raise

    def delete_vectors(self, filter: Dict[str, Any], namespace: str) -> None:
        try:
            index = self.client.Index(self.index_name)
            index.delete(filter=filter, namespace=namespace)
            logger.info(
                f"Deleted vectors from namespace {namespace} with filter {filter}"
            )
        except Exception as e:
            logger.error(f"Error deleting vectors from namespace {namespace}: {str(e)}")
            raise

    def delete_namespace(self, namespace: str) -> None:
        try:
            index = self.client.Index(self.index_name)
            index.delete(delete_all=True, namespace=namespace)
            logger.info(f"Deleted entire namespace {namespace}")
        except Exception as e:
            logger.error(f"Error deleting namespace {namespace}: {str(e)}")
            raise
