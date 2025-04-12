package reddit

import (
	"barnacle/pkg/config"
	"barnacle/pkg/model"
	"barnacle/pkg/stateHandler"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
)

// MockRedditServer creates a test HTTP server mimicking Reddit's API
func mockRedditServer(response string, statusCode int) *httptest.Server {
	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(statusCode)
		w.Write([]byte(response))
	}))
}

// TestConfig returns a mock config for testing
func testConfig() *config.Config {
	return &config.Config{
		RedditKey:      "test_key",
		RedditSecret:   "test_secret",
		UserAgent:      "test_agent",
		RequestUrl:     "https://reddit.com/r/bitcoin/new.json",
		RedditTokenURL: "https://www.reddit.com/api/v1/access_token",
		Target:         5,
	}
}

// TestPost generates a mock Reddit post
func testPost(id string, created float32) model.Post {
	return model.Post{
		AuthorFullname: "t2_" + id,
		Title:          "Post " + id,
		Created:        created,
	}
}

func TestRedditRequest_Success(t *testing.T) {
	// Mock Reddit API response
	mockResponse := `{
		"kind": "Listing",
		"data": {
			"after": "t3_xyz",
			"dist": 2,
			"children": [
				{ "data": { "author_fullname": "t2_abc", "title": "Bitcoin up!", "created": 123456789 } },
				{ "data": { "author_fullname": "t2_def", "title": "Bitcoin down!", "created": 123456790 } }
			]
		}
	}`
	server := mockRedditServer(mockResponse, http.StatusOK)
	defer server.Close()

	token_server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(`{"access_token": "mock_token", "token_type": "bearer"}`))
	}))
	defer token_server.Close()

	// Override config URL
	cfg := testConfig()
	cfg.RequestUrl = server.URL
	cfg.RedditTokenURL = token_server.URL

	// Initialize state
	state := &stateHandler.State{}

	// Execute
	posts, updatedState, err := RedditRequest(cfg, http.DefaultClient, state)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	// Assertions
	if len(posts) != 2 {
		t.Errorf("Expected 2 posts, got %d", len(posts))
	}
	if len(updatedState.States) != 2 {
		t.Errorf("Expected state to have 2 entries, got %d", len(updatedState.States))
	}
}

func TestRedditRequest_StateDeduplication(t *testing.T) {
	// Mock response with duplicate post (same author/title/created)
	mockPost := testPost("abc", 123456789)
	mockResponse := fmt.Sprintf(`{
		"kind": "Listing",
		"data": {
			"dist": 1,
			"children": [
				{ "data": %s }
			]
		}
	}`, toJSON(mockPost))

	server := mockRedditServer(mockResponse, http.StatusOK)
	defer server.Close()

	token_server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(`{"access_token": "mock_token", "token_type": "bearer"}`))
	}))
	defer token_server.Close()

	cfg := testConfig()
	cfg.RequestUrl = server.URL
	cfg.RedditTokenURL = token_server.URL

	// Pre-populate state with the same post
	state := &stateHandler.State{}
	state.Add(mockPost)

	// Execute
	posts, updatedState, err := RedditRequest(cfg, http.DefaultClient, state)
	if err != nil {
		t.Fatal(err)
	}

	// Assert no new posts added
	if len(posts) != 0 {
		t.Errorf("Expected 0 new posts (duplicate), got %d", len(posts))
	}
	if len(updatedState.States) != 1 {
		t.Error("State should remain unchanged")
	}
}

func TestGetRedditAccessToken_Success(t *testing.T) {
	// Mock OAuth server
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(`{"access_token": "mock_token", "token_type": "bearer"}`))
	}))
	defer server.Close()

	cfg := testConfig()
	cfg.RedditTokenURL = server.URL

	token, err := getRedditAccessToken(cfg)
	if err != nil {
		t.Fatal(err)
	}
	if token != "mock_token" {
		t.Errorf("Expected 'mock_token', got '%s'", token)
	}
}

func TestGetRedditAccessToken_InvalidCredentials(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"error": "invalid_client"}`))
	}))
	defer server.Close()

	cfg := testConfig()
	cfg.RedditTokenURL = server.URL

	_, err := getRedditAccessToken(cfg)
	if err == nil {
		t.Fatal("Expected error for invalid credentials")
	}
}

func TestUpdateRequestUrl(t *testing.T) {
	tests := []struct {
		name     string
		url      string
		after    string
		updated  bool
		expected string
	}{
		{"Initial Request", "https://reddit.com/r/bitcoin/new.json", "t3_abc", false, "https://reddit.com/r/bitcoin/new.json?after=t3_abc"},
		{"Subsequent Request", "https://reddit.com/r/bitcoin/new.json?after=t3_xyz", "t3_def", true, "https://reddit.com/r/bitcoin/new.json?after=t3_def"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := updateRequestUrl(tt.url, tt.after, tt.updated)
			if result != tt.expected {
				t.Errorf("Expected '%s', got '%s'", tt.expected, result)
			}
		})
	}
}

func TestRedditRequest_StatePersistence(t *testing.T) {
	// Mock two pages of responses
	post1 := testPost("abc", 123456789)
	post2 := testPost("abc", 123456789)
	mockResponses := []string{
		fmt.Sprintf(`{
			"kind": "Listing",
			"data": {
				"after": "t3_xyz",
				"dist": 1,
				"children": [
					{ "data": %s }
				]
			}
		}`, toJSON(post1)),
		fmt.Sprintf(`{
			"kind": "Listing",
			"data": {
				"dist": 1,
				"children": [
					{ "data": %s }
				]
			}
		}`, toJSON(post2)),
		`{
			"kind": "Listing",
			"data": {
				"dist": 0,
				"children": [
				]
			}
		}`,
	}

	var callCount int
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(mockResponses[callCount]))
		callCount++
	}))
	defer server.Close()

	token_server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(`{"access_token": "mock_token", "token_type": "bearer"}`))
	}))
	defer token_server.Close()

	cfg := testConfig()
	cfg.RequestUrl = server.URL
	cfg.RedditTokenURL = token_server.URL
	cfg.Target = 2

	state := &stateHandler.State{}

	// First call (gets post1)
	posts, state, err := RedditRequest(cfg, http.DefaultClient, state)
	if err != nil {
		t.Fatal(err)
	}
	if len(posts) != 1 {
		t.Fatalf("Expected 1 post, got %d", len(posts))
	}

	// Second call (gets post2, state remembers post1)
	posts, state, err = RedditRequest(cfg, http.DefaultClient, state)
	if err != nil {
		t.Fatal(err)
	}
}

func TestRedditRequest_EmptyResponse(t *testing.T) {
	server := mockRedditServer(`{"data": {"children": []}}`, http.StatusOK)
	defer server.Close()

	token_server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(`{"access_token": "mock_token", "token_type": "bearer"}`))
	}))
	defer token_server.Close()

	cfg := testConfig()
	cfg.RequestUrl = server.URL
	cfg.RedditTokenURL = token_server.URL

	posts, _, err := RedditRequest(cfg, http.DefaultClient, &stateHandler.State{})
	if err != nil {
		t.Fatal(err)
	}
	if len(posts) != 0 {
		t.Error("Expected no posts from empty response")
	}
}

func TestRedditRequest_RateLimited(t *testing.T) {
	server := mockRedditServer(`{"message": "Too Many Requests"}`, http.StatusTooManyRequests)
	defer server.Close()

	token_server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(`{"access_token": "mock_token", "token_type": "bearer"}`))
	}))
	defer token_server.Close()

	cfg := testConfig()
	cfg.RequestUrl = server.URL
	cfg.RedditTokenURL = token_server.URL

	_, _, err := RedditRequest(cfg, http.DefaultClient, &stateHandler.State{})
	if err == nil {
		t.Fatal("Expected error for rate limit")
	}
}

// toJSON converts a struct to indented JSON for test readability
func toJSON(v interface{}) string {
	b, _ := json.MarshalIndent(v, "", "  ")
	return string(b)
}
