package mongo

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoCli struct {
	Client     *mongo.Client
	database   string
	collection string
}

type SentimentData struct {
	ID        string `bson:"id,omitempty"`
	Sentiment int    `bson:"score"`
	Timestamp int    `bson:"created"`
}

func NewMongoCli(connectionString, database, collection string) (*MongoCli, error) {
	clientOptions := options.Client().ApplyURI(connectionString)
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to MongoDB: %v", err)
	}

	err = client.Ping(context.TODO(), nil)
	if err != nil {
		return nil, fmt.Errorf("failed to ping MongoDB: %v", err)
	}

	log.Println("Connected to MongoDB Cosmos DB!")
	return &MongoCli{
		Client:     client,
		database:   database,
		collection: collection,
	}, nil
}

func (m *MongoCli) Close() error {
	if err := m.Client.Disconnect(context.TODO()); err != nil {
		return fmt.Errorf("failed to disconnect from MongoDB: %v", err)
	}
	log.Println("Connection to MongoDB Cosmos DB closed.")
	return nil
}

func (m *MongoCli) InsertOne(data SentimentData) (*mongo.InsertOneResult, error) {
	collection := m.Client.Database(m.database).Collection(m.collection)
	result, err := collection.InsertOne(context.TODO(), data)
	if err != nil {
		return nil, fmt.Errorf("failed to insert document: %v", err)
	}
	return result, nil
}

func (m *MongoCli) FindOne(filter bson.D) (*SentimentData, error) {
	collection := m.Client.Database(m.database).Collection(m.collection)
	var result SentimentData
	err := collection.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		return nil, fmt.Errorf("failed to find document: %v", err)
	}
	return &result, nil
}

func (m *MongoCli) UpdateOne(filter bson.D, update bson.D) (*mongo.UpdateResult, error) {
	collection := m.Client.Database(m.database).Collection(m.collection)
	result, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return nil, fmt.Errorf("failed to update document: %v", err)
	}
	return result, nil
}

func (m *MongoCli) DeleteOne(filter bson.D) (*mongo.DeleteResult, error) {
	collection := m.Client.Database(m.database).Collection(m.collection)
	result, err := collection.DeleteOne(context.TODO(), filter)
	if err != nil {
		return nil, fmt.Errorf("failed to delete document: %v", err)
	}
	return result, nil
}

func (m *MongoCli) FindMany(filter bson.D, opts ...*options.FindOptions) ([]SentimentData, error) {
	collection := m.Client.Database(m.database).Collection(m.collection)
	var results []SentimentData

	cursor, err := collection.Find(context.TODO(), filter, opts...)
	if err != nil {
		return nil, fmt.Errorf("failed to find documents: %v", err)
	}
	defer cursor.Close(context.TODO())

	for cursor.Next(context.TODO()) {
		var result SentimentData
		if err := cursor.Decode(&result); err != nil {
			return nil, fmt.Errorf("failed to decode document: %v", err)
		}
		results = append(results, result)
	}

	if err := cursor.Err(); err != nil {
		return nil, fmt.Errorf("cursor error: %v", err)
	}

	return results, nil
}
