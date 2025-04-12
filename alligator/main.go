package main

import (
	"alligator/pkg/api"
	"alligator/pkg/config"
	"alligator/pkg/manager"
	"alligator/pkg/mongo"
	"log"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var (
	MongoCli *mongo.MongoCli
	Manager  *manager.Manager
	Api      *api.Api
	Config   *config.Config
)

func init() {
	var err error
	os.Setenv("PORT", "80")

	Config, err = config.NewConfig()
	if err != nil {
		log.Fatal(err)
	}

	MongoCli, err = mongo.NewMongoCli(Config.ConnStr, Config.Database, Config.Collection)
	if err != nil {
		log.Fatal(err)
	}
	Manager, err = manager.NewManager(MongoCli)
	if err != nil {
		log.Fatal(err)
	}
	Api = api.NewApi(Manager)
}

func main() {
	router := gin.Default()

	// configure cors
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:4200", "https://green-bay-006f57e1e.6.azurestaticapps.net"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.GET("/sentiment/:daysAgo", Api.GetAverageSentimentForXDaysAgo)
	router.GET("/sentiments/:daysAgo", Api.GetAverageSentimentsFromXDaysAgo)

	router.Run()
}
