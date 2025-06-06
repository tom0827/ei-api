package main

import (
	"context"
	"ei-api/handlers"
	"errors"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

func initDB(ctx context.Context) (*pgx.Conn, error) {
	godotenv.Load()
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

	router := gin.Default()
	router.POST("/users/backups/fetch", func(c *gin.Context) {
		handlers.FetchBackup(c, conn)
	})
	router.Run(":8080")
}
