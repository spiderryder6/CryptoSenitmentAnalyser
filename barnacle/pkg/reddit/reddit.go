package reddit

import (
	"barnacle/pkg/config"
	"barnacle/pkg/model"
	"barnacle/pkg/stateHandler"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
)

type RedditResponse struct {
	Kind string `json:"kind"`
	Data struct {
		After    string `json:"after"`
		Count    int    `json:"dist"`
		Children []struct {
			Post model.Post `json:"data"`
		}
	}
}

func RedditRequest(config *config.Config, httpCli *http.Client, state *stateHandler.State) ([]model.Post, *stateHandler.State, error) {
	var redditResponse RedditResponse
	Posts := make([]model.Post, 0)
	count := 0
	dupCount := 0
	isURLUpdated := false
	requestURL := config.RequestUrl

	accessToken, err := getRedditAccessToken(config)
	if err != nil {
		return nil, nil, err
	}

	for count < config.Target {

		// Make http request
		req, err := http.NewRequest("GET", requestURL, nil)
		if err != nil {
			log.Fatal(err)
		}

		// Add headers
		req.Header.Set("User-Agent", config.UserAgent)
		req.Header.Set("Authorization", "Bearer "+accessToken)

		res, err := httpCli.Do(req)
		if err != nil {
			log.Printf("error making http request: %s\n", err)
			return nil, nil, err
		}

		log.Printf("client: status: %s\n", res.Status)
		if res.StatusCode == http.StatusTooManyRequests {
			return nil, nil, fmt.Errorf("rate limit exceeded")
		}

		// Read response body
		body, err := io.ReadAll(res.Body)
		if err != nil {
			return nil, nil, err
		}
		// Unmarshal response body
		err = json.Unmarshal(body, &redditResponse)
		if err != nil {
			return nil, nil, err
		}
		res.Body.Close()

		if redditResponse.Data.Count == 0 || len(redditResponse.Data.Children) == 0 {
			log.Printf("No more posts found\n")
			break
		}

		count += redditResponse.Data.Count

		for _, child := range redditResponse.Data.Children {
			// Check state for post
			if state.Contains(child.Post) {
				dupCount++
				continue
			}

			Posts = append(Posts, child.Post)
			state.Add(child.Post)
		}
		requestURL = updateRequestUrl(requestURL, redditResponse.Data.After, isURLUpdated)
		isURLUpdated = true
	}
	log.Printf("Duplicate count: %d\n", dupCount)

	return Posts, state, nil
}

func updateRequestUrl(requestURL string, after string, updated bool) string {
	if updated {
		splitURL := strings.Split(requestURL, "?")
		return fmt.Sprintf("%s?after=%s", splitURL[0], after)
	}
	return fmt.Sprintf("%s?after=%s", requestURL, after)
}

func getRedditAccessToken(config *config.Config) (string, error) {
	// Reddit token endpoint
	tokenURL := config.RedditTokenURL
	// Prepare form data
	data := url.Values{}
	data.Set("grant_type", "client_credentials")

	// Create HTTP request
	req, err := http.NewRequest("POST", tokenURL, bytes.NewBufferString(data.Encode()))
	if err != nil {
		fmt.Println("Error creating request:", err)
		return "", err
	}

	// Set headers
	req.SetBasicAuth(config.RedditKey, config.RedditSecret)
	req.Header.Set("User-Agent", config.UserAgent)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending request:", err)
		return "", err
	}
	defer resp.Body.Close()

	// Read response
	body, _ := io.ReadAll(resp.Body)

	// Extract access token
	var result map[string]interface{}
	json.Unmarshal(body, &result)
	if result["access_token"] == nil {
		return "", fmt.Errorf("access token not found in response")
	}
	accessToken := result["access_token"].(string)

	return accessToken, err
}
