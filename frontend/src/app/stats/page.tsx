"use client";
import { useDataContext } from "./_contexts/data-context";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { formatLargeNumber } from "../_shared/number-format";
import TimelineIcon from "@mui/icons-material/Timeline";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useState } from "react";
import AllTimeStatsGraph from "./_components/all-time-stats-graph";
import AllTimeStatsTable from "./_components/all-time-stats-table";
import { formatDate } from "../_shared/date-format";

export default function StatsPage() {
  const { data, loading, error, refetch } = useDataContext();
  type DataView = "list" | "graph";
  const [dataView, setDataView] = useState<DataView>("graph");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const now = new Date();
  const getGain = (periodMs: number) => {
    const cutoff = new Date(now.getTime() - periodMs);
    const recent = Number(data[data.length - 1]?.soulEggs);
    const past = Number(
      data.findLast((d) => new Date(d.createdAt) <= cutoff)?.soulEggs ??
        data[0]?.soulEggs
    );
    return recent - past;
  };

  const gain24h = getGain(24 * 60 * 60 * 1000);
  const gain7d = getGain(7 * 24 * 60 * 60 * 1000);
  const gain30d = getGain(30 * 24 * 60 * 60 * 1000);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="mx-auto max-w-6xl w-full">
        <div className="flex gap-8 pb-8">
          <Card className="flex-1 w-sm">
            <CardHeader>
              <CardDescription>1 Day Gains</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {formatLargeNumber(gain24h)}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  +{" "}
                  {data.length > 0 && data[data.length - 1].soulEggs
                    ? `${(
                        (gain24h / Number(data[data.length - 1].soulEggs)) *
                        100
                      ).toFixed(2)}%`
                    : "N/A"}
                </Badge>
              </CardAction>
            </CardHeader>
          </Card>
          <Card className="flex-1 w-sm">
            <CardHeader>
              <CardDescription>1 Week Gains</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {formatLargeNumber(gain7d)}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  +{" "}
                  {data.length > 0 && data[data.length - 1].soulEggs
                    ? `${(
                        (gain7d / Number(data[data.length - 1].soulEggs)) *
                        100
                      ).toFixed(2)}%`
                    : "N/A"}
                </Badge>
              </CardAction>
            </CardHeader>
          </Card>
          <Card className="flex-1 w-sm">
            <CardHeader>
              <CardDescription>1 Month Gains</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {formatLargeNumber(gain30d)}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  +{" "}
                  {data.length > 0 && data[data.length - 1].soulEggs
                    ? `${(
                        (gain30d / Number(data[data.length - 1].soulEggs)) *
                        100
                      ).toFixed(2)}%`
                    : "N/A"}
                </Badge>
              </CardAction>
            </CardHeader>
          </Card>
          <Card className="flex-1 w-sm">
            <CardHeader>
              <CardDescription className="text-xs">
                Soul Eggs:{" "}
                {data.length > 0
                  ? formatLargeNumber(data[data.length - 1].soulEggs)
                  : "N/A"}
                <br />
                Prophecy Eggs:{" "}
                {data.length > 0
                  ? Number(data[data.length - 1].prophecyEggs)
                  : "N/A"}
                <br />
                Prestiges:{" "}
                {data.length > 0
                  ? Number(data[data.length - 1].prestiges)
                  : "N/A"}
                <br />
                From:{" "}
                {formatDate(data[data.length - 1].createdAt)}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between w-full">
                <span>All Time Stats</span>
                <span>
                  <ToggleGroup
                    variant="outline"
                    type="single"
                    value={dataView}
                    onValueChange={(val) => {
                      if (val) setDataView(val as DataView);
                    }}
                  >
                    <ToggleGroupItem value="graph" aria-label="Graph view">
                      <TimelineIcon className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="list" aria-label="List view">
                      <FormatListBulletedIcon className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </span>
              </div>
            </CardTitle>
            <CardDescription>
              All time soul eggs, prophecy eggs, and prestiges over time.
            </CardDescription>
          </CardHeader>
          {dataView === "list" ? (
            <AllTimeStatsTable data={data} />
          ) : (
            <AllTimeStatsGraph data={data} />
          )}
        </Card>
      </div>
    </div>
  );
}
