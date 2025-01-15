import time
from typing import Any, Dict, List

import boto3
from botocore.exceptions import ClientError
from config import Config as AppConfig

from .logger import logger


class S3Client:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(S3Client, cls).__new__(cls)
            s3_config = {
                "endpoint_url": AppConfig.S3_ENDPOINT,
                "aws_access_key_id": AppConfig.S3_ACCESS_KEY,
                "aws_secret_access_key": AppConfig.S3_SECRET_KEY,
                "region_name": AppConfig.S3_REGION,
            }
            cls._instance.s3 = boto3.client("s3", **s3_config)
            cls._instance.bucket_name = AppConfig.S3_BUCKET
            cls._instance._url_cache = {}  # {file_key: (url, expiry_timestamp)}
            if not cls._instance.bucket_name:
                logger.error("AWS_BUCKET_NAME environment variable is required")
                raise ValueError("AWS_BUCKET_NAME environment variable is required")
            logger.info(f"Connected to S3 bucket: {cls._instance.bucket_name}")
        return cls._instance

    def upload_file(self, file_data: bytes, file_key: str, content_type: str) -> str:
        try:
            self.s3.put_object(
                Bucket=self.bucket_name,
                Key=file_key,
                Body=file_data,
                ContentType=content_type,
            )
            logger.info(f"Uploaded file to S3: {file_key}")
            return self.get_file_url(file_key)
        except ClientError as e:
            logger.error(f"Error uploading file to S3: {str(e)}")
            raise

    def delete_file(self, file_key: str) -> None:
        try:
            self.s3.delete_object(Bucket=self.bucket_name, Key=file_key)
            logger.info(f"Deleted file from S3: {file_key}")
        except ClientError as e:
            logger.error(f"Error deleting file from S3: {str(e)}")
            raise

    # this is for workspace cleanup, so we don't need the urls
    def list_files_without_urls(self, prefix: str) -> List[Dict[str, Any]]:
        try:
            response = self.s3.list_objects_v2(Bucket=self.bucket_name, Prefix=prefix)

            files = []
            if "Contents" in response:
                for obj in response["Contents"]:
                    files.append(
                        {
                            "key": obj["Key"],
                            "size": obj["Size"],
                            "last_modified": obj["LastModified"].isoformat(),
                        }
                    )
            return files
        except ClientError as e:
            logger.error(f"Error listing files in S3: {str(e)}")
            raise

    def list_files(self, prefix: str) -> List[Dict[str, Any]]:
        files = self.list_files_without_urls(prefix)
        for file in files:
            file["url"] = self.get_file_url(file["key"])
        return files

    # expires in 6 hours
    def get_file_url(self, file_key: str, expires_in: int = 21600) -> str:
        current_time = time.time()

        # check if url is cached and still valid
        if file_key in self._url_cache:
            url, expiry = self._url_cache[file_key]
            if current_time < expiry - 1200:  # 20 min buffer
                return url

        try:
            url = self.s3.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket_name, "Key": file_key},
                ExpiresIn=expires_in,
            )
            # cache the url with its expiration time
            self._url_cache[file_key] = (url, current_time + expires_in)
            logger.info(f"Generated and cached presigned URL for file: {file_key}")
            return url
        except ClientError as e:
            logger.error(f"Error generating presigned URL: {str(e)}")
            raise
