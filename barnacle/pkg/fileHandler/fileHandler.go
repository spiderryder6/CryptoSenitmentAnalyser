package fileHandler

import (
	"io"
	"log"
	"os"
)

func WriteFile(toWrite []byte, fileName string) error {
	f, err := os.OpenFile(fileName, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return err
	}
	defer f.Close()

	_, err = f.Write(toWrite)
	if err != nil {
		return err
	}
	return nil
}

func WriteFileTruncate(toWrite []byte, fileName string) error {
	f, err := os.Create(fileName)
	if err != nil {
		return err
	}
	defer f.Close()

	_, err = f.Write(toWrite)
	if err != nil {
		return err
	}
	return nil
}

func ReadFile(fileName string) ([]byte, error) {
	if doesFileExist(fileName) {
		log.Printf("File %s does not exist\n", fileName)
		return nil, nil
	}

	f, err := os.Open(fileName)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	data, err := io.ReadAll(f)
	return data, err
}

func doesFileExist(fileName string) bool {
	_, error := os.Stat(fileName)

	return os.IsNotExist(error)
}
