package api

import (
	"alligator/pkg/manager"
	"alligator/pkg/mongo"
	"alligator/pkg/timeUtil"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

type aggSentiment struct {
	Average   int `json:"average"`
	Timestamp int `json:"timestamp"`
}

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

	// Drop the collection to start fresh
	if err := cli.Client.Database(testDatabase).Collection(testCollection).Drop(ctx); err != nil {
		t.Fatalf("Failed to drop test collection: %v", err)
	}

	return cli
}

func TestGetAverageSentimentsFromXDaysAgo(t *testing.T) {
	cli := setupTestMongo(t)
	defer cli.Close()

	mgr, err := manager.NewManager(cli)
	if err != nil {
		t.Fatalf("Failed to create manager: %v", err)
	}
	api := NewApi(mgr)

	// Insert test data for 7 days.
	for i := 0; i < 7; i++ {
		timestamp := int(timeUtil.TimestampXDaysAgo(i).Unix())
		_, err := cli.InsertOne(mongo.SentimentData{Sentiment: 5000, Timestamp: timestamp})
		if err != nil {
			t.Fatalf("Failed to insert test data for day %d: %v", i, err)
		}
		_, err = cli.InsertOne(mongo.SentimentData{Sentiment: 7000, Timestamp: timestamp})
		if err != nil {
			t.Fatalf("Failed to insert test data for day %d: %v", i, err)
		}
	}

	t.Run("valid request", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{{Key: "daysAgo", Value: "7"}}

		api.GetAverageSentimentsFromXDaysAgo(c)

		assert.Equal(t, http.StatusOK, w.Code)

		// Unmarshal the JSON response into a slice
		var sentiments []aggSentiment
		err := json.Unmarshal(w.Body.Bytes(), &sentiments)
		if err != nil {
			t.Fatalf("Failed to unmarshal response: %v", err)
		}

		expectedCount := 7 + 1
		assert.Equal(t, expectedCount, len(sentiments), "Expected %d results", expectedCount)

		for _, s := range sentiments {
			assert.Equal(t, 6000, s.Average, "Expected average sentiment to be 6000")
			assert.NotEqual(t, 0, s.Timestamp)
		}
	})

	t.Run("invalid parameter", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{{Key: "daysAgo", Value: "invalid"}}

		api.GetAverageSentimentsFromXDaysAgo(c)

		assert.Equal(t, http.StatusBadRequest, w.Code)
		assert.Contains(t, w.Body.String(), "Must be integer")
	})
}
