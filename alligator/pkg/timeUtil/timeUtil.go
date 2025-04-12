package timeUtil

import "time"

func TimestampXDaysAgo(daysAgo int) time.Time {
	t := time.Now().Add(-time.Hour * 24 * time.Duration(daysAgo))
	return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location())
}
