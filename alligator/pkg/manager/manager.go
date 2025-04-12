package manager

import (
	"alligator/pkg/mongo"
	"alligator/pkg/timeUtil"

	"go.mongodb.org/mongo-driver/bson"
)

type Manager struct {
	MongoCli *mongo.MongoCli
}

type aggSentiment struct {
	Average   int `json:"average"`
	Timestamp int `json:"timestamp"`
}

func NewManager(mongoCli *mongo.MongoCli) (*Manager, error) {
	return &Manager{
		MongoCli: mongoCli,
	}, nil
}

func (m *Manager) Close() error {
	return m.MongoCli.Close()
}

func (m *Manager) getSentimentsSince(daysAgo int) ([]mongo.SentimentData, error) {
	filter := bson.D{{
		Key:   "created",
		Value: bson.D{{Key: "$gt", Value: timeUtil.TimestampXDaysAgo(daysAgo).Unix()}},
	}}
	return m.MongoCli.FindMany(filter)
}

func (m *Manager) getSentimentsBetween(start, end int) ([]mongo.SentimentData, error) {
	filter := bson.D{
		{Key: "created", Value: bson.D{
			{Key: "$lte", Value: timeUtil.TimestampXDaysAgo(start).Unix()},
			{Key: "$gte", Value: timeUtil.TimestampXDaysAgo(end).Unix()},
		}},
	}
	return m.MongoCli.FindMany(filter)
}

func (m *Manager) calculateAverageSentiment(data []mongo.SentimentData) int {
	var sum int
	total := len(data)
	if total < 1 {
		return 0
	}
	for _, d := range data {
		if d.Sentiment < 0 {
			total--
			continue
		}
		sum += d.Sentiment
	}
	return sum / total
}

func (m *Manager) GetAverageSentiment(daysAgo int) (int, error) {
	sentiments, err := m.getSentimentsBetween(daysAgo-1, daysAgo)
	if err != nil {
		return 0, err
	}
	average := m.calculateAverageSentiment(sentiments)
	return average, nil
}

func (m *Manager) GetAverageSentiments(daysAgo int) ([]aggSentiment, error) {
	sentiments := make([]aggSentiment, daysAgo+1)
	for i := range daysAgo + 1 {
		avg, err := m.GetAverageSentiment(i)
		if err != nil {
			return nil, err
		}
		sentiments[i] = aggSentiment{
			Average:   avg,
			Timestamp: int(timeUtil.TimestampXDaysAgo(i).Unix()),
		}
	}
	return sentiments, nil
}
