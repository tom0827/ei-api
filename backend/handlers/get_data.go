package handlers

import (
	"ei-api/repository"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func GetData(c *gin.Context, pool *pgxpool.Pool) {
	stats, err := repository.GetData(c.Request.Context(), pool)
	if err != nil {
		log.Println("Error retrieving data:", err)
		c.JSON(500, gin.H{"error": "Failed to retrieve data"})
		return
	}

	c.JSON(200, gin.H{
		"count": len(stats),
		"data":  stats,
	})
}
