package api

import (
	"alligator/pkg/manager"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Api struct {
	manager *manager.Manager
}

func NewApi(manager *manager.Manager) *Api {
	return &Api{
		manager: manager,
	}
}

func (a *Api) GetAverageSentimentForXDaysAgo(c *gin.Context) {
	daysAgoStr := c.Param("daysAgo")
	daysAgo, err := strconv.Atoi(daysAgoStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid parameter: %s. Must be integer", daysAgoStr)})
		return
	}
	average, err := a.manager.GetAverageSentiment(daysAgo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"average": average})
}

func (a *Api) GetAverageSentimentsFromXDaysAgo(c *gin.Context) {
	daysAgoStr := c.Param("daysAgo")
	daysAgo, err := strconv.Atoi(daysAgoStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid parameter: %s. Must be integer", daysAgoStr)})
		return
	}
	sentiments, err := a.manager.GetAverageSentiments(daysAgo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, sentiments)
}

// func (a *Api) GetAverageSentimentForToday(c *gin.Context) {
// 	sentiments, err := a.manager.GetSentimentsSince(0)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}
// 	average := a.manager.CalculateAverageSentiment(sentiments)
// 	c.JSON(http.StatusOK, gin.H{"average": average})
// }
//
// func (a *Api) GetAverageSentimentForWeek(c *gin.Context) {
// 	sentiments, err := a.manager.GetSentimentsBetween(0, 7)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}
// 	average := a.manager.CalculateAverageSentiment(sentiments)
// 	c.JSON(http.StatusOK, gin.H{"average": average})
// }
//
// func (a *Api) GetAverageSentimentForMonth(c *gin.Context) {
// 	sentiments, err := a.manager.GetSentimentsBetween(0, 30)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}
// 	average := a.manager.CalculateAverageSentiment(sentiments)
// 	c.JSON(http.StatusOK, gin.H{"average": average})
// }
//
// func (a *Api) GetAverageSentimentForYesterday(c *gin.Context) {
// 	sentiments, err := a.manager.GetSentimentsBetween(0, 1)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}
// 	average := a.manager.CalculateAverageSentiment(sentiments)
// 	c.JSON(http.StatusOK, gin.H{"average": average})
// }
