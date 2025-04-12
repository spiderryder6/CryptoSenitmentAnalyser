import json

from blob import AzureBlobStorageManager
from chatManager import LLMChatManager
from cosmos import CosmosMongoDBClient


class AnalysisManager:

    def __init__(self, config):
        secs = config.sections()

        self.ds_cli = LLMChatManager(
            api_key=config[secs[1]]["api_key"],
            base_url=config[secs[1]]["base_url"],
            model=config[secs[1]]["model"],
        )

        self.blob_cli = AzureBlobStorageManager(
            connection_string=config[secs[0]]["connection_string"]
        )

        self.container = config[secs[0]]["container_name"]

        self.mongo_cli = CosmosMongoDBClient(
            config[secs[2]]["connection_string"],
            config[secs[2]]["database"],
            config[secs[2]]["collection"],
        )

    def analyze_sentiment(self, prefix):
        blobs = self.blob_cli.list_blobs(self.container)
        blobs_to_analyze = []
        for blob in blobs:
            if blob.name[:5] == prefix:
                blobs_to_analyze.append(blob.name)

        if len(blobs_to_analyze) == 0:
            print("No blobs found to analyze.")
            return

        print(f"Found {len(blobs_to_analyze)} blobs to analyze.")

        query = [
            "Below I will include the title and text of posts seperated by commas"
            + "from r/Bitcoin subreddit. Please analyze the sentiment"
            + "of each post on a scale of 0 to 10000. 0 being extremely "
            + "bearish and 10000 being extremely bullish."
            + "If I inlcude x posts in a message and you must return x scores."
            + "If there isn't enough information in a post to analyze, that score can be -1"
            + "Please respond with only "
            + "a comma seperated list of 1 sentiment score per post"
        ]

        timestamps = []
        scores = []
        blobs_to_delete = []
        i = 0
        j = 1
        # Loop through each blob
        for blob in blobs_to_analyze:
            content = self.blob_cli.read_blob(self.container, blob)
            print(f"Analyzing blob {j} out of {len(blobs_to_analyze)}. blob: {blob}")
            for row in content:
                # Send for analysis every 10 posts
                if i % 10 == 0 and i != 0:
                    print("Analyzing posts", i - 10, "to", i)
                    response = self.send_to_chat(query)
                    print(response)
                    scores.extend(response)
                    # reset query list while keeping first element
                    query = query[:1]
                    # Write scores to database and delete read blobs every 100 posts
                    if i % 100 == 0 and i != 0:
                        self.write_sentiment(scores, timestamps)
                        scores = []
                        timestamps = []
                        self.delete_blobs(blobs_to_delete)
                        blobs_to_delete = []
                post = "title:" + row["title"] + " text:" + row["selftext"]
                query.append(post)
                timestamps.append(row["created"])
                i += 1
            blobs_to_delete.append(blob)
            j += 1

        if len(scores) != len(timestamps):
            diff = len(timestamps) - len(scores)
            print("Leftovers....")
            print(f"Analyzing the remaining {diff} posts")
            response = self.send_to_chat(query)
            print(response)
            scores.extend(response)

        print("Sentiment analysis complete.")

        self.write_sentiment(scores, timestamps)

        self.delete_blobs(blobs_to_delete)

    def write_sentiment(self, scores, timestamps):
        sentiment_scores = []
        print("Writing scores to database")
        total = 0
        if len(scores) != len(timestamps):
            if len(scores) > len(timestamps):
                total = len(timestamps)
            elif len(scores) < len(timestamps):
                total = len(scores)
        else:
            total = len(scores)
        if total == 0:
            print("No scores to write.")
            return
        for i in range(total):
            sentiment_scores.append({"score": int(scores[i]), "created": timestamps[i]})
        self.mongo_cli.insert_many_documents(sentiment_scores)
        print("Scores written.")

    def export_sentiment_to_json(
        self, scores, timestamps, output_path="sentiment_output.json"
    ):
        sentiment_scores = []
        total = min(len(scores), len(timestamps))

        if total == 0:
            print("No scores to export.")
            return

        for i in range(total):
            sentiment_scores.append({"score": int(scores[i]), "created": timestamps[i]})

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(sentiment_scores, f, indent=2)

        print(f"✅ {total} sentiment scores exported to {output_path}.")

    def send_to_chat(self, query):
        if len(query) <= 1:
            raise ValueError("Query must have at least one element.")
        response = self.ds_cli.chat_with_multiple_messages(query)
        return response.strip().replace("\n", "").replace(" ", "").split(",")

    def delete_blobs(self, blobs):
        print("Deleting blobs")
        for blob in blobs:
            try:
                self.blob_cli.delete_blob(self.container, blob)
            except Exception as e:
                print(f"Failed to delete blob {blob}: {str(e)}")
                continue
        print("Blobs deleted.")
