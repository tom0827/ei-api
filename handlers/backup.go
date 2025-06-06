package handlers

import (
	"ei-api/models"
	"ei-api/repository"
	"ei-api/utils"
	"net/http"

	ei_proto "ei-api/proto"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type RequestPayload struct {
	EID string `json:"eid"`
}

func FetchBackup(c *gin.Context, conn *pgx.Conn) {
	var payload RequestPayload
	if err := c.ShouldBindJSON(&payload); err != nil || payload.EID == "" {
		c.JSON(400, gin.H{"error": "Missing required parameter 'eid'"})
		return
	}

	req := utils.GetClientVersionPayload(payload.EID)

	encoded, err := utils.EncodePayloadToBase64(req)
	if err != nil {
		c.JSON(500, gin.H{"error": "Encoding failed"})
		return
	}

	responseText, err := utils.FetchData(encoded)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch data"})
		return
	}

	resp := &ei_proto.EggIncFirstContactResponse{}
	err = utils.DecodeResponse(responseText, resp)
	if err != nil {
		c.JSON(500, gin.H{"error": "Decoding failed"})
		return
	}

	stats := models.Stats{
		SoulEggs:     resp.GetBackup().GetGame().GetSoulEggsD(),
		ProphecyEggs: resp.GetBackup().GetGame().GetEggsOfProphecy(),
		Prestiges:    resp.GetBackup().GetStats().GetNumPrestiges(),
	}

	err = repository.InsertStats(c.Request.Context(), conn, stats)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert backup"})
		return
	}

	c.JSON(http.StatusCreated, stats)
}
