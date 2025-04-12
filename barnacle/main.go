package main

import (
	"barnacle/pkg/blob"
	"barnacle/pkg/config"
	"barnacle/pkg/httpCli"
	"barnacle/pkg/reddit"
	"barnacle/pkg/stateHandler"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/google/uuid"
)

// TODO: Clean state when it gets too big

var (
	HttpCli    *http.Client
	BlobClient *blob.BlobClient
	Config     *config.Config
)

func init() {
	var err error
	Config, err = config.NewConfig()
	if err != nil {
		log.Fatal(err)
	}
	HttpCli = httpCli.NewRetryableClient()

	BlobClient, err = blob.NewBlobClient(Config.BlobUsername, Config.BlobKey, Config.BlobURL)
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	now := time.Now().Format("2006-01-02")

	stateIn, err := stateHandler.NewState(BlobClient, Config.BlobContainer, Config.StateDayLimit)
	if err != nil {
		log.Fatal(err)
	}

	posts, stateOut, err := reddit.RedditRequest(Config, HttpCli, stateIn)
	if err != nil {
		log.Fatal(err)
	}

	if len(posts) < 1 {
		log.Println("No new posts found, goodbye!")
		os.Exit(0)
	}

	data, err := json.Marshal(posts)
	if err != nil {
		log.Fatal(err)
	}

	postFileName := fmt.Sprintf("posts/%s/%s.json", now, uuid.New())
	err = BlobClient.UploadBlobFile(Config.BlobContainer, postFileName, data)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("%v posts uploaded to blob storage at %s\n", len(posts), postFileName)

	stateData, err := json.Marshal(stateOut)
	if err != nil {
		log.Fatal(err)
	}
	stateFileName := fmt.Sprintf("state/%s.json", now)
	err = BlobClient.UploadBlobFile(Config.BlobContainer, stateFileName, stateData)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("State uploaded to blob storage at %s\n", stateFileName)
}
