from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, PyMongoError


class CosmosMongoDBClient:
    def __init__(self, connection_string, database_name, collection_name):
        self.connection_string = connection_string
        self.database_name = database_name
        self.collection_name = collection_name

        try:
            # Connect to the MongoDB server
            self.client = MongoClient(self.connection_string)
            self.db = self.client[self.database_name]
            self.collection = self.db[self.collection_name]
            print("Connected to Cosmos DB MongoDB API successfully!")
        except ConnectionFailure as e:
            print(f"Failed to connect to Cosmos DB: {e}")
            raise

    def insert_document(self, document):
        try:
            result = self.collection.insert_one(document)
            print(f"Document inserted with ID: {result.inserted_id}")
            return result.inserted_id
        except PyMongoError as e:
            print(f"Failed to insert document: {e}")
            raise

    def insert_many_documents(self, documents):
        try:
            result = self.collection.insert_many(documents)
            print(f"Inserted {len(result.inserted_ids)} document(s).")
            return result.inserted_ids
        except PyMongoError as e:
            print(f"Failed to insert documents: {e}")
            raise

    def find_document(self, query):
        try:
            documents = list(self.collection.find(query))
            print(f"Found {len(documents)} document(s).")
            return documents
        except PyMongoError as e:
            print(f"Failed to find documents: {e}")
            raise

    def update_document(self, query, update_data):
        try:
            result = self.collection.update_many(query, {"$set": update_data})
            print(f"Updated {result.modified_count} document(s).")
            return result.modified_count
        except PyMongoError as e:
            print(f"Failed to update documents: {e}")
            raise

    def delete_document(self, query):
        try:
            result = self.collection.delete_many(query)
            print(f"Deleted {result.deleted_count} document(s).")
            return result.deleted_count
        except PyMongoError as e:
            print(f"Failed to delete documents: {e}")
            raise

    def close_connection(self):
        self.client.close()
        print("Connection to Cosmos DB closed.")
