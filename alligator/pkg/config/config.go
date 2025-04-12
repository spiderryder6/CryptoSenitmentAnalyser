package config

import (
	"log"

	"github.com/spf13/viper"
)

type Config struct {
	ConnStr    string `mapstructure:"connStr"`
	Database   string `mapstructure:"database"`
	Collection string `mapstructure:"collection"`
}

func NewConfig() (*Config, error) {
	return loadConfigFromFile("config/dev.json")
}

func loadConfigFromFile(path string) (*Config, error) {
	v := viper.New()
	v.SetConfigFile(path)

	err := v.ReadInConfig()
	if err != nil {
		log.Println("Can't read the config file:", err)
		return nil, err
	}

	var config Config
	err = v.Unmarshal(&config)
	if err != nil {
		log.Println("Config can't be unmarshaled:", err)
		return nil, err
	}

	return &config, nil
}
