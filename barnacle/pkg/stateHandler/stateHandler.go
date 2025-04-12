package stateHandler

import (
	"barnacle/pkg/blob"
	"barnacle/pkg/fileHandler"
	"barnacle/pkg/model"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"log"
	"sort"
	"time"
)

type State struct {
	States []StateRow `json:"states"`
}

type StateRow struct {
	Hash       string  `json:"hash"`
	TimePosted float32 `json:"time_posted"`
}

func (state *State) Add(post model.Post) {
	state.States = append(state.States, StateRow{
		Hash:       generateHash(post),
		TimePosted: post.Created,
	})
}

func (state *State) Contains(post model.Post) bool {
	hash := generateHash(post)
	for _, stateRow := range state.States {
		if stateRow.Hash == hash {
			return true
		}
	}
	return false
}

func (state *State) GetNewestPostTime() float32 {
	newest := float32(0)
	for _, stateRow := range state.States {
		if stateRow.TimePosted > newest {
			newest = stateRow.TimePosted
		}
	}
	return newest
}

func (state *State) GetOldestPostTime() float32 {
	oldest := float32(0)
	for _, stateRow := range state.States {
		if stateRow.TimePosted < oldest {
			oldest = stateRow.TimePosted
		}
	}
	return oldest
}

func (s *State) sortByTimePosted() {
	sort.Slice(s.States, func(i, j int) bool {
		return s.States[i].TimePosted < s.States[j].TimePosted
	})
}

func (state *State) removeStateRowsBeforeIndex(index int) {
	state.States = state.States[index:]
}

func (state *State) CleanState(dayLimit int) {
	count := 0
	state.sortByTimePosted()
	for _, stateRow := range state.States {
		if time.Unix(int64(stateRow.TimePosted), 0).Before(time.Now().Add(time.Hour * -24 * time.Duration(dayLimit))) {
			count++
		} else {
			break
		}
	}
	state.removeStateRowsBeforeIndex(count)

	log.Printf("Removed %d old posts from state\n", count)
}

func NewState(blobClient *blob.BlobClient, containerName string, stateDayLimit int) (*State, error) {
	fileName := generateStateFileName(time.Now())
	if checkIfStateExists(blobClient, containerName, fileName) {
		return getStateFromBlob(blobClient, containerName, fileName)
	}
	log.Printf("State file %s not found, searching for most recent\n", fileName)
	state, err := getMostRecentState(blobClient, containerName)
	if err != nil {
		return state, err
	}
	state.CleanState(stateDayLimit)
	return state, nil
}

func generateHash(post model.Post) string {
	h := sha256.New()
	h.Write([]byte(fmt.Sprintf("%s%s%f", post.AuthorFullname, post.Title, post.Created)))
	return fmt.Sprintf("%x", h.Sum(nil))
}

func getStateFromFile(fileName string) (State, error) {
	emptyState := State{
		States: make([]StateRow, 0),
	}
	state := State{}

	readData, err := fileHandler.ReadFile(fileName)
	if err != nil {
		return emptyState, err
	}
	if readData != nil {
		err = json.Unmarshal(readData, &state)
		if err != nil {
			return emptyState, err
		}
	}
	return state, err
}

func getStateFromBlob(blobClient *blob.BlobClient, containerName string, fileName string) (*State, error) {
	state := State{}

	log.Printf("Downloading state blob %s from container %s\n", fileName, containerName)
	readData, err := blobClient.DownloadBlobToStream(containerName, fileName)
	if err != nil {
		return &state, err
	}

	err = json.Unmarshal(readData.Bytes(), &state)
	if err != nil {
		return &state, err
	}
	return &state, err
}

func checkIfStateExists(blobClient *blob.BlobClient, containerName string, fileName string) bool {
	return blobClient.CheckIfBlobExists(containerName, fileName)
}

func generateStateFileName(now time.Time) string {
	return fmt.Sprintf("state/%s.json", now.Format("2006-01-02"))
}

func getMostRecentState(blobClient *blob.BlobClient, containerName string) (*State, error) {
	blobList := blobClient.ListBlob(containerName)
	for i := range 7 {
		fileName := generateStateFileName(time.Now().AddDate(0, 0, -(i + 1)))
		for _, blob := range blobList {
			if blob == fileName {
				return getStateFromBlob(blobClient, containerName, fileName)
			}
		}
	}

	return &State{}, nil
}

// func remove(s []StateRow, i int) []StateRow {
// 	s[i] = s[len(s)-1]
// 	return s[:len(s)-1]
// }
