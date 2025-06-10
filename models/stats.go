package models

import (
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

type Stats struct {
	Id           uint64         `json:"id"`
	SoulEggs     pgtype.Numeric `json:"soulEggs"`
	ProphecyEggs uint64         `json:"prophecyEggs"`
	Prestiges    uint64         `json:"prestiges"`
	CreatedAt    time.Time      `json:"createdAt"`
}
