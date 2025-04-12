package config

import (
	"log"

	"github.com/spf13/viper"
)

type Config struct {
	BlobKey        string `mapstructure:"blob_key"`
	BlobUsername   string `mapstructure:"blob_username"`
	BlobURL        string `mapstructure:"blob_url"`
	BlobContainer  string `mapstructure:"blob_container"`
	RequestUrl     string `mapstructure:"request_url"`
	Target         int    `mapstructure:"request_target"`
	UserAgent      string `mapstructure:"user_agent"`
	RedditKey      string `mapstructure:"reddit_key"`
	RedditSecret   string `mapstructure:"reddit_secret"`
	RedditTokenURL string `mapstructure:"reddit_token_url"`
	StateDayLimit  int    `mapstructure:"state_day_limit"`
}

func NewConfig() (*Config, error) {
	config := Config{}
	viper.SetConfigFile("config/dev.json")

	err := viper.ReadInConfig()
	if err != nil {
		log.Fatal("Can't find the file .json : ", err)
	}

	err = viper.Unmarshal(&config)
	if err != nil {
		log.Fatal("Config can't be loaded: ", err)
	}
	return &config, nil
}
