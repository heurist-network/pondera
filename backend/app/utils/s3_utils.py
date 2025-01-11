from typing import Any, Dict, List

import boto3
from botocore.client import Config
from botocore.exceptions import ClientError
from config import Config as AppConfig

from .logger import logger


class S3Client:
    def __init__(self):
        s3_config = {
            "endpoint_url": AppConfig.S3_ENDPOINT,
            "aws_access_key_id": AppConfig.S3_ACCESS_KEY,
            "aws_secret_access_key": AppConfig.S3_SECRET_KEY,
            "region_name": AppConfig.S3_REGION,
        }

        self.s3 = boto3.client("s3", **s3_config)
        self.bucket_name = AppConfig.S3_BUCKET
        if not self.bucket_name:
            logger.error("AWS_BUCKET_NAME environment variable is required")
            raise ValueError("AWS_BUCKET_NAME environment variable is required")
        logger.info(f"Connected to S3 bucket: {self.bucket_name}")

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

    def list_files(self, prefix: str) -> List[Dict[str, Any]]:
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
                            "url": self.get_file_url(obj["Key"]),
                        }
                    )
            logger.info(f"Listed {len(files)} files from S3 with prefix: {prefix}")
            return files
        except ClientError as e:
            logger.error(f"Error listing files in S3: {str(e)}")
            raise

    def get_file_url(
        self, file_key: str, expires_in: int = 21600
    ) -> str:  # 6 hours expiry, TODO: implement ttl for workspace as a whole
        try:
            url = self.s3.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket_name, "Key": file_key},
                ExpiresIn=expires_in,
            )
            logger.info(f"Generated presigned URL for file: {file_key}")
            return url
        except ClientError as e:
            logger.error(f"Error generating presigned URL: {str(e)}")
            raise
