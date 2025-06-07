package main

import (
	"context"
	"ei-api/handlers"
	"errors"
	"log"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func initDB(ctx context.Context) (*pgx.Conn, error) {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		return nil, errors.New("DATABASE_URL environment variable is not set")
	}
	return pgx.Connect(ctx, dbURL)
}

func main() {
	ctx := context.Background()
	conn, err := initDB(ctx)
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}
	defer conn.Close(ctx)

	router := gin.New()
	router.Use(gin.Logger())

	trustedProxies := os.Getenv("TRUSTED_PROXIES")
	if trustedProxies == "" {
		err := router.SetTrustedProxies(nil)
		if err != nil {
			log.Fatal(err)
		}
	} else {
		proxies := strings.Split(trustedProxies, ",")
		err := router.SetTrustedProxies(proxies)
		if err != nil {
			log.Fatal(err)
		}
	}

	router.POST("/api/users/backups/fetch", func(c *gin.Context) {
		handlers.FetchBackup(c, conn)
	})
	router.Run(":5000")
}
