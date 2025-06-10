package handlers

import (
	"ei-api/models"
	"ei-api/repository"
	"ei-api/utils"
	"log"
	"net/http"

	ei_proto "ei-api/proto"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type RequestPayload struct {
	EID string `json:"eid"`
}

func FetchBackup(c *gin.Context, pool *pgxpool.Pool) {
	var payload RequestPayload
	if err := c.ShouldBindJSON(&payload); err != nil || payload.EID == "" {
		c.JSON(400, gin.H{"error": "Missing required parameter 'eid'"})
		return
	}

	req := utils.GetClientVersionPayload(payload.EID)

	encoded, err := utils.EncodePayloadToBase64(req)
	if err != nil {
		log.Println("Failed to encode payload:", err)
		c.JSON(500, gin.H{"error": "Encoding failed"})
		return
	}

	responseText, err := utils.FetchData(encoded)
	if err != nil {
		log.Println("Failed to fetch data:", err)
		c.JSON(500, gin.H{"error": "Failed to fetch data"})
		return
	}

	resp := &ei_proto.EggIncFirstContactResponse{}
	err = utils.DecodeResponse(responseText, resp)
	if err != nil {
		log.Println("Failed to decode response:", err)
		c.JSON(500, gin.H{"error": "Decoding failed"})
		return
	}

	if resp.ErrorMessage != nil && *resp.ErrorMessage != "" {
		log.Println("Error in response:", *resp.ErrorMessage)
		c.JSON(http.StatusBadRequest, gin.H{"error": *resp.ErrorMessage})
		return
	}

	stats := models.StatsInput{
		SoulEggs:     resp.GetBackup().GetGame().GetSoulEggsD(),
		ProphecyEggs: resp.GetBackup().GetGame().GetEggsOfProphecy(),
		Prestiges:    resp.GetBackup().GetStats().GetNumPrestiges(),
	}

	err = repository.InsertStats(c.Request.Context(), pool, stats)

	if err != nil {
		log.Println("Failed to insert stats:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert backup"})
		return
	}

	c.JSON(http.StatusCreated, stats)
}
