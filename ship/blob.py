import json

from azure.storage.blob import BlobClient, BlobServiceClient, ContainerClient


class AzureBlobStorageManager:
    def __init__(self, connection_string=None, account_name=None, account_key=None):
        if connection_string:
            self.blob_service_client = BlobServiceClient.from_connection_string(
                connection_string
            )
        elif account_name and account_key:
            self.blob_service_client = BlobServiceClient(
                account_url=f"https://{account_name}.blob.core.windows.net",
                credential=account_key,
            )
        else:
            raise ValueError(
                "Either connection_string or both account_name and account_key must be provided."
            )
        print("Connected to Blob storage successfully")

    def list_blobs(self, container_name):
        """List all blobs in a container."""
        container_client = self.blob_service_client.get_container_client(container_name)
        return container_client.list_blobs()

    def read_blob(self, container_name, blob_name):
        blob_client = self.blob_service_client.get_blob_client(
            container=container_name, blob=blob_name
        )
        blob_data = blob_client.download_blob()
        content = blob_data.readall()

        # Parse the JSON array into a Python variable
        try:
            json_array = json.loads(content)
            return json_array
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON from blob {blob_name}: {e}")
            return {}

    def write_blob(self, container_name, blob_name, content):
        """Write content to a blob."""
        blob_client = self.blob_service_client.get_blob_client(
            container=container_name, blob=blob_name
        )
        blob_client.upload_blob(content, overwrite=True)
        print(f"Blob {blob_name} uploaded successfully.")

    def delete_blob(self, container_name, blob_name):
        """Delete a blob."""
        blob_client = self.blob_service_client.get_blob_client(
            container=container_name, blob=blob_name
        )
        blob_client.delete_blob()
        print(f"Blob {blob_name} deleted successfully.")
