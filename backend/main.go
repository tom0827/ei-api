package main

import (
	"context"
	"ei-api/handlers"
	"errors"
	"log"
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func initDBPool(ctx context.Context) (*pgxpool.Pool, error) {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		return nil, errors.New("DATABASE_URL environment variable is not set")
	}

	config, err := pgxpool.ParseConfig(dbURL)
	if err != nil {
		return nil, err
	}

	config.ConnConfig.StatementCacheCapacity = 0
	config.ConnConfig.DefaultQueryExecMode = pgx.QueryExecModeSimpleProtocol

	return pgxpool.NewWithConfig(ctx, config)
}

func main() {
	ctx := context.Background()

	pool, err := initDBPool(ctx)
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}
	defer pool.Close()

	router := gin.New()
	router.Use(gin.Logger())

	allowedOrigin := os.Getenv("ALLOWED_ORIGIN")
	if allowedOrigin == "" {
		log.Println("ALLOWED_ORIGIN environment variable is not set.")
		allowedOrigin = "http://localhost:3000"
	}

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{allowedOrigin},
		AllowMethods: []string{"GET", "POST"},
	}))

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
		handlers.FetchBackup(c, pool)
	})
	router.GET("/api/data", func(c *gin.Context) {
		handlers.GetData(c, pool)
	})
	router.Run(":2052")
}
