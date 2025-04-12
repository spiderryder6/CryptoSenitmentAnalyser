package mongo

import (
	"context"
	"testing"
	"time"

	"go.mongodb.org/mongo-driver/bson"
)

func setupTestMongo(t *testing.T) *MongoCli {
	t.Helper()

	cli, err := NewMongoCli("mongodb://localhost:27017", "testdb", "testcollection")
	if err != nil {
		t.Fatalf("failed to create Mongo client: %v", err)
	}

	// Clean up any existing data in the test collection
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = cli.Client.Database(cli.database).Collection(cli.collection).Drop(ctx)
	if err != nil {
		t.Fatalf("failed to clear test collection: %v", err)
	}

	return cli
}

func TestInsertAndFindOne(t *testing.T) {
	cli := setupTestMongo(t)
	defer cli.Close()

	data := SentimentData{
		Sentiment: 9001,
		Timestamp: 123456,
	}

	_, err := cli.InsertOne(data)
	if err != nil {
		t.Fatalf("insert failed: %v", err)
	}

	found, err := cli.FindOne(bson.D{{"score", 9001}})
	if err != nil {
		t.Fatalf("find failed: %v", err)
	}

	if found.Sentiment != 9001 {
		t.Errorf("expected sentiment 9001, got %d", found.Sentiment)
	}
}

func TestFindMany(t *testing.T) {
	cli := setupTestMongo(t)
	defer cli.Close()

	docs := []SentimentData{
		{Sentiment: 1, Timestamp: 111},
		{Sentiment: 2, Timestamp: 222},
	}
	for _, doc := range docs {
		_, err := cli.InsertOne(doc)
		if err != nil {
			t.Fatalf("insert failed: %v", err)
		}
	}

	results, err := cli.FindMany(bson.D{})
	if err != nil {
		t.Fatalf("find many failed: %v", err)
	}

	if len(results) != len(docs) {
		t.Errorf("expected %d results, got %d", len(docs), len(results))
	}
}
