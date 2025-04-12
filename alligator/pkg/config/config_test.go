package config

import (
	"os"
	"testing"
)

func TestNewConfig(t *testing.T) {
	configContent := `{
		"connStr": "mongodb://localhost:27017",
		"database": "testdb",
		"collection": "testcollection"
	}`

	tmpFile, err := os.CreateTemp("", "test-config-*.json")
	if err != nil {
		t.Fatal(err)
	}
	defer os.Remove(tmpFile.Name())

	if _, err := tmpFile.Write([]byte(configContent)); err != nil {
		t.Fatal(err)
	}
	tmpFile.Close()

	t.Run("load valid config file", func(t *testing.T) {
		cfg, err := loadConfigFromFile(tmpFile.Name())
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}
		if cfg.ConnStr != "mongodb://localhost:27017" {
			t.Errorf("Expected connStr, got %s", cfg.ConnStr)
		}
		if cfg.Database != "testdb" {
			t.Errorf("Expected database 'testdb', got %s", cfg.Database)
		}
		if cfg.Collection != "testcollection" {
			t.Errorf("Expected collection 'testcollection', got %s", cfg.Collection)
		}
	})

	t.Run("missing file should error", func(t *testing.T) {
		_, err := loadConfigFromFile("nonexistent.json")
		if err == nil {
			t.Error("Expected error for missing file")
		}
	})
}
