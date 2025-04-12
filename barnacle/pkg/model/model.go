package model

type Post struct {
	Author         string  `json:"author"`
	AuthorFullname string  `json:"author_fullname"`
	Title          string  `json:"title"`
	Selftext       string  `json:"selftext"`
	Created        float32 `json:"created"`
}
