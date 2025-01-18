from datetime import datetime, timedelta, timezone

from config import Config

from .logger import logger
from .pinecone_utils import PineconeClient
from .s3_utils import S3Client


class WorkspaceCleanup:
    def __init__(self):
        self.s3_client = S3Client()
        self.pinecone_client = PineconeClient()
        self.ttl_hours = Config.WORKSPACE_TTL_HOURS

    def get_active_workspaces(self):
        all_files = self.s3_client.list_files_without_urls("")
        workspaces = {}

        for file in all_files:
            parts = file["key"].split("/")
            if len(parts) >= 3:
                workspace_id = parts[0]
                last_modified = datetime.fromisoformat(file["last_modified"])

                if (
                    workspace_id not in workspaces
                    or last_modified > workspaces[workspace_id]
                ):
                    workspaces[workspace_id] = last_modified
            else:
                logger.info(f"Deleting stray file: {file['key']}")
                try:
                    self.s3_client.delete_file(file["key"])
                except Exception as e:
                    logger.error(f"Error deleting stray file {file['key']}: {str(e)}")

        return workspaces

    def cleanup_expired_workspaces(self):
        try:
            workspaces = self.get_active_workspaces()
            now = datetime.now(timezone.utc)
            ttl_delta = timedelta(hours=self.ttl_hours)

            index = self.pinecone_client.client.Index(self.pinecone_client.index_name)
            pinecone_namespaces = index.describe_index_stats().namespaces.keys()

            self._cleanup_expired(workspaces, now, ttl_delta)
            self._cleanup_orphaned(workspaces, pinecone_namespaces)

        except Exception as e:
            logger.error(f"Error in workspace cleanup: {str(e)}")

    def _cleanup_expired(self, workspaces, now, ttl_delta):
        for workspace_id, last_modified in workspaces.items():
            if now - last_modified > ttl_delta:
                logger.info(f"Cleaning up expired workspace {workspace_id}")
                try:
                    workspace_files = self.s3_client.list_files_without_urls(
                        f"{workspace_id}/"
                    )
                    for file in workspace_files:
                        if "/" in file["key"]:
                            self.s3_client.delete_file(file["key"])

                    self.pinecone_client.delete_namespace(workspace_id)
                    logger.info(f"Successfully cleaned up workspace {workspace_id}")
                except Exception as e:
                    logger.error(
                        f"Error cleaning up workspace {workspace_id}: {str(e)}"
                    )

    def _cleanup_orphaned(self, workspaces, pinecone_namespaces):
        for namespace in pinecone_namespaces:
            if namespace not in workspaces:
                logger.info(f"Cleaning up orphaned namespace {namespace}")
                try:
                    self.pinecone_client.delete_namespace(namespace)
                    logger.info(
                        f"Successfully cleaned up orphaned namespace {namespace}"
                    )
                except Exception as e:
                    logger.error(
                        f"Error cleaning up orphaned namespace {namespace}: {str(e)}"
                    )
