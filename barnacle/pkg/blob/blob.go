package blob

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"os"

	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
)

type BlobClient struct {
	client *azblob.Client
}

func NewBlobClient(accountName, accountKey, url string) (*BlobClient, error) {
	credential, err := azblob.NewSharedKeyCredential(accountName, accountKey)
	if err != nil {
		return nil, err
	}

	client, err := azblob.NewClientWithSharedKeyCredential(url, credential, nil)
	if err != nil {
		return nil, err
	}
	return &BlobClient{client: client}, err
}

func (bc *BlobClient) ListBlob(containerName string) []string {
	var blobs []string
	// List the blobs in the container

	pager := bc.client.NewListBlobsFlatPager(containerName, &azblob.ListBlobsFlatOptions{
		Include: azblob.ListBlobsInclude{Snapshots: true, Versions: true},
	})

	for pager.More() {
		resp, err := pager.NextPage(context.TODO())
		if err != nil {
			log.Fatal(err)
		}

		for _, blob := range resp.Segment.BlobItems {
			blobs = append(blobs, *blob.Name)
		}
	}
	return blobs
}

func (bc *BlobClient) CheckIfBlobExists(containerName string, blobName string) bool {
	list := bc.ListBlob(containerName)
	for _, blob := range list {
		if blob == blobName {
			return true
		}
	}
	return false
}

func (bc *BlobClient) DownloadBlobToFile(containerName string, blobName string) {
	// Create or open a local file where we can download the blob
	file, err := os.Create(blobName)
	if err != nil {
		log.Fatal(err)
	}

	// Download the blob to the local file
	_, err = bc.client.DownloadFile(context.TODO(), containerName, blobName, file, nil)
	if err != nil {
		log.Fatal(err)
	}
}

func (bc *BlobClient) DownloadBlobToStream(containerName string, blobName string) (bytes.Buffer, error) {
	// Download the blob
	get, err := bc.client.DownloadStream(context.TODO(), containerName, blobName, nil)
	if err != nil {
		return bytes.Buffer{}, err
	}
	downloadedData := bytes.Buffer{}
	retryReader := get.NewRetryReader(context.TODO(), &azblob.RetryReaderOptions{})
	_, err = downloadedData.ReadFrom(retryReader)
	if err != nil {
		return bytes.Buffer{}, err
	}
	err = retryReader.Close()
	if err != nil {
		log.Fatal(err)
	}
	return downloadedData, err
}

func (bc *BlobClient) UploadBlobFile(containerName string, blobName string, fileToUpload []byte) error {
	// Upload the file to the specified container with the specified blob name
	_, err := bc.client.UploadBuffer(context.TODO(), containerName, blobName, fileToUpload, nil)
	if err != nil {
		return err
	}
	return err
}

func (bc *BlobClient) DeleteBlob(containerName string, blobName string) error {
	fmt.Printf("Deleting the blob " + blobName + "\n")
	_, err := bc.client.DeleteBlob(context.TODO(), containerName, blobName, nil)
	if err != nil {
		return err
	}
	return err
}
