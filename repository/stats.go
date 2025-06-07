package repository

import (
	"context"

	"ei-api/models"

	"github.com/jackc/pgx/v5"
)

const insertStatsStmt = "insert_stats"
const insertStatsSQL = `INSERT INTO stats (soul_eggs, prophecy_eggs, prestiges) VALUES ($1, $2, $3)`

func PrepareStatements(ctx context.Context, conn *pgx.Conn) error {
	_, err := conn.Prepare(ctx, insertStatsStmt, insertStatsSQL)
	return err
}

func InsertStats(ctx context.Context, conn *pgx.Conn, stats models.Stats) error {
	_, err := conn.Exec(
		ctx,
		insertStatsStmt,
		stats.SoulEggs, stats.ProphecyEggs, stats.Prestiges,
	)
	return err
}
