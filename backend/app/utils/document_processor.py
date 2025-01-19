from typing import Any, Dict, List

import pymupdf
from config import Config
from langchain.text_splitter import RecursiveCharacterTextSplitter
from openai import OpenAI

from .logger import logger
from .pinecone_utils import PineconeClient


class DocumentProcessor:
    def __init__(self):
        self.pinecone = PineconeClient()
        self.client = OpenAI(
            api_key=Config.HEURIST_AUTH_KEY,
            base_url=Config.HEURIST_GATEWAY_URL,
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
            is_separator_regex=False,
        )

    def process_file(
        self, file_name: str, file_data: bytes, file_type: str
    ) -> Dict[str, Any]:
        try:
            document_content = ""
            if file_type == "application/pdf":
                with pymupdf.open(stream=file_data, filetype="pdf") as doc:
                    for page in doc:
                        document_content += page.get_text() + "\n"
                logger.info(f"Processing file {file_name}")
            else:
                document_content = file_data.decode("utf-8")

            word_count = len(document_content.split())
            return {"document_content": document_content, "word_count": word_count}

        except Exception as e:
            logger.error(f"Error processing document: {str(e)}")
            raise

    def chunk_and_embed_file(
        self, document_id: str, document_url: str, content: str, namespace: str
    ) -> Dict[str, Any]:
        try:
            logger.info(
                f"Starting to chunk and embed file {document_id} in namespace {namespace}"
            )
            document = {
                "document_id": document_id,
                "document_url": document_url,
                "chunks": [],
            }

            chunks = self.text_splitter.split_text(content)
            logger.info(f"Created {len(chunks)} chunks from document {document_id}")

            embeddings = self._get_embeddings(chunks)
            logger.info(f"Generated embeddings for {len(embeddings)} chunks")

            for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
                document["chunks"].append(
                    {
                        "id": f"{document_id}:{i}",
                        "values": embedding,
                        "text": chunk,
                        "metadata": {"text": chunk, "source": document_url},
                    }
                )

            vectors = [
                {
                    "id": chunk["id"],
                    "values": chunk["values"],
                    "metadata": chunk["metadata"],
                }
                for chunk in document["chunks"]
            ]

            # TODO: https://docs.pinecone.io/guides/data/upsert-data#upsert-limits
            # batch size can be 1000 or 2mb, and should be as large as possible, so implement logic for that
            # or switch to https://docs.pinecone.io/guides/data/upsert-data#send-upserts-in-parallel
            upsert_batch_size = 500
            for i in range(0, len(vectors), upsert_batch_size):
                batch = vectors[i : i + upsert_batch_size]
                self.pinecone.upsert_vectors(vectors=batch, namespace=namespace)
                logger.info(
                    f"Upserted batch {i//upsert_batch_size + 1} of {len(vectors)//upsert_batch_size + 1} to namespace {namespace}"
                )

            logger.info(
                f"Successfully processed document {document_id} in namespace {namespace}"
            )
            return {"document": document}

        except Exception as e:
            logger.error(
                f"Error in chunking and embedding document {document_id} in namespace {namespace}: {str(e)}"
            )
            raise

    def _get_embeddings(self, texts: List[str]) -> List[List[float]]:
        try:
            all_embeddings = []
            batch_size = Config.BATCH_SIZE

            for i in range(0, len(texts), batch_size):
                batch = texts[i : i + batch_size]
                response = self.client.embeddings.create(
                    model="BAAI/bge-large-en-v1.5",
                    input=batch,
                    encoding_format="float",
                )
                all_embeddings.extend([data.embedding for data in response.data])
                logger.info(f"Processed embeddings batch {i//batch_size + 1}")

            return all_embeddings
        except Exception as e:
            logger.error(f"Error getting embeddings: {str(e)}")
            raise
