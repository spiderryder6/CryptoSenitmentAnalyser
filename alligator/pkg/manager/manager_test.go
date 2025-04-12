package manager

import (
	"alligator/pkg/mongo"
	"alligator/pkg/timeUtil"
	"context"
	"testing"
	"time"
)

const (
	testConnectionString = "mongodb://localhost:27017"
	testDatabase         = "manager_test_db"
	testCollection       = "sentiments"
)

func setupTestMongo(t *testing.T) *mongo.MongoCli {
	t.Helper()

	cli, err := mongo.NewMongoCli(testConnectionString, testDatabase, testCollection)
	if err != nil {
		t.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := cli.Client.Database(testDatabase).Collection(testCollection).Drop(ctx); err != nil {
		t.Fatalf("Failed to drop test collection: %v", err)
	}

	return cli
}

func TestCalculateAverageSentiment(t *testing.T) {
	mgr := &Manager{}

	tests := []struct {
		name     string
		data     []mongo.SentimentData
		expected int
	}{
		{"empty data", []mongo.SentimentData{}, 0},
		{"valid data", []mongo.SentimentData{
			{Sentiment: 5000}, {Sentiment: 7000},
		}, 6000},
		{"with negative value", []mongo.SentimentData{
			{Sentiment: 5000}, {Sentiment: -1}, {Sentiment: 7000},
		}, 6000},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := mgr.calculateAverageSentiment(tt.data)
			if got != tt.expected {
				t.Errorf("Expected %d, got %d", tt.expected, got)
			}
		})
	}
}

func TestGetAverageSentiment(t *testing.T) {
	cli := setupTestMongo(t)
	defer cli.Close()

	now := time.Now()
	// Insert data that's 1 day ago (so daysAgo = 1 will pick it up)
	data := []mongo.SentimentData{
		{Sentiment: 5000, Timestamp: int(now.Add(-25 * time.Hour).Unix())},
		{Sentiment: 7000, Timestamp: int(now.Add(-25 * time.Hour).Unix())},
	}

	for _, d := range data {
		if _, err := cli.InsertOne(d); err != nil {
			t.Fatalf("Failed to insert test data: %v", err)
		}
	}

	mgr := &Manager{MongoCli: cli}

	t.Run("get average for day 1", func(t *testing.T) {
		avg, err := mgr.GetAverageSentiment(1)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}
		if avg != 6000 {
			t.Errorf("Expected average 6000, got %d", avg)
		}
	})
}

func TestGetAverageSentiments(t *testing.T) {
	cli := setupTestMongo(t)
	defer cli.Close()

	// Insert a few different days of data
	for i := 0; i < 4; i++ {
		timestamp := int(timeUtil.TimestampXDaysAgo(i).Unix())
		// Insert consistent data
		cli.InsertOne(mongo.SentimentData{Sentiment: 5000, Timestamp: timestamp})
		cli.InsertOne(mongo.SentimentData{Sentiment: 7000, Timestamp: timestamp})
	}

	mgr := &Manager{MongoCli: cli}

	t.Run("get 4 days of averages", func(t *testing.T) {
		results, err := mgr.GetAverageSentiments(3)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if len(results) != 4 {
			t.Errorf("Expected 4 results, got %d", len(results))
		}
		for _, r := range results {
			if r.Average != 6000 {
				t.Errorf("Expected average 6000, got %d", r.Average)
			}
		}
	})
}
