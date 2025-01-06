from ..utils.logger import logger
from .vectorstore import get_vector_store

# system prompt template for qa
QA_TEMPLATE = """You are an enthusiastic AI assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

{context}

Question: {question}
Helpful answer in markdown:"""


def get_relevant_context(query: str, chat_history=None, top_k=3):
    try:
        logger.info(f"Getting relevant context for query: {query}")

        # get vector store instance
        logger.info("Getting vector store instance")
        vector_store = get_vector_store()

        # similarity search
        logger.info(f"Performing similarity search with k={top_k}")
        results = vector_store.similarity_search(query, k=top_k)
        logger.info(f"Found {len(results)} results")

        if not results:
            logger.info("No relevant context found")
            return QA_TEMPLATE.replace(
                "{context}", "No relevant context found."
            ).replace("{question}", query)

        # filter out duplicate passages based on content
        unique_results = []
        seen_content = set()
        for doc in results:
            if doc.page_content not in seen_content:
                unique_results.append(doc)
                seen_content.add(doc.page_content)
        logger.info(f"Filtered to {len(unique_results)} unique results")

        formatted_passages = []
        for i, doc in enumerate(unique_results):
            metadata = doc.metadata
            source = f"[Source: {metadata.get('fileName', '')}"
            if metadata.get("pageNumber"):
                source += f", Page {metadata['pageNumber']}"
            source += "]"
            formatted_passages.append(f"Passage {i + 1} {source}:\n{doc.page_content}")

        # format chat history if provided
        chat_history_text = ""
        if chat_history:
            logger.info("Processing chat history")
            recent_messages = chat_history[-4:]  # get last 4 messages
            chat_history_text = "\n".join(
                [f"{msg['role']}: {msg['content']}" for msg in recent_messages]
            )
            chat_history_text = f"Recent conversation:\n{chat_history_text}\n\n"

        # format full context
        passages_text = "\n\n".join(formatted_passages)
        context = (
            f"{chat_history_text}Relevant passages from documents:\n\n{passages_text}"
        )
        logger.info("Context preparation completed")

        return QA_TEMPLATE.replace("{context}", context).replace("{question}", query)

    except Exception as error:
        logger.error(f"Error getting relevant context: {error}", exc_info=True)
        return QA_TEMPLATE.replace("{context}", "Error retrieving context.").replace(
            "{question}", query
        )
