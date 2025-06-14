"use client";
import { CartesianGrid, XAxis, Line, LineChart, TooltipProps } from "recharts";
import { useDataContext } from "./_contexts/data-context";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Stats } from "./_types/stats";
import { formatLargeNumber } from "../_shared/number-format";
import TimelineIcon from "@mui/icons-material/Timeline";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useState } from "react";

const chartConfig = {
  today: {
    label: "Today",
    color: "var(--primary)",
  },
  average: {
    label: "Average",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const CustomToolTip = ({ active, payload, label }: TooltipProps<any, any>) => {
  if (!active || !payload || !payload.length) return null;
  const data: Stats = payload[0]["payload"];
  return (
    <div className="p-2 bg-popover rounded shadow">
      <div className="font-semibold mb-1">
        {new Date(data.createdAt).toLocaleString([], {
          weekday: "long",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
      <div>Soul Eggs: </div>
      <div>Prophecy Eggs: {data.prophecyEggs}</div>
      <div>Prestiges: {data.prestiges}</div>
    </div>
  );
};

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

  console.log(dataView);

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
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="w-full md:h-[200px]"
            >
              <LineChart
                accessibilityLayer
                data={data}
                margin={{
                  top: 5,
                  right: 10,
                  left: 16,
                  bottom: 0,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="createdAt"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="soulEggs"
                  strokeWidth={2}
                  stroke="var(--color-today)"
                  dot={{
                    fill: "var(--color-today)",
                  }}
                  activeDot={{
                    r: 5,
                  }}
                />
                <ChartTooltip content={<CustomToolTip />} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
