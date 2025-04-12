package timeUtil

import (
	"strconv"
	"testing"
	"time"
)

func TestTimestampXDaysAgo(t *testing.T) {
	testCases := []struct {
		daysAgo int
	}{
		{0},
		{1},
		{2},
		{7},
	}

	for _, tc := range testCases {
		t.Run("daysAgo="+strconv.Itoa(tc.daysAgo), func(t *testing.T) {
			got := TimestampXDaysAgo(tc.daysAgo)

			now := time.Now().Add(-time.Hour * 24 * time.Duration(tc.daysAgo))
			expected := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

			if !got.Equal(expected) {
				t.Errorf("For daysAgo=%d, expected %v, but got %v", tc.daysAgo, expected, got)
			}
		})
	}
}
