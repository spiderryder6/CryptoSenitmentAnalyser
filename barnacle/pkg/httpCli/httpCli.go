package httpCli

import (
	"bytes"
	"io"
	"log"
	"math"
	"net/http"
	"syscall"
	"time"
)

const RetryCount = 10

func backoff(retries int) time.Duration {
	return time.Duration(math.Pow(2, float64(retries))) * time.Second / 2
}

func shouldRetry(err error, resp *http.Response) bool {
	if err != nil {
		return true
	}

	if resp.StatusCode == http.StatusBadGateway ||
		resp.StatusCode == http.StatusServiceUnavailable ||
		resp.StatusCode == http.StatusGatewayTimeout ||
		resp.StatusCode == http.StatusTooManyRequests {
		return true
	}
	return false
}

func shouldDrain(err error) bool {
	if err == io.EOF || err == syscall.ECONNRESET {
		return false
	}
	return true
}

func drainBody(resp *http.Response) {
	if resp.Body != nil {
		io.Copy(io.Discard, resp.Body)
		resp.Body.Close()
	}
}

type retryableTransport struct {
	transport http.RoundTripper
}

func (t *retryableTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	// Clone the request body
	var bodyBytes []byte
	if req.Body != nil {
		bodyBytes, _ = io.ReadAll(req.Body)
		req.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
	}
	// Send the request
	resp, err := t.transport.RoundTrip(req)
	// Retry logic
	retries := 0
	for shouldRetry(err, resp) && retries < RetryCount {
		// Wait for the specified backoff period
		time.Sleep(backoff(retries))
		if shouldDrain(err) {
			drainBody(resp)
		}
		// Clone the request body again
		if req.Body != nil {
			req.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
		}
		// Retry the request
		resp, err = t.transport.RoundTrip(req)
		retries++
		log.Printf("Retrying request %s %s\n", req.Method, req.URL)
	}
	// Return the response
	return resp, err
}

func NewRetryableClient() *http.Client {
	transport := &retryableTransport{
		transport: &http.Transport{},
	}

	return &http.Client{
		Transport: transport,
	}
}
