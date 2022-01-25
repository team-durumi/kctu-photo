package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"html"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/blugelabs/bluge"
)

func main() {
	flag.Parse()

	if flag.NArg() < 1 {
		log.Fatal("must specify src path")
	}

	if flag.NArg() < 2 {
		log.Fatal("must specify dest path")
	}

	cfg := bluge.DefaultConfig(flag.Arg(1))
	idx, err := bluge.OpenOfflineWriter(cfg, 100, 10)
	if err != nil {
		log.Fatalf("error opening index writer: %v", err)
	}

	err = walkDirectoryForIndexing(flag.Arg(0), idx)
	if err != nil {
		log.Fatal(err)
	}

	err = idx.Close()
	if err != nil {
		log.Fatal(err)
	}
}

func walkDirectoryForIndexing(path string, idx *bluge.OfflineWriter) error {
	err := filepath.Walk(path, func(path string, info os.FileInfo, err error) error {
		if err == nil && filepath.Ext(path) == ".json" {
			pageDoc, err2 := readParseMapPage(path)
			if err2 != nil {
				return err2
			}
			if pageDoc != nil {
				return idx.Insert(pageDoc)
			}
			return nil
		}
		return nil
	})
	if err != nil {
		return err
	}
	return nil
}

type Page struct {
	Title     string   `json:"title"`
	Date      string   `json:"date"`
	Type      string   `json:"type"`
	PermaLink string   `json:"permalink"`
	Content   string   `json:"content"`
	Image     string   `json:"image"`
	Tags      []string `json:"tags"`
	Subjects  []string `json:"subjects"`
	Creators  []string `json:"creators"`
	Venues    []string `json:"venues"`
	Sources   []string `json:"sources"`
}

func readParseMapPage(path string) (*bluge.Document, error) {
	pageBytes, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var page Page
	err = json.Unmarshal(pageBytes, &page)
	if err != nil {
		return nil, fmt.Errorf("error unmarshaling json '%s': %v", path, err)
	}

	if strings.HasSuffix(page.PermaLink, "/search/") {
		// don't index the search page itself
		return nil, nil
	}

	doc := bluge.NewDocument(page.PermaLink).
		AddField(
			bluge.NewTextField("title", page.Title).
				StoreValue()).
		AddField(
			bluge.NewKeywordField("type", page.Type).
				StoreValue().
				Aggregatable()).
		AddField(
			bluge.NewKeywordField("tags", fmt.Sprint(page.Tags)).
				StoreValue().
				Aggregatable()).
		AddField(
			bluge.NewKeywordField("subjects", fmt.Sprint(page.Subjects)).
				StoreValue().
				Aggregatable()).
		AddField(
			bluge.NewKeywordField("creators", fmt.Sprint(page.Creators)).
				StoreValue().
				Aggregatable()).
		AddField(
			bluge.NewKeywordField("venues", fmt.Sprint(page.Venues)).
				StoreValue().
				Aggregatable()).
		AddField(
			bluge.NewKeywordField("sources", fmt.Sprint(page.Sources)).
				StoreValue().
				Aggregatable()).
		AddField(
			bluge.NewTextField("content", html.UnescapeString(page.Content)).
				StoreValue().
				HighlightMatches()).
		AddField(bluge.NewCompositeFieldExcluding("_all", []string{"_id"}))

	pageDate, err := time.Parse(time.RFC3339, page.Date)
	if err == nil && !pageDate.IsZero() {
		doc.AddField(bluge.NewDateTimeField("updated", pageDate))
	}

	return doc, nil
}
