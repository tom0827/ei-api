package repository

import (
	"context"

	"ei-api/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

func InsertStats(ctx context.Context, pool *pgxpool.Pool, stats models.StatsInput) error {
	_, err := pool.Exec(
		ctx,
		"INSERT INTO stats (soul_eggs, prophecy_eggs, prestiges) VALUES ($1, $2, $3)",
		stats.SoulEggs, stats.ProphecyEggs, stats.Prestiges,
	)
	return err
}

func GetData(ctx context.Context, pool *pgxpool.Pool) ([]models.Stats, error) {
	rows, err := pool.Query(ctx, "SELECT id, soul_eggs, prophecy_eggs, prestiges, created_at FROM stats")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var statsList []models.Stats
	for rows.Next() {
		var s models.Stats
		if err := rows.Scan(&s.Id, &s.SoulEggs, &s.ProphecyEggs, &s.Prestiges, &s.CreatedAt); err != nil {
			return nil, err
		}
		statsList = append(statsList, s)
	}
	if rows.Err() != nil {
		return nil, rows.Err()
	}
	return statsList, nil
}
