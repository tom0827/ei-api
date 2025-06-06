package repository

import (
	"context"

	"ei-api/models"

	"github.com/jackc/pgx/v5"
)

func InsertStats(ctx context.Context, conn *pgx.Conn, stats models.Stats) error {
	_, err := conn.Exec(
		ctx,
		`INSERT INTO stats (soul_eggs, prophecy_eggs, prestiges) VALUES ($1, $2, $3)`,
		stats.SoulEggs, stats.ProphecyEggs, stats.Prestiges,
	)
	return err
}
